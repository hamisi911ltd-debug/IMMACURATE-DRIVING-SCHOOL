const express = require('express');
const router = express.Router();
const { dbAll, dbGet } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const stats = {
      totalStudents: (await dbGet('SELECT COUNT(*) as count FROM students')).count,
      activeStudents: (await dbGet('SELECT COUNT(*) as count FROM students WHERE status = "active"')).count,
      monthlyRevenue: (await dbGet('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_date >= date("now", "start of month")')).total,
      pendingPayments: (await dbGet('SELECT COUNT(*) as count FROM student_balances WHERE balance_due > 0')).count,
      activeCourses: (await dbGet('SELECT COUNT(*) as count FROM courses WHERE status = "active"')).count
    };
    
    res.render('dashboard', { title: 'Dashboard', stats });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Failed to load dashboard', error });
  }
});

module.exports = router;
