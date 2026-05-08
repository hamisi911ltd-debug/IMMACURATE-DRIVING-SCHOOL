import { authenticate } from '../_auth.js'

export async function onRequestGet(context) {
  const { request, env } = context

  try {
    // Authenticate user
    await authenticate(request)

    // Parse query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const status = url.searchParams.get('status')
    const course = url.searchParams.get('course')

    // Build query
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
    `

    const params = []

    if (status) {
      query += ' AND s.status = ?'
      params.push(status)
    }

    if (course) {
      query += ' AND se.course_id = ?'
      params.push(course)
    }

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, (page - 1) * limit)

    // Execute query
    const stmt = env.DB.prepare(query).bind(...params)
    const { results } = await stmt.all()

    return new Response(JSON.stringify({
      success: true,
      students: results,
      count: results.length,
      page,
      limit
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('List students error:', error)

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch students'
    }), {
      status: error.message === 'No token provided' || error.message === 'Invalid or expired token' ? 401 : 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
