require('dotenv').config();
const { Telegraf } = require('telegraf');
const startCommand = require('./commands/start');
const messageHandler = require('./handlers/messages');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команды
bot.start(startCommand);

// Обработка сообщений (связь продавец-покупатель)
bot.on('message', messageHandler);

// Запуск
bot.launch()
  .then(() => console.log('Bot started'))
  .catch(err => console.error('Bot error:', err));

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));