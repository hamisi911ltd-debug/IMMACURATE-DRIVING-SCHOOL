import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { query, execute } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// List lessons
router.get('/list', asyncHandler(async (req, res) => {
  const { date, student, instructor, status } = req.query
  
  let sql = `
    SELECT 
      l.*,
      s.first_name || ' ' || s.last_name as student_name,
      i.first_name || ' ' || i.last_name as instructor_name,
      v.registration_number as vehicle_registration,
      v.make || ' ' || v.model as vehicle_name
    FROM lessons l
    LEFT JOIN students s ON l.student_id = s.student_id
    LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
    LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
    WHERE 1=1
  `
  
  const params = []
  
  if (date) {
    sql += ' AND l.lesson_date = ?'
    params.push(date)
  } else {
    sql += ' AND l.lesson_date >= date("now")'
  }
  
  if (student) {
    sql += ' AND l.student_id = ?'
    params.push(student)
  }
  
  if (instructor) {
    sql += ' AND l.instructor_id = ?'
    params.push(instructor)
  }
  
  if (status) {
    sql += ' AND l.status = ?'
    params.push(status)
  }
  
  sql += ' ORDER BY l.lesson_date, l.start_time'
  
  const lessons = query(sql, params)

  res.json({
    success: true,
    lessons,
    count: lessons.length
  })
}))

// Schedule lesson
router.post('/schedule', asyncHandler(async (req, res) => {
  const { student, instructor, vehicle, date, time, duration, lessonType } = req.body
  
  if (!student || !instructor || !vehicle || !date || !time) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    })
  }

  const lessonId = `LES-${uuidv4().slice(0, 8).toUpperCase()}`
  
  execute(`
    INSERT INTO lessons (
      lesson_id, student_id, instructor_id, vehicle_id,
      lesson_date, start_time, duration_minutes, lesson_type, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
  `, [
    lessonId,
    student,
    instructor,
    vehicle,
    date,
    time,
    duration || 60,
    lessonType || 'practical'
  ])

  res.status(201).json({
    success: true,
    message: 'Lesson scheduled successfully',
    lessonId
  })
}))

// Update lesson
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status, notes } = req.body
  
  const updates = []
  const values = []
  
  if (status) {
    updates.push('status = ?')
    values.push(status)
  }
  if (notes) {
    updates.push('notes = ?')
    values.push(notes)
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No fields to update'
    })
  }

  values.push(id)

  execute(`
    UPDATE lessons 
    SET ${updates.join(', ')}
    WHERE lesson_id = ?
  `, values)

  res.json({
    success: true,
    message: 'Lesson updated successfully'
  })
}))

export default router
