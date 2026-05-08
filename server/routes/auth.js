import express from 'express'
import bcrypt from 'bcryptjs'
import { queryOne } from '../config/database.js'
import { generateToken } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    })
  }

  // Find user
  const user = queryOne(
    'SELECT * FROM system_users WHERE email = ? AND status = ?',
    [email, 'active']
  )

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    })
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash)

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    })
  }

  // Generate token
  const token = generateToken(user.user_id)

  // Return user data
  res.json({
    success: true,
    user: {
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role
    },
    token
  })
}))

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

export default router
