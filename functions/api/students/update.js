// PUT /api/students/update
// Update student information

export async function onRequestPut(context) {
  try {
    const data = await context.request.json();
    
    if (!data.studentId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Student ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (data.firstName) {
      updates.push('first_name = ?');
      values.push(data.firstName);
    }
    if (data.lastName) {
      updates.push('last_name = ?');
      values.push(data.lastName);
    }
    if (data.email) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.phone) {
      updates.push('phone = ?');
      values.push(data.phone);
    }
    if (data.address) {
      updates.push('address = ?');
      values.push(data.address);
    }
    if (data.status) {
      updates.push('status = ?');
      values.push(data.status);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No fields to update'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    values.push(data.studentId);

    await context.env.DB.prepare(`
      UPDATE students 
      SET ${updates.join(', ')}
      WHERE student_id = ?
    `).bind(...values).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Student updated successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
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
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
