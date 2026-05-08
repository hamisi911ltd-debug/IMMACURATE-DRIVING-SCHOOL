// GET /api/students/list
// List all students with their enrollment and balance information

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
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
      WHERE s.status != 'dropped'
      ORDER BY s.created_at DESC
    `).all();

    return new Response(JSON.stringify({
      success: true,
      students: results,
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
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