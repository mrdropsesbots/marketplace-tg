const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { telegramAuth, generateToken } = require('../middleware/auth');

router.post('/login', telegramAuth, async (req, res) => {
  const tg = req.telegramUser;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE telegram_id = ?', [tg.id]);
    let user;
    if (rows.length === 0) {
      await db.query(
        'INSERT INTO users (telegram_id, username, first_name, last_name, is_admin, is_vip) VALUES (?,?,?,?,?,?)',
        [tg.id, tg.username||null, tg.first_name||null, tg.last_name||null, false, false]
      );
      user = { telegram_id: tg.id, username: tg.username, first_name: tg.first_name, last_name: tg.last_name, is_admin: 0, is_vip: 0 };
    } else {
      user = rows[0];
      await db.query('UPDATE users SET username=?, first_name=?, last_name=? WHERE telegram_id=?',
        [tg.username||null, tg.first_name||null, tg.last_name||null, tg.id]);
    }
    res.json({ token: generateToken(user), user });
  } catch(e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;