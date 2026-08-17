const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const BOT_TOKEN = process.env.BOT_TOKEN;

function validateTelegramInitData(initData) {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([k,v]) => `${k}=${v}`)
      .join('\n');
    const secretKey = crypto.createHmac('sha256','WebAppData').update(BOT_TOKEN).digest();
    const checkHash = crypto.createHmac('sha256',secretKey).update(dataCheckString).digest('hex');
    return hash === checkHash;
  } catch(e) { return false; }
}

function extractUser(initData) {
  const userJson = new URLSearchParams(initData).get('user');
  return userJson ? JSON.parse(userJson) : null;
}

async function telegramAuth(req, res, next) {
  const initData = req.headers['x-telegram-init-data'];
  if (!initData) return res.status(401).json({ message: 'No init data' });
  if (!validateTelegramInitData(initData)) return res.status(401).json({ message: 'Invalid init data' });
  const user = extractUser(initData);
  if (!user) return res.status(401).json({ message: 'No user data' });
  req.telegramUser = user;
  next();
}

function generateToken(user) {
  return jwt.sign(
    { telegram_id: user.telegram_id, is_admin: user.is_admin, is_vip: user.is_vip },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch(e) { return res.status(401).json({ message: 'Invalid token' }); }
}

module.exports = { telegramAuth, verifyToken, generateToken, extractUser };