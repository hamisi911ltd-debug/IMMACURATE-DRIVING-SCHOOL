// GET /api/vehicles/list
// List all vehicles

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT 
        vehicle_id,
        registration_number,
        make,
        model,
        year,
        vehicle_type,
        status,
        last_service_date,
        next_service_date
      FROM vehicles
      WHERE status = 'active'
      ORDER BY registration_number
    `).all();

    return new Response(JSON.stringify({
      success: true,
      vehicles: results,
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
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
