const express = require('express');
const router = express.Router();
const { dbAll, dbGet, dbRun } = require('../config/database');

// Students API
router.get('/students/list', async (req, res) => {
  const students = await dbAll(`SELECT s.*, c.name as course_name, se.progress_percentage, sb.balance_due FROM students s LEFT JOIN student_enrollments se ON s.student_id = se.student_id LEFT JOIN courses c ON se.course_id = c.course_id LEFT JOIN student_balances sb ON s.student_id = sb.student_id`);
  res.json({ success: true, students, count: students.length });
});

router.get('/courses/list', async (req, res) => {
  const courses = await dbAll('SELECT * FROM courses WHERE status = "active"');
  res.json({ success: true, courses, count: courses.length });
});

router.get('/dashboard/stats', async (req, res) => {
  const stats = {
    totalStudents: (await dbGet('SELECT COUNT(*) as count FROM students')).count,
    activeStudents: (await dbGet('SELECT COUNT(*) as count FROM students WHERE status = "active"')).count,
    monthlyRevenue: (await dbGet('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_date >= date("now", "start of month")')).total,
    pendingPayments: (await dbGet('SELECT COUNT(*) as count FROM student_balances WHERE balance_due > 0')).count,
    activeCourses: (await dbGet('SELECT COUNT(*) as count FROM courses WHERE status = "active"')).count
  };
  res.json({ success: true, stats });
});

module.exports = router;
