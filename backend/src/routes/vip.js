const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.get('/status', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT telegram_id, username, first_name, last_name, is_admin, is_vip, vip_until FROM users WHERE telegram_id=?',
      [req.user.telegram_id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    const user = rows[0];
    if (user.vip_until && new Date(user.vip_until) < new Date()) {
      await db.query('UPDATE users SET is_vip=0, vip_until=NULL WHERE telegram_id=?', [user.telegram_id]);
      user.is_vip = 0;
    }
    res.json(user);
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;