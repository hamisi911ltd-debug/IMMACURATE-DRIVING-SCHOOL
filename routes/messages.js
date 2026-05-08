const express = require('express');
const router = express.Router();
const { dbAll } = require('../config/database');

router.get('/', async (req, res) => {
  const messages = await dbAll('SELECT * FROM messages ORDER BY sent_at DESC');
  res.render('messages/list', { title: 'Messages', messages });
});

module.exports = router;
