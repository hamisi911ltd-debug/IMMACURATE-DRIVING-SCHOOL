import { authenticate } from '../_auth.js'

function generateId(prefix) {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `${prefix}-${timestamp}${random}`.toUpperCase()
}

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    // Authenticate user
    const userId = await authenticate(request)

    // Parse request body
    const { firstName, lastName, email, phone, course } = await request.json()

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return new Response(JSON.stringify({
        success: false,
        error: 'All fields are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if email exists
    const existingEmail = await env.DB.prepare(
      'SELECT student_id FROM students WHERE email = ?'
    ).bind(email).first()

    if (existingEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'A student with this email already exists',
        field: 'email'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if phone exists
    const existingPhone = await env.DB.prepare(
      'SELECT student_id FROM students WHERE phone = ?'
    ).bind(phone).first()

    if (existingPhone) {
      return new Response(JSON.stringify({
        success: false,
        error: 'A student with this phone number already exists',
        field: 'phone'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const studentId = generateId('STU')

    // Insert student
    await env.DB.prepare(`
      INSERT INTO students (
        student_id, first_name, last_name, email, phone, 
        status, enrollment_date, created_by
      ) VALUES (?, ?, ?, ?, ?, 'active', date('now'), ?)
    `).bind(studentId, firstName, lastName, email, phone, userId).run()

    // If course selected, create enrollment
    if (course) {
      const enrollmentId = generateId('ENR')

      await env.DB.prepare(`
        INSERT INTO student_enrollments (
          enrollment_id, student_id, course_id, 
          status, start_date, progress_percentage, lessons_completed
        ) VALUES (?, ?, ?, 'enrolled', date('now'), 0, 0)
      `).bind(enrollmentId, studentId, course).run()

      // Get course fee and initialize balance
      const courseData = await env.DB.prepare(
        'SELECT total_fee FROM courses WHERE course_id = ?'
      ).bind(course).first()

      if (courseData) {
        await env.DB.prepare(`
          INSERT INTO student_balances (
            student_id, total_fees, total_paid, balance_due, status
          ) VALUES (?, ?, 0, ?, 'current')
        `).bind(studentId, courseData.total_fee, courseData.total_fee).run()
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Student registered successfully',
      studentId
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Register student error:', error)

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to register student'
    }), {
      status: error.message === 'No token provided' || error.message === 'Invalid or expired token' ? 401 : 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
