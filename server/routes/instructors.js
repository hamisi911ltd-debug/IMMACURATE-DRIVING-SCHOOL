import express from 'express'
import { query } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// List instructors
router.get('/list', asyncHandler(async (req, res) => {
  const instructors = query(`
    SELECT * FROM instructors 
    WHERE status = 'active'
    ORDER BY first_name, last_name
  `)

  res.json({
    success: true,
    instructors,
    count: instructors.length
  })
}))

export default router
