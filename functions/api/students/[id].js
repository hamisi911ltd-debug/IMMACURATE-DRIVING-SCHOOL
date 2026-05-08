import { authenticate } from '../_auth.js'

export async function onRequestGet(context) {
  const { request, env, params } = context

  try {
    // Authenticate user
    await authenticate(request)

    const studentId = params.id

    // Get student details
    const student = await env.DB.prepare(`
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
    `).bind(studentId).first()

    if (!student) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Student not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get payments
    const { results: payments } = await env.DB.prepare(`
      SELECT * FROM payments 
      WHERE student_id = ? 
      ORDER BY payment_date DESC 
      LIMIT 10
    `).bind(studentId).all()

    // Get lessons
    const { results: lessons } = await env.DB.prepare(`
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
    `).bind(studentId).all()

    return new Response(JSON.stringify({
      success: true,
      student,
      payments,
      lessons
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Get student error:', error)

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch student'
    }), {
      status: error.message === 'No token provided' || error.message === 'Invalid or expired token' ? 401 : 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
