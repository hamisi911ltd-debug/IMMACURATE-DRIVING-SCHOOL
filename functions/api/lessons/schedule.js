// POST /api/lessons/schedule
// Schedule a new lesson

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // Validate required fields
    if (!data.student || !data.instructor || !data.date || !data.time) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const lessonId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get student's course
    const enrollment = await context.env.DB.prepare(
      'SELECT course_id FROM student_enrollments WHERE student_id = ? LIMIT 1'
    ).bind(data.student).first();

    const courseId = enrollment?.course_id || 'class-b';

    // Insert lesson
    await context.env.DB.prepare(`
      INSERT INTO lessons (
        lesson_id, student_id, course_id, instructor_id, vehicle_id,
        lesson_type, scheduled_date, scheduled_time, 
        duration_minutes, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', 'admin-001')
    `).bind(
      lessonId,
      data.student,
      courseId,
      data.instructor,
      data.vehicle || null,
      data.lessonType || 'practical',
      data.date,
      data.time,
      data.duration || 60
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Lesson scheduled successfully',
      lessonId: lessonId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error scheduling lesson:', error);
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

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}