const express = require('express');
const router = express.Router();
const { dbAll, dbGet, dbRun } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  const students = await dbAll(`
    SELECT s.*, c.name as course_name, se.progress_percentage, sb.balance_due
    FROM students s
    LEFT JOIN student_enrollments se ON s.student_id = se.student_id
    LEFT JOIN courses c ON se.course_id = c.course_id
    LEFT JOIN student_balances sb ON s.student_id = sb.student_id
    ORDER BY s.created_at DESC
  `);
  res.render('students/list', { title: 'Students', students });
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, course } = req.body;
    const studentId = `student-${Date.now()}-${uuidv4().slice(0, 8)}`;
    
    await dbRun(`INSERT INTO students (student_id, first_name, last_name, email, phone, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
      [studentId, firstName, lastName, email, phone, req.session.user.id]);
    
    if (course) {
      await dbRun(`INSERT INTO student_enrollments (enrollment_id, student_id, course_id, status) VALUES (?, ?, ?, 'enrolled')`,
        [`enroll-${Date.now()}`, studentId, course]);
    }
    
    res.json({ success: true, studentId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
