const express = require('express');
const router = express.Router();
const { dbAll } = require('../config/database');

router.get('/', async (req, res) => {
  const courses = await dbAll('SELECT * FROM courses WHERE status = "active"');
  res.render('courses/list', { title: 'Courses', courses });
});

module.exports = router;
