require('dotenv').config();

const { parse, add } = require('date-fns');
const { format } = require('date-fns-tz');

const telegramBot = require('node-telegram-bot-api');

const token = '7672629965:AAHj82jlIZq5NWIeQgM_lzDc5WePtQ9RX6w';

const bot = new telegramBot(token, { polling: true });

const A = process.env.SENDER_CHAT_ID;
const J = process.env.RECEIVER_CHAT_ID;

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/deleteAll') {
    bot.getUpdates().then((updates) => {
      updates.forEach((update) => {
        console.log(update.message);
      });
    });
  }

  if (messageText === '/start') {
    // TODO: change this to ultimateReceiver
    bot.sendMessage(
      chatId,
      'Please enter the time of feed in this format: "h:mma<space>ml". Example: 2:30pm 100'
    );
  } else {
    const words = messageText.split(' ');
    const timeEntered = words[0];
    const mlEntered = words[1];
    const timeConverted = parse(timeEntered, 'h:mma', new Date());
    const timePlus3 = add(timeConverted, { hours: 3 });
    const timePlus4 = add(timeConverted, { hours: 4 });
    const finalTimeAfter3Hours = format(timePlus3, 'h:mma', {
      timeZone: 'Asia/Singapore',
    });
    const finalTimeAfter4Hours = format(timePlus4, 'h:mma', {
      timeZone: 'Asia/Singapore',
    });

    bot.sendMessage(
      A,
      `Asher's feeding time is ${timeEntered} with ${mlEntered}ml. \n\nThe next feeding time in: \n3hrs will be <b>${finalTimeAfter3Hours}</b> \n4hrs will be <b>${finalTimeAfter4Hours}</b>`,
      { parse_mode: 'HTML' }
    );
    bot.sendMessage(
      J,
      `Asher feeding time is ${timeEntered} with ${mlEntered}ml. \nThe next feeding time in \n3hrs will be <b>${finalTimeAfter3Hours}</b> \n4hrs will be <b>${finalTimeAfter4Hours}</b>`,
      { parse_mode: 'HTML' }
    );
  }
});

bot.on('polling_error', (error) => {
  console.log(error);
});
