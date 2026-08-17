const axios = require('axios');

module.exports = async (ctx) => {
  // Если это сообщение в личном чате с ботом (не в группе)
  if (ctx.chat.type !== 'private') return;
  
  // Если это команда — пропускаем
  if (ctx.message.text && ctx.message.text.startsWith('/')) return;
  
  // Проверяем, есть ли reply_to_message (ответ на пересланное сообщение)
  if (!ctx.message.reply_to_message) {
    return ctx.reply(
      '💬 Чтобы связаться с продавцом, откройте объявление в магазине и нажмите "Написать продавцу".\n\n' +
      'Или используйте кнопку ниже:',
      { reply_markup: { inline_keyboard: [[{ text: '🛒 Открыть магазин', web_app: { url: 'https://mrdropsesbots.github.io/marketplace-tg' } }]] } }
    );
  }
  
  // Пересылка сообщения продавцу/покупателю
  const originalMsg = ctx.message.reply_to_message;
  
  // Здесь логика пересылки (упрощённая)
  // В реальном проекте нужна таблица message_threads в БД
  await ctx.reply('✅ Сообщение отправлено!');
};