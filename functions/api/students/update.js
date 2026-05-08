import { authenticate } from '../_auth.js'

export async function onRequestPut(context) {
  const { request, env, params } = context

  try {
    // Authenticate user
    await authenticate(request)

    const studentId = params.id
    const { firstName, lastName, email, phone, status } = await request.json()

    const updates = []
    const values = []

    if (firstName) {
      updates.push('first_name = ?')
      values.push(firstName)
    }
    if (lastName) {
      updates.push('last_name = ?')
      values.push(lastName)
    }
    if (email) {
      updates.push('email = ?')
      values.push(email)
    }
    if (phone) {
      updates.push('phone = ?')
      values.push(phone)
    }
    if (status) {
      updates.push('status = ?')
      values.push(status)
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No fields to update'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    values.push(studentId)

    await env.DB.prepare(`
      UPDATE students 
      SET ${updates.join(', ')}
      WHERE student_id = ?
    `).bind(...values).run()

    return new Response(JSON.stringify({
      success: true,
      message: 'Student updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Update student error:', error)

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to update student'
    }), {
      status: error.message === 'No token provided' || error.message === 'Invalid or expired token' ? 401 : 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
