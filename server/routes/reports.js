import express from 'express'
import { query, queryOne } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// Generate report
router.post('/generate', asyncHandler(async (req, res) => {
  const { type } = req.body
  let reportData = {}

  switch (type) {
    case 'students':
      const students = query(`
        SELECT 
          s.*,
          c.name as course_name,
          se.progress_percentage,
          sb.balance_due
        FROM students s
        LEFT JOIN student_enrollments se ON s.student_id = se.student_id
        LEFT JOIN courses c ON se.course_id = c.course_id
        LEFT JOIN student_balances sb ON s.student_id = sb.student_id
        ORDER BY s.enrollment_date DESC
      `)
      reportData = { students, total: students.length }
      break

    case 'revenue':
      const payments = query(`
        SELECT 
          DATE(payment_date) as date,
          SUM(amount) as total,
          COUNT(*) as count,
          payment_method
        FROM payments
        WHERE payment_date >= date('now', '-30 days')
        GROUP BY DATE(payment_date), payment_method
        ORDER BY date DESC
      `)
      
      const totalRevenue = queryOne(`
        SELECT SUM(amount) as total FROM payments
        WHERE payment_date >= date('now', '-30 days')
      `)
      
      reportData = { payments, totalRevenue: totalRevenue.total || 0 }
      break

    case 'attendance':
      const lessons = query(`
        SELECT 
          l.*,
          s.first_name || ' ' || s.last_name as student_name,
          i.first_name || ' ' || i.last_name as instructor_name
        FROM lessons l
        LEFT JOIN students s ON l.student_id = s.student_id
        LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
        WHERE l.lesson_date >= date('now', '-30 days')
        ORDER BY l.lesson_date DESC
      `)
      reportData = { lessons }
      break

    case 'performance':
      const performance = query(`
        SELECT 
          s.student_id,
          s.first_name || ' ' || s.last_name as student_name,
          c.name as course_name,
          se.progress_percentage,
          se.lessons_completed,
          c.total_lessons
        FROM students s
        JOIN student_enrollments se ON s.student_id = se.student_id
        JOIN courses c ON se.course_id = c.course_id
        WHERE s.status = 'active'
        ORDER BY se.progress_percentage DESC
      `)
      reportData = { performance }
      break

    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid report type'
      })
  }

  res.json({
    success: true,
    reportType: type,
    data: reportData,
    generatedAt: new Date().toISOString()
  })
}))

export default router
