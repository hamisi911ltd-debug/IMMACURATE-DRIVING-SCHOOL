import express from 'express'
import { queryOne } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// Get dashboard stats
router.get('/stats', asyncHandler(async (req, res) => {
  const totalStudents = queryOne(
    'SELECT COUNT(*) as count FROM students'
  )

  const activeStudents = queryOne(
    'SELECT COUNT(*) as count FROM students WHERE status = ?',
    ['active']
  )

  const monthlyRevenue = queryOne(`
    SELECT COALESCE(SUM(amount), 0) as total 
    FROM payments 
    WHERE payment_date >= date('now', 'start of month')
  `)

  const pendingPayments = queryOne(`
    SELECT COUNT(*) as count 
    FROM student_balances 
    WHERE balance_due > 0
  `)

  const activeCourses = queryOne(
    'SELECT COUNT(*) as count FROM courses WHERE status = ?',
    ['active']
  )

  const todayLessons = queryOne(`
    SELECT COUNT(*) as count 
    FROM lessons 
    WHERE lesson_date = date('now')
  `)

  res.json({
    success: true,
    stats: {
      totalStudents: totalStudents.count,
      activeStudents: activeStudents.count,
      monthlyRevenue: monthlyRevenue.total,
      pendingPayments: pendingPayments.count,
      activeCourses: activeCourses.count,
      todayLessons: todayLessons.count
    }
  })
}))

export default router
