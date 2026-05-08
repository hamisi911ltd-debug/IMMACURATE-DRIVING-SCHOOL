// POST /api/messages/send
// Send a message to a student

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    if (!data.student || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Student and message are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await context.env.DB.prepare(`
      INSERT INTO messages (
        message_id, student_id, subject, message_text, 
        direction, status, sent_at
      ) VALUES (?, ?, ?, ?, 'outgoing', 'sent', datetime('now'))
    `).bind(
      messageId,
      data.student,
      data.subject || 'Message from School',
      data.message
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully',
      messageId: messageId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
