const express = require('express');
const router = express.Router();
const { dbAll } = require('../config/database');

router.get('/', async (req, res) => {
  const payments = await dbAll('SELECT * FROM payments ORDER BY payment_date DESC');
  res.render('payments/list', { title: 'Payments', payments });
});

module.exports = router;
