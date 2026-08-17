require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
  origin: ['https://mrdropsesbots.github.io', 'http://localhost:5173'],
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','X-Telegram-Init-Data'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/vip', require('./routes/vip'));
app.use('/api/promo', require('./routes/promo'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));