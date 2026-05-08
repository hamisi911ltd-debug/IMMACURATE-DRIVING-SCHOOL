// POST /api/students/register
// Register a new student

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
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

    // Generate unique student ID
    const studentId = `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert student
    await context.env.DB.prepare(`
      INSERT INTO students (
        student_id, first_name, last_name, email, phone, created_by
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      studentId,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      'admin-001'
    ).run();

    // If course is selected, create enrollment
    if (data.course) {
      const enrollmentId = `enrollment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await context.env.DB.prepare(`
        INSERT INTO student_enrollments (
          enrollment_id, student_id, course_id, status
        ) VALUES (?, ?, ?, 'enrolled')
      `).bind(enrollmentId, studentId, data.course).run();

      // Get course fee and initialize balance
      const course = await context.env.DB.prepare(
        'SELECT total_fee FROM courses WHERE course_id = ?'
      ).bind(data.course).first();

      if (course) {
        await context.env.DB.prepare(`
          INSERT INTO student_balances (
            student_id, total_fees, total_paid, status
          ) VALUES (?, ?, 0, 'current')
        `).bind(studentId, course.total_fee).run();
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Student registered successfully',
      studentId: studentId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error registering student:', error);
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