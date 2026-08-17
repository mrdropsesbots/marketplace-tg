const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name as category_name FROM favorites f
       JOIN products p ON f.product_id=p.id LEFT JOIN categories c ON p.category_id=c.id
       WHERE f.user_id=? AND p.status='active' AND p.moderation_status='approved'`, [req.user.telegram_id]);
    for (const p of rows) {
      const [imgs] = await db.query('SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order', [p.id]);
      p.images = imgs;
    }
    res.json(rows);
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?,?)', [req.user.telegram_id, req.params.id]);
    res.json({ message: 'Added' });
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM favorites WHERE user_id=? AND product_id=?', [req.user.telegram_id, req.params.id]);
    res.json({ message: 'Removed' });
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;