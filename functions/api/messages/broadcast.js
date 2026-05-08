// POST /api/messages/broadcast
// Send broadcast message to multiple students

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    if (!data.message || !data.recipients) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message and recipients are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    let studentIds = [];
    
    // Get student IDs based on recipient type
    if (data.recipients === 'all') {
      const { results } = await context.env.DB.prepare(
        'SELECT student_id FROM students WHERE status = "active"'
      ).all();
      studentIds = results.map(r => r.student_id);
    } else if (data.recipients === 'course') {
      const { results } = await context.env.DB.prepare(`
        SELECT DISTINCT s.student_id 
        FROM students s
        JOIN student_enrollments se ON s.student_id = se.student_id
        WHERE se.course_id = ? AND s.status = "active"
      `).bind(data.courseId).all();
      studentIds = results.map(r => r.student_id);
    } else if (Array.isArray(data.recipients)) {
      studentIds = data.recipients;
    }

    // Send message to each student
    const messagePromises = studentIds.map(studentId => {
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return context.env.DB.prepare(`
        INSERT INTO messages (
          message_id, student_id, subject, message_text,
          direction, status, sent_at
        ) VALUES (?, ?, ?, ?, 'outgoing', 'sent', datetime('now'))
      `).bind(
        messageId,
        studentId,
        data.subject || 'Broadcast Message',
        data.message
      ).run();
    });

    await Promise.all(messagePromises);

    return new Response(JSON.stringify({
      success: true,
      message: `Broadcast sent to ${studentIds.length} students`,
      count: studentIds.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
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
