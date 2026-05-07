// =====================================================
// CLOUDFLARE WORKERS API EXAMPLES FOR DSMS
// =====================================================

// This file shows how to create API endpoints that connect
// your frontend to the Cloudflare D1 database

// =====================================================
// MAIN WORKER ENTRY POINT
// =====================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers for frontend requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route requests to appropriate handlers
      if (path.startsWith('/api/auth')) {
        return handleAuth(request, env, corsHeaders);
      } else if (path.startsWith('/api/students')) {
        return handleStudents(request, env, corsHeaders);
      } else if (path.startsWith('/api/courses')) {
        return handleCourses(request, env, corsHeaders);
      } else if (path.startsWith('/api/lessons')) {
        return handleLessons(request, env, corsHeaders);
      } else if (path.startsWith('/api/payments')) {
        return handlePayments(request, env, corsHeaders);
      } else if (path.startsWith('/api/messages')) {
        return handleMessages(request, env, corsHeaders);
      } else if (path.startsWith('/api/dashboard')) {
        return handleDashboard(request, env, corsHeaders);
      } else {
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// =====================================================
// AUTHENTICATION HANDLERS
// =====================================================

async function handleAuth(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = await request.json();
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT * FROM system_users WHERE email = ? AND status = "active"'
    ).bind(email).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // In production, use proper password hashing (bcrypt)
    // For now, simple comparison (replace with bcrypt.compare)
    const isValidPassword = password === '911Hamisi.'; // Temporary for demo

    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update last login
    await env.DB.prepare(
      'UPDATE system_users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(user.user_id).run();

    // Return user data (exclude password)
    const { password_hash, ...userData } = user;
    
    return new Response(JSON.stringify({
      success: true,
      user: userData,
      // In production, return JWT token here
      token: 'jwt-token-placeholder'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// STUDENT HANDLERS
// =====================================================

async function handleStudents(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // GET /api/students - List all students
  if (path === '/api/students' && method === 'GET') {
    const students = await env.DB.prepare(`
      SELECT 
        s.*,
        se.course_id,
        c.name as course_name,
        se.progress_percentage,
        sb.balance_due,
        sb.status as payment_status
      FROM students s
      LEFT JOIN student_enrollments se ON s.student_id = se.student_id
      LEFT JOIN courses c ON se.course_id = c.course_id
      LEFT JOIN student_balances sb ON s.student_id = sb.student_id
      ORDER BY s.created_at DESC
    `).all();

    return new Response(JSON.stringify(students), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // POST /api/students - Create new student
  if (path === '/api/students' && method === 'POST') {
    const studentData = await request.json();
    const studentId = `student-${Date.now()}`;

    // Insert student
    await env.DB.prepare(`
      INSERT INTO students (student_id, first_name, last_name, email, phone, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      studentId,
      studentData.firstName,
      studentData.lastName,
      studentData.email,
      studentData.phone,
      'admin-001' // In production, get from JWT token
    ).run();

    // If course selected, create enrollment
    if (studentData.course) {
      const enrollmentId = `enrollment-${Date.now()}`;
      await env.DB.prepare(`
        INSERT INTO student_enrollments (enrollment_id, student_id, course_id)
        VALUES (?, ?, ?)
      `).bind(enrollmentId, studentId, studentData.course).run();

      // Initialize balance
      const course = await env.DB.prepare(
        'SELECT total_fee FROM courses WHERE course_id = ?'
      ).bind(studentData.course).first();

      await env.DB.prepare(`
        INSERT INTO student_balances (student_id, total_fees)
        VALUES (?, ?)
      `).bind(studentId, course.total_fee).run();
    }

    return new Response(JSON.stringify({ 
      success: true, 
      studentId,
      message: 'Student registered successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// COURSE HANDLERS
// =====================================================

async function handleCourses(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  // GET /api/courses - List all courses
  if (method === 'GET') {
    const courses = await env.DB.prepare(`
      SELECT 
        c.*,
        COUNT(se.id) as enrolled_students
      FROM courses c
      LEFT JOIN student_enrollments se ON c.course_id = se.course_id
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    return new Response(JSON.stringify(courses), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// LESSON HANDLERS
// =====================================================

async function handleLessons(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // GET /api/lessons/schedule - Get today's schedule
  if (path === '/api/lessons/schedule' && method === 'GET') {
    const schedule = await env.DB.prepare(`
      SELECT * FROM instructor_schedule 
      WHERE scheduled_date = DATE('now')
      ORDER BY scheduled_time
    `).all();

    return new Response(JSON.stringify(schedule), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // POST /api/lessons - Schedule new lesson
  if (path === '/api/lessons' && method === 'POST') {
    const lessonData = await request.json();
    const lessonId = `lesson-${Date.now()}`;

    await env.DB.prepare(`
      INSERT INTO lessons (
        lesson_id, student_id, course_id, instructor_id, vehicle_id,
        lesson_type, scheduled_date, scheduled_time, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      lessonId,
      lessonData.student,
      lessonData.course || 'class-b', // Default course
      lessonData.instructor,
      lessonData.vehicle,
      lessonData.lessonType,
      lessonData.date,
      lessonData.time,
      'admin-001'
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      lessonId,
      message: 'Lesson scheduled successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// PAYMENT HANDLERS
// =====================================================

async function handlePayments(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // POST /api/payments - Record new payment
  if (path === '/api/payments' && method === 'POST') {
    const paymentData = await request.json();
    
    // Get next receipt number
    const receiptCounter = await env.DB.prepare(
      'SELECT setting_value FROM system_settings WHERE setting_key = "receipt_counter"'
    ).first();
    
    const receiptNumber = String(receiptCounter.setting_value).padStart(3, '0');
    const paymentId = `payment-${Date.now()}`;

    // Record payment
    await env.DB.prepare(`
      INSERT INTO payments (
        payment_id, receipt_number, student_id, amount, 
        payment_method, reference_number, processed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      paymentId,
      receiptNumber,
      paymentData.student,
      paymentData.amount,
      paymentData.method,
      paymentData.reference,
      'admin-001'
    ).run();

    // Update receipt counter
    await env.DB.prepare(
      'UPDATE system_settings SET setting_value = ? WHERE setting_key = "receipt_counter"'
    ).bind(parseInt(receiptCounter.setting_value) + 1).run();

    return new Response(JSON.stringify({ 
      success: true, 
      paymentId,
      receiptNumber,
      message: 'Payment recorded successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // GET /api/payments/summary - Payment summary
  if (path === '/api/payments/summary' && method === 'GET') {
    const summary = await env.DB.prepare(`
      SELECT * FROM payment_summary
      ORDER BY last_payment_date DESC
    `).all();

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// MESSAGE HANDLERS
// =====================================================

async function handleMessages(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // GET /api/messages - Get messages for user
  if (path === '/api/messages' && method === 'GET') {
    const messages = await env.DB.prepare(`
      SELECT * FROM messages 
      WHERE recipient_type = 'admin' OR recipient_type = 'all'
      ORDER BY sent_at DESC
      LIMIT 50
    `).all();

    return new Response(JSON.stringify(messages), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // POST /api/messages/broadcast - Send broadcast message
  if (path === '/api/messages/broadcast' && method === 'POST') {
    const messageData = await request.json();
    const messageId = `msg-${Date.now()}`;

    await env.DB.prepare(`
      INSERT INTO messages (
        message_id, sender_type, sender_id, recipient_type,
        subject, message_body, message_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      messageId,
      'admin',
      'admin-001',
      messageData.recipients,
      'Broadcast Message',
      messageData.message,
      'announcement'
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      messageId,
      message: 'Broadcast sent successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// DASHBOARD HANDLERS
// =====================================================

async function handleDashboard(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    // Get dashboard statistics
    const stats = await Promise.all([
      // Total students
      env.DB.prepare('SELECT COUNT(*) as count FROM students WHERE status = "active"').first(),
      
      // Active courses
      env.DB.prepare('SELECT COUNT(*) as count FROM courses WHERE status = "active"').first(),
      
      // Monthly revenue
      env.DB.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM payments 
        WHERE status = 'completed' 
        AND payment_date >= DATE('now', 'start of month')
      `).first(),
      
      // Pending payments
      env.DB.prepare(`
        SELECT COUNT(*) as count 
        FROM student_balances 
        WHERE balance_due > 0
      `).first(),
      
      // Recent enrollments
      env.DB.prepare(`
        SELECT s.full_name, c.name as course_name, se.enrollment_date
        FROM student_enrollments se
        JOIN students s ON se.student_id = s.student_id
        JOIN courses c ON se.course_id = c.course_id
        ORDER BY se.enrollment_date DESC
        LIMIT 5
      `).all(),
      
      // Today's lessons
      env.DB.prepare(`
        SELECT * FROM instructor_schedule 
        WHERE scheduled_date = DATE('now')
        ORDER BY scheduled_time
        LIMIT 10
      `).all()
    ]);

    const dashboardData = {
      totalStudents: stats[0].count,
      activeCourses: stats[1].count,
      monthlyRevenue: stats[2].total,
      pendingPayments: stats[3].count,
      recentEnrollments: stats[4].results || [],
      todaysLessons: stats[5].results || []
    };

    return new Response(JSON.stringify(dashboardData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Generate unique IDs
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (Kenyan numbers)
function isValidPhone(phone) {
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone);
}

// =====================================================
// EXAMPLE FRONTEND INTEGRATION
// =====================================================

/*
// Frontend JavaScript example for calling these APIs:

// Login
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

// Get students
async function getStudents() {
  const response = await fetch('/api/students');
  return response.json();
}

// Add student
async function addStudent(studentData) {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return response.json();
}

// Get dashboard data
async function getDashboardData() {
  const response = await fetch('/api/dashboard');
  return response.json();
}

// Record payment
async function recordPayment(paymentData) {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  return response.json();
}
*/