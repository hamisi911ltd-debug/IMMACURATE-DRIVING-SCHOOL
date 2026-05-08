import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { query, queryOne, execute } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// List students
router.get('/list', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, course } = req.query
  
  let sql = `
    SELECT 
      s.id,
      s.student_id,
      s.first_name,
      s.last_name,
      s.email,
      s.phone,
      s.status,
      s.enrollment_date,
      se.course_id,
      c.name as course_name,
      se.progress_percentage,
      se.lessons_completed,
      c.total_lessons,
      sb.balance_due,
      sb.total_fees,
      sb.total_paid,
      sb.status as payment_status
    FROM students s
    LEFT JOIN student_enrollments se ON s.student_id = se.student_id
    LEFT JOIN courses c ON se.course_id = c.course_id
    LEFT JOIN student_balances sb ON s.student_id = sb.student_id
    WHERE 1=1
  `
  
  const params = []
  
  if (status) {
    sql += ' AND s.status = ?'
    params.push(status)
  }
  
  if (course) {
    sql += ' AND se.course_id = ?'
    params.push(course)
  }
  
  sql += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit))
  
  const students = query(sql, params)
  
  res.json({
    success: true,
    students,
    count: students.length,
    page: parseInt(page),
    limit: parseInt(limit)
  })
}))

// Get student by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  
  const student = queryOne(`
    SELECT 
      s.*,
      se.course_id,
      c.name as course_name,
      c.description as course_description,
      c.total_fee as course_fee,
      se.progress_percentage,
      se.lessons_completed,
      se.status as enrollment_status,
      sb.total_fees,
      sb.total_paid,
      sb.balance_due,
      sb.status as payment_status
    FROM students s
    LEFT JOIN student_enrollments se ON s.student_id = se.student_id
    LEFT JOIN courses c ON se.course_id = c.course_id
    LEFT JOIN student_balances sb ON s.student_id = sb.student_id
    WHERE s.student_id = ?
  `, [id])

  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    })
  }

  // Get payments
  const payments = query(`
    SELECT * FROM payments 
    WHERE student_id = ? 
    ORDER BY payment_date DESC 
    LIMIT 10
  `, [id])

  // Get lessons
  const lessons = query(`
    SELECT 
      l.*,
      i.first_name || ' ' || i.last_name as instructor_name,
      v.registration_number
    FROM lessons l
    LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
    LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
    WHERE l.student_id = ?
    ORDER BY l.lesson_date DESC
    LIMIT 10
  `, [id])

  res.json({
    success: true,
    student,
    payments,
    lessons
  })
}))

// Register new student
router.post('/register', asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, course } = req.body
  
  // Validation
  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    })
  }

  // Check if email exists
  const existingEmail = queryOne(
    'SELECT student_id FROM students WHERE email = ?',
    [email]
  )

  if (existingEmail) {
    return res.status(409).json({
      success: false,
      error: 'A student with this email already exists',
      field: 'email'
    })
  }

  // Check if phone exists
  const existingPhone = queryOne(
    'SELECT student_id FROM students WHERE phone = ?',
    [phone]
  )

  if (existingPhone) {
    return res.status(409).json({
      success: false,
      error: 'A student with this phone number already exists',
      field: 'phone'
    })
  }

  const studentId = `STU-${uuidv4().slice(0, 8).toUpperCase()}`
  
  // Insert student
  execute(`
    INSERT INTO students (
      student_id, first_name, last_name, email, phone, 
      status, enrollment_date, created_by
    ) VALUES (?, ?, ?, ?, ?, 'active', date('now'), ?)
  `, [studentId, firstName, lastName, email, phone, req.userId])

  // If course selected, create enrollment
  if (course) {
    const enrollmentId = `ENR-${uuidv4().slice(0, 8).toUpperCase()}`
    
    execute(`
      INSERT INTO student_enrollments (
        enrollment_id, student_id, course_id, 
        status, start_date, progress_percentage, lessons_completed
      ) VALUES (?, ?, ?, 'enrolled', date('now'), 0, 0)
    `, [enrollmentId, studentId, course])

    // Get course fee and initialize balance
    const courseData = queryOne(
      'SELECT total_fee FROM courses WHERE course_id = ?',
      [course]
    )

    if (courseData) {
      execute(`
        INSERT INTO student_balances (
          student_id, total_fees, total_paid, balance_due, status
        ) VALUES (?, ?, 0, ?, 'current')
      `, [studentId, courseData.total_fee, courseData.total_fee])
    }
  }

  res.status(201).json({
    success: true,
    message: 'Student registered successfully',
    studentId
  })
}))

// Update student
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, email, phone, status } = req.body
  
  const updates = []
  const values = []
  
  if (firstName) {
    updates.push('first_name = ?')
    values.push(firstName)
  }
  if (lastName) {
    updates.push('last_name = ?')
    values.push(lastName)
  }
  if (email) {
    updates.push('email = ?')
    values.push(email)
  }
  if (phone) {
    updates.push('phone = ?')
    values.push(phone)
  }
  if (status) {
    updates.push('status = ?')
    values.push(status)
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No fields to update'
    })
  }

  values.push(id)

  execute(`
    UPDATE students 
    SET ${updates.join(', ')}
    WHERE student_id = ?
  `, values)

  res.json({
    success: true,
    message: 'Student updated successfully'
  })
}))

// Delete student
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  
  execute('DELETE FROM students WHERE student_id = ?', [id])
  
  res.json({
    success: true,
    message: 'Student deleted successfully'
  })
}))

export default router
