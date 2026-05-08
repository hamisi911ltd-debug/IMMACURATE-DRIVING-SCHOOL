// GET /api/courses/list
// List all active courses

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT 
        c.*,
        COUNT(se.id) as enrolled_students
      FROM courses c
      LEFT JOIN student_enrollments se ON c.course_id = se.course_id
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    return new Response(JSON.stringify({
      success: true,
      courses: results,
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
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