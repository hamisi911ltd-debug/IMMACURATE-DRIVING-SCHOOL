// GET /api/lessons/list
// List today's lessons

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT 
        l.*,
        s.first_name || ' ' || s.last_name as student_name,
        i.name as instructor_name,
        v.registration_number as vehicle_reg,
        c.name as course_name
      FROM lessons l
      JOIN students s ON l.student_id = s.student_id
      JOIN instructors i ON l.instructor_id = i.instructor_id
      JOIN courses c ON l.course_id = c.course_id
      LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
      WHERE l.scheduled_date = DATE('now')
      ORDER BY l.scheduled_time
    `).all();

    return new Response(JSON.stringify({
      success: true,
      lessons: results,
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
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