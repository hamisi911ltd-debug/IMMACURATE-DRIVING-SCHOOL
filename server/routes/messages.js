import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { query, execute } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// List messages
router.get('/list', asyncHandler(async (req, res) => {
  const { status, student } = req.query
  
  let sql = `
    SELECT 
      m.*,
      s.first_name,
      s.last_name,
      s.email,
      s.phone
    FROM messages m
    LEFT JOIN students s ON m.student_id = s.student_id
    WHERE 1=1
  `
  
  const params = []
  
  if (status) {
    sql += ' AND m.status = ?'
    params.push(status)
  }
  
  if (student) {
    sql += ' AND m.student_id = ?'
    params.push(student)
  }
  
  sql += ' ORDER BY m.sent_at DESC LIMIT 100'
  
  const messages = query(sql, params)

  res.json({
    success: true,
    messages,
    count: messages.length
  })
}))

// Send message
router.post('/send', asyncHandler(async (req, res) => {
  const { student, subject, message } = req.body
  
  if (!student || !message) {
    return res.status(400).json({
      success: false,
      error: 'Student and message are required'
    })
  }

  const messageId = `MSG-${uuidv4().slice(0, 8).toUpperCase()}`
  
  execute(`
    INSERT INTO messages (
      message_id, student_id, subject, message_text,
      direction, status, sent_at
    ) VALUES (?, ?, ?, ?, 'outgoing', 'sent', datetime('now'))
  `, [
    messageId,
    student,
    subject || 'Message from School',
    message
  ])

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    messageId
  })
}))

// Broadcast message
router.post('/broadcast', asyncHandler(async (req, res) => {
  const { subject, message, recipients } = req.body
  
  if (!message || !recipients) {
    return res.status(400).json({
      success: false,
      error: 'Message and recipients are required'
    })
  }

  let studentIds = []
  
  if (recipients === 'all') {
    const students = query(
      'SELECT student_id FROM students WHERE status = "active"'
    )
    studentIds = students.map(s => s.student_id)
  } else if (Array.isArray(recipients)) {
    studentIds = recipients
  }

  for (const studentId of studentIds) {
    const messageId = `MSG-${uuidv4().slice(0, 8).toUpperCase()}`
    execute(`
      INSERT INTO messages (
        message_id, student_id, subject, message_text,
        direction, status, sent_at
      ) VALUES (?, ?, ?, ?, 'outgoing', 'sent', datetime('now'))
    `, [
      messageId,
      studentId,
      subject || 'Broadcast Message',
      message
    ])
  }

  res.status(201).json({
    success: true,
    message: `Broadcast sent to ${studentIds.length} students`,
    count: studentIds.length
  })
}))

export default router
