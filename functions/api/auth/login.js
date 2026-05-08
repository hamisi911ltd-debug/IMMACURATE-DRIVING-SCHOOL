import { generateToken, verifyPassword } from '../_auth.js'

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email and password are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Find user in D1 database
    const user = await env.DB.prepare(
      'SELECT * FROM system_users WHERE email = ? AND status = ?'
    ).bind(email, 'active').first()

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify password
    const isValid = verifyPassword(password, user.password_hash)

    if (!isValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate token
    const token = generateToken(user.user_id)

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      },
      token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Login failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
