require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const {
  createSession,
  requestPairingCode,
  getSession,
  getAllSessions,
  logoutSession,
} = require('./telegramSessions');

const TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || '';

if (!TOKEN) {
  console.log(
    '[telegram] TELEGRAM_BOT_TOKEN is not configured.'
  );

  module.exports = null;
  return;
}

const bot = new TelegramBot(
  TOKEN,
  {
    polling: true,
  }
);

const BOT_NAME =
  '𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵';

function menuText() {
  return `${BOT_NAME}

🤖 Multi-user WhatsApp bot

Available commands:

/start
/help
/pair <WhatsApp number>
/status
/mystatus
/logout

Example:

/pair 2348012345678

Each Telegram account gets its own WhatsApp session.`;
}

bot.onText(
  /^\/start$/,
  async msg => {
    await bot.sendMessage(
      msg.chat.id,
      menuText()
    );
  }
);

bot.onText(
  /^\/help$/,
  async msg => {
    await bot.sendMessage(
      msg.chat.id,

      `📚 NICEGOLD MON HELP

/pair <number>
Generate your WhatsApp pairing code.

/status
Check the NICEGOLD MON server.

/mystatus
Check your own WhatsApp session.

/logout
Disconnect your WhatsApp session.

Example:

/pair 2348012345678

⚠️ Never share your WhatsApp pairing code with anyone.`
    );
  }
);

bot.onText(
  /^\/pair(?:\s+(.+))?$/,
  async (msg, match) => {
    const telegramId =
      String(msg.from.id);

    const raw =
      (match?.[1] || '').trim();

    /*
     * Remove spaces, +, -, brackets,
     * and other formatting characters.
     */
    const phone =
      raw.replace(/\D/g, '');

    if (
      !phone ||
      !/^\d{8,15}$/.test(phone)
    ) {
      return bot.sendMessage(
        msg.chat.id,

        `❌ Invalid WhatsApp number.

Use international format without +, spaces or brackets.

Example:

/pair 2348012345678`
      );
    }

    try {
      let session =
        getSession(telegramId);

      if (
        session?.connected
      ) {
        return bot.sendMessage(
          msg.chat.id,

          `✅ Your WhatsApp is already connected.

Number:
${session.phone || phone}`
        );
      }

      await bot.sendMessage(
        msg.chat.id,

        `⏳ Preparing your private WhatsApp session...

Number:
${phone}

Please wait...`
      );

      session =
        await createSession(
          telegramId
        );

      const code =
        await requestPairingCode(
          telegramId,
          phone
        );

      /*
       * Baileys/WhatsApp normally returns
       * an 8-character pairing code.
       */
      const formatted =
        String(code)
          .replace(/[^A-Za-z0-9]/g, '')
          .match(/.{1,4}/g)
          ?.join('-') ||
        String(code);

      await bot.sendMessage(
        msg.chat.id,

        `🔐 NICEGOLD MON
WHATSAPP PAIRING CODE

${formatted}

📱 On your WhatsApp:

1. Open WhatsApp
2. Go to Linked Devices
3. Tap Link a Device
4. Choose "Link with phone number instead"
5. Enter the code above

⏱️ Enter the code while it is still valid.

⚠️ Keep this code private.

After WhatsApp accepts it, NICEGOLD MON will connect automatically.`
      );

    } catch (err) {
      console.error(
        '[telegram pair]',
        err
      );

      await bot.sendMessage(
        msg.chat.id,

        `❌ Pairing failed.

Reason:
${err.message || 'Unknown error'}

Try /pair again with your full international WhatsApp number.

Example:
/pair 2348012345678`
      );
    }
  }
);

bot.onText(
  /^\/status$/,
  async msg => {
    const sessions =
      getAllSessions();

    let connected = 0;

    for (
      const session
      of sessions.values()
    ) {
      if (session.connected) {
        connected++;
      }
    }

    await bot.sendMessage(
      msg.chat.id,

      `📊 NICEGOLD MON SERVER

Active sessions:
${sessions.size}

Connected WhatsApp sessions:
${connected}

Telegram bridge:
ONLINE 🟢`
    );
  }
);

bot.onText(
  /^\/mystatus$/,
  async msg => {
    const telegramId =
      String(msg.from.id);

    const session =
      getSession(telegramId);

    if (!session) {
      return bot.sendMessage(
        msg.chat.id,

        `📱 You don't have a WhatsApp session yet.

Use:

/pair 2348012345678`
      );
    }

    let status =
      'CONNECTING 🟡';

    if (session.connected) {
      status =
        'CONNECTED 🟢';
    }

    await bot.sendMessage(
      msg.chat.id,

      `📱 YOUR NICEGOLD MON SESSION

Status:
${status}

Number:
${session.phone || 'Waiting for pairing'}

Pairing code:
${session.pairingCode || 'None'}

Session:
ACTIVE`
    );
  }
);

bot.onText(
  /^\/logout$/,
  async msg => {
    const telegramId =
      String(msg.from.id);

    const session =
      getSession(telegramId);

    if (!session) {
      return bot.sendMessage(
        msg.chat.id,

        'You do not currently have an active WhatsApp session.'
      );
    }

    try {
      await logoutSession(
        telegramId
      );

      await bot.sendMessage(
        msg.chat.id,

        `🔌 NICEGOLD MON

Your WhatsApp session has been disconnected.

You can pair again with:

/pair 2348012345678`
      );

    } catch (err) {
      console.error(
        '[telegram logout]',
        err
      );

      await bot.sendMessage(
        msg.chat.id,

        `❌ Logout failed.

${err.message}`
      );
    }
  }
);

bot.on(
  'polling_error',
  err => {
    console.error(
      '[telegram polling]',
      err.message
    );
  }
);

console.log(
  '[telegram] multi-user bridge is online'
);

module.exports = bot;
