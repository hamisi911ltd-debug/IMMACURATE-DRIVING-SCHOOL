// POST /api/auth/login
// Authenticate user

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    if (!data.email || !data.password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email and password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get user from database
    const user = await context.env.DB.prepare(
      'SELECT * FROM system_users WHERE email = ? AND status = "active"'
    ).bind(data.email).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // For now, simple password check (in production, use bcrypt)
    // This matches the default password from seed data
    const isValidPassword = data.password === '911Hamisi.';

    if (!isValidPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Update last login
    await context.env.DB.prepare(
      'UPDATE system_users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(user.user_id).run();

    // Return user data (exclude password)
    const { password_hash, ...userData } = user;
    
    return new Response(JSON.stringify({
      success: true,
      user: userData,
      message: 'Login successful'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
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