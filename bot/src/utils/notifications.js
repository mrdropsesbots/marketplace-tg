const axios = require('axios');

// Отправка уведомления пользователю
async function notifyUser(bot, telegramId, text, options = {}) {
  try {
    await bot.telegram.sendMessage(telegramId, text, {
      parse_mode: 'HTML',
      ...options
    });
  } catch (err) {
    console.error(`Failed to notify user ${telegramId}:`, err.message);
  }
}

// Уведомление: товар одобрен
async function notifyProductApproved(bot, telegramId, productTitle) {
  await notifyUser(bot, telegramId,
    `✅ <b>Ваше объявление одобрено!</b>\n\n` +
    `«${productTitle}» теперь доступно в магазине.`,
    { reply_markup: { inline_keyboard: [[{ text: '🛒 Открыть магазин', web_app: { url: 'https://mrdropsesbots.github.io/marketplace-tg' } }]] } }
  );
}

// Уведомление: товар отклонён
async function notifyProductRejected(bot, telegramId, productTitle, reason) {
  await notifyUser(bot, telegramId,
    `❌ <b>Ваше объявление отклонено</b>\n\n` +
    `«${productTitle}»\n\n` +
    `<b>Причина:</b> ${reason || 'Не указана'}\n\n` +
    `Вы можете исправить объявление и создать новое.`,
    { reply_markup: { inline_keyboard: [[{ text: '🛒 Открыть магазин', web_app: { url: 'https://mrdropsesbots.github.io/marketplace-tg' } }]] } }
  );
}

// Уведомление: новое сообщение
async function notifyNewMessage(bot, telegramId, fromName, text) {
  await notifyUser(bot, telegramId,
    `💬 <b>Новое сообщение от ${fromName}</b>\n\n` +
    `${text}`,
    { reply_markup: { inline_keyboard: [[{ text: 'Ответить', callback_data: 'reply' }]] } }
  );
}

module.exports = {
  notifyUser,
  notifyProductApproved,
  notifyProductRejected,
  notifyNewMessage
};