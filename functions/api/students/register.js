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

    // Check if email already exists
    const existingEmail = await context.env.DB.prepare(
      'SELECT student_id FROM students WHERE email = ?'
    ).bind(data.email).first();

    if (existingEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'A student with this email already exists',
        field: 'email'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Check if phone already exists
    const existingPhone = await context.env.DB.prepare(
      'SELECT student_id FROM students WHERE phone = ?'
    ).bind(data.phone).first();

    if (existingPhone) {
      return new Response(JSON.stringify({
        success: false,
        error: 'A student with this phone number already exists',
        field: 'phone'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Generate unique student ID
    const studentId = `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert student
    try {
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
    } catch (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to register student. Please check if email or phone already exists.',
        details: insertError.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

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