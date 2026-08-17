const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { code } = req.body;
    const user_id = req.user.telegram_id;
    
    const [promos] = await db.query(
      'SELECT * FROM promo_codes WHERE code=? AND valid_until>NOW() AND used_count<max_uses', [code]);
    if (!promos.length) return res.status(400).json({ message: 'Invalid or expired code' });
    const promo = promos[0];
    
    const [used] = await db.query('SELECT * FROM vip_purchases WHERE user_id=? AND promo_code_id=?', [user_id, promo.id]);
    if (used.length) return res.status(400).json({ message: 'Already used' });
    
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    
    await db.query('INSERT INTO vip_purchases (user_id, promo_code_id, amount, duration_days, expires_at) VALUES (?,?,?,?,?)',
      [user_id, promo.id, 0, 30, expires]);
    await db.query('UPDATE users SET is_vip=1, vip_until=? WHERE telegram_id=?', [expires, user_id]);
    await db.query('UPDATE promo_codes SET used_count=used_count+1 WHERE id=?', [promo.id]);
    
    res.json({ message: 'VIP activated', expires_at: expires });
  } catch(e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;