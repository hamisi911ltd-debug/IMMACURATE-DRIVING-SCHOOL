const express = require('express');
const router = express.Router();
const { dbAll } = require('../config/database');

router.get('/', async (req, res) => {
  const lessons = await dbAll('SELECT * FROM lessons ORDER BY lesson_date DESC');
  res.render('lessons/list', { title: 'Lessons', lessons });
});

module.exports = router;
