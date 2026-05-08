// GET /api/instructors/list
// List all instructors

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT 
        instructor_id,
        first_name,
        last_name,
        email,
        phone,
        license_number,
        specialization,
        status,
        hire_date
      FROM instructors
      WHERE status = 'active'
      ORDER BY first_name, last_name
    `).all();

    return new Response(JSON.stringify({
      success: true,
      instructors: results,
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
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
