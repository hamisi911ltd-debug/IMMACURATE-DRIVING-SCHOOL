import express from 'express'
import { query, queryOne } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// List courses
router.get('/list', asyncHandler(async (req, res) => {
  const courses = query(`
    SELECT 
      course_id,
      name,
      description,
      total_lessons,
      duration_weeks,
      total_fee,
      theory_hours,
      practical_hours,
      status
    FROM courses
    WHERE status = 'active'
    ORDER BY name
  `)

  res.json({
    success: true,
    courses,
    count: courses.length
  })
}))

// Get course by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  
  const course = queryOne(
    'SELECT * FROM courses WHERE course_id = ?',
    [id]
  )

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    })
  }

  // Get enrolled students count
  const enrolled = queryOne(`
    SELECT COUNT(*) as count 
    FROM student_enrollments 
    WHERE course_id = ? AND status = 'enrolled'
  `, [id])

  res.json({
    success: true,
    course,
    enrolledCount: enrolled.count
  })
}))

export default router
