// Authentication utilities for Cloudflare Workers

export function generateToken(userId) {
  // Simple token generation - in production, use proper JWT
  const payload = {
    userId,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

export function verifyToken(token) {
  try {
    const payload = JSON.parse(atob(token))
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null
    }
    
    return payload
  } catch (error) {
    return null
  }
}

export async function authenticate(request) {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    throw new Error('Invalid or expired token')
  }

  return payload.userId
}

export function hashPassword(password) {
  // Simple hash - in production, use proper bcrypt or similar
  // For Cloudflare Workers, you might want to use Web Crypto API
  return btoa(password)
}

export function verifyPassword(password, hash) {
  return btoa(password) === hash
}
