// Main Backend Application
// Comprehensive DSMS Backend with all routes and handlers

import { Router, parseBody, validate, generateId, formatDate } from './router.js';

export function createApp() {
  const router = new Router();

  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  router.post('/api/auth/login', async (ctx) => {
    const body = await parseBody(ctx.request);
    
    const validation = validate(body, {
      email: { required: true, type: 'email' },
      password: { required: true, min: 6 }
    });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Check system users
    const user = await ctx.env.DB.prepare(
      'SELECT * FROM system_users WHERE email = ? AND status = "active"'
    ).bind(body.email).first();

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // In production, use proper password hashing (bcrypt)
    // For now, simple comparison
    if (user.password_hash !== body.password) {
      return { success: false, error: 'Invalid credentials' };
    }

    return {
      success: true,
      user: {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      },
      token: generateToken(user.user_id)
    };
  });

  // ============================================
  // STUDENTS ROUTES
  // ============================================
  
  router.get('/api/students/list', async (ctx) => {
    const { page = 1, limit = 50, status, course } = ctx.query;
    
    let query = `
      SELECT 
        s.id,
        s.student_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.status,
        s.enrollment_date,
        se.course_id,
        c.name as course_name,
        se.progress_percentage,
        se.lessons_completed,
        c.total_lessons,
        sb.balance_due,
        sb.total_fees,
        sb.total_paid,
        sb.status as payment_status
      FROM students s
      LEFT JOIN student_enrollments se ON s.student_id = se.student_id
      LEFT JOIN courses c ON se.course_id = c.course_id
      LEFT JOIN student_balances sb ON s.student_id = sb.student_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }
    
    if (course) {
      query += ' AND se.course_id = ?';
      params.push(course);
    }
    
    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const { results } = await ctx.env.DB.prepare(query).bind(...params).all();
    
    return {
      success: true,
      students: results,
      count: results.length,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  });

  router.get('/api/students/:id', async (ctx) => {
    const studentId = ctx.params.id;
    
    const student = await ctx.env.DB.prepare(`
      SELECT 
        s.*,
        se.course_id,
        c.name as course_name,
        c.description as course_description,
        c.total_fee as course_fee,
        se.progress_percentage,
        se.lessons_completed,
        se.status as enrollment_status,
        sb.total_fees,
        sb.total_paid,
        sb.balance_due,
        sb.status as payment_status
      FROM students s
      LEFT JOIN student_enrollments se ON s.student_id = se.student_id
      LEFT JOIN courses c ON se.course_id = c.course_id
      LEFT JOIN student_balances sb ON s.student_id = sb.student_id
      WHERE s.student_id = ?
    `).bind(studentId).first();

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Get payments
    const { results: payments } = await ctx.env.DB.prepare(`
      SELECT * FROM payments 
      WHERE student_id = ? 
      ORDER BY payment_date DESC 
      LIMIT 10
    `).bind(studentId).all();

    // Get lessons
    const { results: lessons } = await ctx.env.DB.prepare(`
      SELECT 
        l.*,
        i.first_name || ' ' || i.last_name as instructor_name,
        v.registration_number
      FROM lessons l
      LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
      LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
      WHERE l.student_id = ?
      ORDER BY l.lesson_date DESC
      LIMIT 10
    `).bind(studentId).all();

    return {
      success: true,
      student,
      payments,
      lessons
    };
  });

  router.post('/api/students/register', async (ctx) => {
    const body = await parseBody(ctx.request);
    
    const validation = validate(body, {
      firstName: { required: true, min: 2 },
      lastName: { required: true, min: 2 },
      email: { required: true, type: 'email' },
      phone: { required: true, type: 'phone' }
    });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Check if email already exists
    const existingEmail = await ctx.env.DB.prepare(
      'SELECT student_id FROM students WHERE email = ?'
    ).bind(body.email).first();

    if (existingEmail) {
      return { 
        success: false, 
        error: 'A student with this email already exists',
        field: 'email'
      };
    }

    // Check if phone already exists
    const existingPhone = await ctx.env.DB.prepare(
      'SELECT student_id FROM students WHERE phone = ?'
    ).bind(body.phone).first();

    if (existingPhone) {
      return { 
        success: false, 
        error: 'A student with this phone number already exists',
        field: 'phone'
      };
    }

    const studentId = generateId('student');
    
    try {
      await ctx.env.DB.prepare(`
        INSERT INTO students (
          student_id, first_name, last_name, email, phone, 
          status, enrollment_date, created_by
        ) VALUES (?, ?, ?, ?, ?, 'active', date('now'), 'admin-001')
      `).bind(
        studentId,
        body.firstName,
        body.lastName,
        body.email,
        body.phone
      ).run();
    } catch (error) {
      console.error('Error inserting student:', error);
      return {
        success: false,
        error: 'Failed to register student. Please check if email or phone already exists.',
        details: error.message
      };
    }

    // If course selected, create enrollment
    if (body.course) {
      const enrollmentId = generateId('enrollment');
      
      await ctx.env.DB.prepare(`
        INSERT INTO student_enrollments (
          enrollment_id, student_id, course_id, 
          status, start_date, progress_percentage, lessons_completed
        ) VALUES (?, ?, ?, 'enrolled', date('now'), 0, 0)
      `).bind(enrollmentId, studentId, body.course).run();

      // Get course fee and initialize balance
      const course = await ctx.env.DB.prepare(
        'SELECT total_fee FROM courses WHERE course_id = ?'
      ).bind(body.course).first();

      if (course) {
        await ctx.env.DB.prepare(`
          INSERT INTO student_balances (
            student_id, total_fees, total_paid, balance_due, status
          ) VALUES (?, ?, 0, ?, 'current')
        `).bind(studentId, course.total_fee, course.total_fee).run();
      }
    }

    return {
      success: true,
      message: 'Student registered successfully',
      studentId
    };
  });

  router.put('/api/students/:id', async (ctx) => {
    const studentId = ctx.params.id;
    const body = await parseBody(ctx.request);
    
    const updates = [];
    const values = [];
    
    if (body.firstName) {
      updates.push('first_name = ?');
      values.push(body.firstName);
    }
    if (body.lastName) {
      updates.push('last_name = ?');
      values.push(body.lastName);
    }
    if (body.email) {
      updates.push('email = ?');
      values.push(body.email);
    }
    if (body.phone) {
      updates.push('phone = ?');
      values.push(body.phone);
    }
    if (body.status) {
      updates.push('status = ?');
      values.push(body.status);
    }

    if (updates.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    values.push(studentId);

    await ctx.env.DB.prepare(`
      UPDATE students 
      SET ${updates.join(', ')}
      WHERE student_id = ?
    `).bind(...values).run();

    return {
      success: true,
      message: 'Student updated successfully'
    };
  });

  // ============================================
  // COURSES ROUTES
  // ============================================
  
  router.get('/api/courses/list', async (ctx) => {
    const { results } = await ctx.env.DB.prepare(`
      SELECT 
        course_id,
        name,
        description,
        total_lessons,
        duration_weeks,
        total_fee,
        theory_hours,
        practical_hours,
        status
      FROM courses
      WHERE status = 'active'
      ORDER BY name
    `).all();

    return {
      success: true,
      courses: results,
      count: results.length
    };
  });

  router.get('/api/courses/:id', async (ctx) => {
    const courseId = ctx.params.id;
    
    const course = await ctx.env.DB.prepare(
      'SELECT * FROM courses WHERE course_id = ?'
    ).bind(courseId).first();

    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    // Get enrolled students count
    const enrolled = await ctx.env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM student_enrollments 
      WHERE course_id = ? AND status = 'enrolled'
    `).bind(courseId).first();

    return {
      success: true,
      course,
      enrolledCount: enrolled.count
    };
  });

  // ============================================
  // LESSONS/SCHEDULE ROUTES
  // ============================================
  
  router.get('/api/lessons/list', async (ctx) => {
    const { date, student, instructor, status } = ctx.query;
    
    let query = `
      SELECT 
        l.*,
        s.first_name || ' ' || s.last_name as student_name,
        i.first_name || ' ' || i.last_name as instructor_name,
        v.registration_number as vehicle_registration,
        v.make || ' ' || v.model as vehicle_name
      FROM lessons l
      LEFT JOIN students s ON l.student_id = s.student_id
      LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
      LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (date) {
      query += ' AND l.lesson_date = ?';
      params.push(date);
    } else {
      query += ' AND l.lesson_date >= date("now")';
    }
    
    if (student) {
      query += ' AND l.student_id = ?';
      params.push(student);
    }
    
    if (instructor) {
      query += ' AND l.instructor_id = ?';
      params.push(instructor);
    }
    
    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY l.lesson_date, l.start_time';
    
    const { results } = await ctx.env.DB.prepare(query).bind(...params).all();

    return {
      success: true,
      lessons: results,
      count: results.length
    };
  });

  router.post('/api/lessons/schedule', async (ctx) => {
    const body = await parseBody(ctx.request);
    
    const validation = validate(body, {
      student: { required: true },
      instructor: { required: true },
      vehicle: { required: true },
      date: { required: true },
      time: { required: true }
    });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const lessonId = generateId('lesson');
    
    await ctx.env.DB.prepare(`
      INSERT INTO lessons (
        lesson_id, student_id, instructor_id, vehicle_id,
        lesson_date, start_time, duration_minutes, lesson_type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `).bind(
      lessonId,
      body.student,
      body.instructor,
      body.vehicle,
      body.date,
      body.time,
      body.duration || 60,
      body.lessonType || 'practical'
    ).run();

    return {
      success: true,
      message: 'Lesson scheduled successfully',
      lessonId
    };
  });

  // ============================================
  // PAYMENTS ROUTES
  // ============================================
  
  router.post('/api/payments/record', async (ctx) => {
    const body = await parseBody(ctx.request);
    
    const validation = validate(body, {
      student: { required: true },
      amount: { required: true, type: 'number' },
      method: { required: true }
    });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const paymentId = generateId('payment');
    const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`;
    
    await ctx.env.DB.prepare(`
      INSERT INTO payments (
        payment_id, student_id, amount, payment_method,
        payment_type, reference_number, receipt_number,
        payment_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, date('now'), 'completed')
    `).bind(
      paymentId,
      body.student,
      body.amount,
      body.method,
      body.paymentType || 'tuition',
      body.reference || '',
      receiptNumber
    ).run();

    // Update student balance
    await ctx.env.DB.prepare(`
      UPDATE student_balances
      SET total_paid = total_paid + ?,
          balance_due = balance_due - ?,
          last_payment_date = date('now')
      WHERE student_id = ?
    `).bind(body.amount, body.amount, body.student).run();

    return {
      success: true,
      message: 'Payment recorded successfully',
      paymentId,
      receiptNumber
    };
  });

  router.get('/api/payments/list', async (ctx) => {
    const { student, startDate, endDate } = ctx.query;
    
    let query = `
      SELECT 
        p.*,
        s.first_name || ' ' || s.last_name as student_name
      FROM payments p
      LEFT JOIN students s ON p.student_id = s.student_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (student) {
      query += ' AND p.student_id = ?';
      params.push(student);
    }
    
    if (startDate) {
      query += ' AND p.payment_date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND p.payment_date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY p.payment_date DESC LIMIT 100';
    
    const { results } = await ctx.env.DB.prepare(query).bind(...params).all();

    return {
      success: true,
      payments: results,
      count: results.length
    };
  });

  // ============================================
  // MESSAGES ROUTES
  // ============================================
  
  router.get('/api/messages/list', async (ctx) => {
    const { status, student } = ctx.query;
    
    let query = `
      SELECT 
        m.*,
        s.first_name,
        s.last_name,
        s.email,
        s.phone
      FROM messages m
      LEFT JOIN students s ON m.student_id = s.student_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND m.status = ?';
      params.push(status);
    }
    
    if (student) {
      query += ' AND m.student_id = ?';
      params.push(student);
    }
    
    query += ' ORDER BY m.sent_at DESC LIMIT 100';
    
    const { results } = await ctx.env.DB.prepare(query).bind(...params).all();

    return {
      success: true,
      messages: results,
      count: results.length
    };
  });

  router.post('/api/messages/send', async (ctx) => {
    const body = await parseBody(ctx.request);
    
    const validation = validate(body, {
      student: { required: true },
      message: { required: true, min: 1 }
    });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const messageId = generateId('msg');
    
    await ctx.env.DB.prepare(`
      INSERT INTO messages (
        message_id, student_id, subject, message_text,
        direction, status, sent_at
      ) VALUES (?, ?, ?, ?, 'outgoing', 'sent', datetime('now'))
    `).bind(
      messageId,
      body.student,
      body.subject || 'Message from School',
      body.message
    ).run();

    return {
      success: true,
      message: 'Message sent successfully',
      messageId
    };
  });

  router.post('/api/messages/broadcast', async (ctx) => {
    const body = await parseBody(ctx.request);
    
    const validation = validate(body, {
      message: { required: true, min: 1 },
      recipients: { required: true }
    });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    let studentIds = [];
    
    if (body.recipients === 'all') {
      const { results } = await ctx.env.DB.prepare(
        'SELECT student_id FROM students WHERE status = "active"'
      ).all();
      studentIds = results.map(r => r.student_id);
    } else if (Array.isArray(body.recipients)) {
      studentIds = body.recipients;
    }

    const messagePromises = studentIds.map(studentId => {
      const messageId = generateId('msg');
      return ctx.env.DB.prepare(`
        INSERT INTO messages (
          message_id, student_id, subject, message_text,
          direction, status, sent_at
        ) VALUES (?, ?, ?, ?, 'outgoing', 'sent', datetime('now'))
      `).bind(
        messageId,
        studentId,
        body.subject || 'Broadcast Message',
        body.message
      ).run();
    });

    await Promise.all(messagePromises);

    return {
      success: true,
      message: `Broadcast sent to ${studentIds.length} students`,
      count: studentIds.length
    };
  });

  // ============================================
  // INSTRUCTORS & VEHICLES ROUTES
  // ============================================
  
  router.get('/api/instructors/list', async (ctx) => {
    const { results } = await ctx.env.DB.prepare(`
      SELECT * FROM instructors 
      WHERE status = 'active'
      ORDER BY first_name, last_name
    `).all();

    return {
      success: true,
      instructors: results,
      count: results.length
    };
  });

  router.get('/api/vehicles/list', async (ctx) => {
    const { results } = await ctx.env.DB.prepare(`
      SELECT * FROM vehicles 
      WHERE status = 'active'
      ORDER BY registration_number
    `).all();

    return {
      success: true,
      vehicles: results,
      count: results.length
    };
  });

  // ============================================
  // DASHBOARD ROUTES
  // ============================================
  
  router.get('/api/dashboard/stats', async (ctx) => {
    const totalStudents = await ctx.env.DB.prepare(
      'SELECT COUNT(*) as count FROM students'
    ).first();

    const activeStudents = await ctx.env.DB.prepare(
      'SELECT COUNT(*) as count FROM students WHERE status = "active"'
    ).first();

    const monthlyRevenue = await ctx.env.DB.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM payments 
      WHERE payment_date >= date('now', 'start of month')
    `).first();

    const pendingPayments = await ctx.env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM student_balances 
      WHERE balance_due > 0
    `).first();

    const activeCourses = await ctx.env.DB.prepare(
      'SELECT COUNT(*) as count FROM courses WHERE status = "active"'
    ).first();

    return {
      success: true,
      stats: {
        totalStudents: totalStudents.count,
        activeStudents: activeStudents.count,
        monthlyRevenue: monthlyRevenue.total,
        pendingPayments: pendingPayments.count,
        activeCourses: activeCourses.count
      }
    };
  });

  // ============================================
  // REPORTS ROUTES
  // ============================================
  
  router.post('/api/reports/generate', async (ctx) => {
    const body = await parseBody(ctx.request);
    const reportType = body.type;

    let reportData = {};

    switch (reportType) {
      case 'students':
        const { results: students } = await ctx.env.DB.prepare(`
          SELECT 
            s.*,
            c.name as course_name,
            se.progress_percentage,
            sb.balance_due
          FROM students s
          LEFT JOIN student_enrollments se ON s.student_id = se.student_id
          LEFT JOIN courses c ON se.course_id = c.course_id
          LEFT JOIN student_balances sb ON s.student_id = sb.student_id
          ORDER BY s.enrollment_date DESC
        `).all();
        reportData = { students, total: students.length };
        break;

      case 'revenue':
        const { results: payments } = await ctx.env.DB.prepare(`
          SELECT 
            DATE(payment_date) as date,
            SUM(amount) as total,
            COUNT(*) as count,
            payment_method
          FROM payments
          WHERE payment_date >= date('now', '-30 days')
          GROUP BY DATE(payment_date), payment_method
          ORDER BY date DESC
        `).all();
        
        const totalRevenue = await ctx.env.DB.prepare(`
          SELECT SUM(amount) as total FROM payments
          WHERE payment_date >= date('now', '-30 days')
        `).first();
        
        reportData = { payments, totalRevenue: totalRevenue.total || 0 };
        break;

      case 'attendance':
        const { results: lessons } = await ctx.env.DB.prepare(`
          SELECT 
            l.*,
            s.first_name || ' ' || s.last_name as student_name,
            i.first_name || ' ' || i.last_name as instructor_name
          FROM lessons l
          LEFT JOIN students s ON l.student_id = s.student_id
          LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
          WHERE l.lesson_date >= date('now', '-30 days')
          ORDER BY l.lesson_date DESC
        `).all();
        reportData = { lessons };
        break;

      case 'performance':
        const { results: performance } = await ctx.env.DB.prepare(`
          SELECT 
            s.student_id,
            s.first_name || ' ' || s.last_name as student_name,
            c.name as course_name,
            se.progress_percentage,
            se.lessons_completed,
            c.total_lessons
          FROM students s
          JOIN student_enrollments se ON s.student_id = se.student_id
          JOIN courses c ON se.course_id = c.course_id
          WHERE s.status = 'active'
          ORDER BY se.progress_percentage DESC
        `).all();
        reportData = { performance };
        break;

      default:
        return { success: false, error: 'Invalid report type' };
    }

    return {
      success: true,
      reportType,
      data: reportData,
      generatedAt: new Date().toISOString()
    };
  });

  // Health check
  router.get('/api/health', async (ctx) => {
    return {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  });

  return router;
}

// Helper function to generate JWT token (simplified)
function generateToken(userId) {
  return `token-${userId}-${Date.now()}`;
}
