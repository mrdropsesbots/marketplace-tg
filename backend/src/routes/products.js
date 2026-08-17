const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, my } = req.query;
    let sql, params = [];
    
    if (my && req.headers.authorization) {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
      sql = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.user_id=?`;
      params.push(decoded.telegram_id);
    } else {
      sql = `SELECT p.*, c.name as category_name, u.first_name as user_first_name, u.telegram_id as user_telegram_id
             FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN users u ON p.user_id=u.telegram_id
             WHERE p.status='active' AND p.moderation_status='approved'`;
      if (category) { sql += ' AND p.category_id=?'; params.push(category); }
      if (minPrice) { sql += ' AND p.price>=?'; params.push(minPrice); }
      if (maxPrice) { sql += ' AND p.price<=?'; params.push(maxPrice); }
      if (search) { sql += ' AND (p.title LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`,`%${search}%`); }
    }
    sql += ' ORDER BY p.created_at DESC';
    
    const [products] = await db.query(sql, params);
    for (const p of products) {
      const [imgs] = await db.query('SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order', [p.id]);
      p.images = imgs;
    }
    res.json(products);
  } catch(e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, u.first_name as user_first_name, u.telegram_id as user_telegram_id
       FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN users u ON p.user_id=u.telegram_id WHERE p.id=?`, [req.params.id]);
    if (!products.length) return res.status(404).json({ message: 'Not found' });
    const [imgs] = await db.query('SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order', [req.params.id]);
    products[0].images = imgs;
    res.json(products[0]);
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', verifyToken, upload.array('images',10), async (req, res) => {
  try {
    const { title, description, price, currency, category_id } = req.body;
    const user_id = req.user.telegram_id;
    const [users] = await db.query('SELECT is_vip FROM users WHERE telegram_id=?', [user_id]);
    const maxImages = users[0]?.is_vip ? 10 : 5;
    if (req.files.length > maxImages) return res.status(400).json({ message: `Max ${maxImages} images` });
    
    const [result] = await db.query(
      `INSERT INTO products (user_id, category_id, title, description, price, currency, status, moderation_status) VALUES (?,?,?,?,?,?,?,?)`,
      [user_id, category_id, title, description, price, currency||'BYN', 'active', 'pending']
    );
    for (let i=0; i<req.files.length; i++) {
      await db.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?,?,?)',
        [result.insertId, `/uploads/${req.files[i].filename}`, i]);
    }
    res.json({ id: result.insertId, message: 'Created, awaiting moderation' });
  } catch(e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

router.patch('/:id/sold', verifyToken, async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!products.length) return res.status(404).json({ message: 'Not found' });
    if (products[0].user_id != req.user.telegram_id) return res.status(403).json({ message: 'Forbidden' });
    await db.query("UPDATE products SET status='sold' WHERE id=?", [req.params.id]);
    res.json({ message: 'Marked as sold' });
  } catch(e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;