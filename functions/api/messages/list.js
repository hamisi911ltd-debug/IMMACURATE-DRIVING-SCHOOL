// GET /api/messages/list
// List all messages/conversations

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT 
        m.message_id,
        m.student_id,
        m.subject,
        m.message_text,
        m.direction,
        m.status,
        m.sent_at,
        m.read_at,
        s.first_name,
        s.last_name,
        s.email,
        s.phone
      FROM messages m
      LEFT JOIN students s ON m.student_id = s.student_id
      ORDER BY m.sent_at DESC
      LIMIT 100
    `).all();

    return new Response(JSON.stringify({
      success: true,
      messages: results,
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
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
