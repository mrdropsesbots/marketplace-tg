const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE is_active=1 ORDER BY sort_order');
    res.json(rows);
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;