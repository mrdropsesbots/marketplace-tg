const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

async function isAdmin(req, res, next) {
  const [rows] = await db.query('SELECT is_admin FROM users WHERE telegram_id=?', [req.user.telegram_id]);
  if (!rows[0]?.is_admin) return res.status(403).json({ message: 'Admin only' });
  next();
}

router.get('/moderation', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name as category_name, u.first_name as user_first_name
       FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN users u ON p.user_id=u.telegram_id
       WHERE p.moderation_status='pending' ORDER BY p.created_at DESC`);
    for (const p of rows) {
      const [imgs] = await db.query('SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order', [p.id]);
      p.images = imgs;
    }
    res.json(rows);
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/moderation/:id/approve', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query("UPDATE products SET moderation_status='approved' WHERE id=?", [req.params.id]);
    await db.query('INSERT INTO moderation_logs (product_id, moderator_id, action, reason) VALUES (?,?,?,?)',
      [req.params.id, req.user.telegram_id, 'approve', null]);
    res.json({ message: 'Approved' });
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/moderation/:id/reject', verifyToken, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    await db.query("UPDATE products SET moderation_status='rejected', rejection_reason=? WHERE id=?", [reason, req.params.id]);
    await db.query('INSERT INTO moderation_logs (product_id, moderator_id, action, reason) VALUES (?,?,?,?)',
      [req.params.id, req.user.telegram_id, 'reject', reason]);
    res.json({ message: 'Rejected' });
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;