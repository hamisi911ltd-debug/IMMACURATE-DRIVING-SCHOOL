// GET /api/students/:id
// Get single student details with enrollment and payment info

export async function onRequestGet(context) {
  try {
    const studentId = context.params.id;
    
    if (!studentId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Student ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get student with enrollment and balance info
    const student = await context.env.DB.prepare(`
      SELECT 
        s.id,
        s.student_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.date_of_birth,
        s.address,
        s.emergency_contact,
        s.emergency_phone,
        s.status,
        s.enrollment_date,
        s.created_at,
        se.course_id,
        c.name as course_name,
        c.description as course_description,
        c.total_fee as course_fee,
        c.total_lessons as course_total_lessons,
        se.progress_percentage,
        se.lessons_completed,
        se.status as enrollment_status,
        se.start_date as enrollment_start_date,
        se.completion_date,
        sb.total_fees,
        sb.total_paid,
        sb.balance_due,
        sb.last_payment_date,
        sb.status as payment_status
      FROM students s
      LEFT JOIN student_enrollments se ON s.student_id = se.student_id
      LEFT JOIN courses c ON se.course_id = c.course_id
      LEFT JOIN student_balances sb ON s.student_id = sb.student_id
      WHERE s.student_id = ?
      LIMIT 1
    `).bind(studentId).first();

    if (!student) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Student not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get student's payment history
    const { results: payments } = await context.env.DB.prepare(`
      SELECT 
        payment_id,
        amount,
        payment_method,
        payment_type,
        reference_number,
        receipt_number,
        payment_date,
        status
      FROM payments
      WHERE student_id = ?
      ORDER BY payment_date DESC
      LIMIT 10
    `).bind(studentId).all();

    // Get student's lesson history
    const { results: lessons } = await context.env.DB.prepare(`
      SELECT 
        l.lesson_id,
        l.lesson_date,
        l.start_time,
        l.duration_minutes,
        l.lesson_type,
        l.status,
        l.notes,
        i.first_name as instructor_first_name,
        i.last_name as instructor_last_name,
        v.registration_number,
        v.make,
        v.model
      FROM lessons l
      LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
      LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
      WHERE l.student_id = ?
      ORDER BY l.lesson_date DESC, l.start_time DESC
      LIMIT 10
    `).bind(studentId).all();

    return new Response(JSON.stringify({
      success: true,
      student: student,
      payments: payments,
      lessons: lessons
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
