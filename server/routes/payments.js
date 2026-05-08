import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { query, execute } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// List payments
router.get('/list', asyncHandler(async (req, res) => {
  const { student, startDate, endDate } = req.query
  
  let sql = `
    SELECT 
      p.*,
      s.first_name || ' ' || s.last_name as student_name
    FROM payments p
    LEFT JOIN students s ON p.student_id = s.student_id
    WHERE 1=1
  `
  
  const params = []
  
  if (student) {
    sql += ' AND p.student_id = ?'
    params.push(student)
  }
  
  if (startDate) {
    sql += ' AND p.payment_date >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    sql += ' AND p.payment_date <= ?'
    params.push(endDate)
  }
  
  sql += ' ORDER BY p.payment_date DESC LIMIT 100'
  
  const payments = query(sql, params)

  res.json({
    success: true,
    payments,
    count: payments.length
  })
}))

// Record payment
router.post('/record', asyncHandler(async (req, res) => {
  const { student, amount, method, paymentType, reference } = req.body
  
  if (!student || !amount || !method) {
    return res.status(400).json({
      success: false,
      error: 'Student, amount, and payment method are required'
    })
  }

  const paymentId = `PAY-${uuidv4().slice(0, 8).toUpperCase()}`
  const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`
  
  execute(`
    INSERT INTO payments (
      payment_id, student_id, amount, payment_method,
      payment_type, reference_number, receipt_number,
      payment_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, date('now'), 'completed')
  `, [
    paymentId,
    student,
    amount,
    method,
    paymentType || 'tuition',
    reference || '',
    receiptNumber
  ])

  // Update student balance
  execute(`
    UPDATE student_balances
    SET total_paid = total_paid + ?,
        balance_due = balance_due - ?,
        last_payment_date = date('now')
    WHERE student_id = ?
  `, [amount, amount, student])

  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    paymentId,
    receiptNumber
  })
}))

export default router
