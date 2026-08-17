const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  const user = ctx.from;
  
  // Приветствие
  await ctx.reply(
    `👋 Привет, ${user.first_name}!\n\n` +
    `Добро пожаловать в Marketplace — маркетплейс объявлений в Telegram.\n\n` +
    `Здесь вы можете:\n` +
    `• 📦 Просматривать товары\n` +
    `• ➕ Добавлять свои объявления\n` +
    `• ❤️ Сохранять в избранное\n` +
    `• 💬 Связываться с продавцами\n\n` +
    `Нажмите кнопку ниже, чтобы открыть магазин:`,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🛒 Открыть магазин', 'https://mrdropsesbots.github.io/marketplace-tg')],
      [Markup.button.callback('❓ Помощь', 'help')]
    ])
  );
};