require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const {
  createSession,
  getSession,
  getAllSessions,
} = require('./telegramSessions');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

if (!TOKEN) {
  console.log('[telegram] TELEGRAM_BOT_TOKEN is not configured.');
  module.exports = null;
  return;
}

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

const BOT_NAME = '𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵';

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

bot.onText(/^\/start$/, async msg => {
  await bot.sendMessage(msg.chat.id, menuText());
});

bot.onText(/^\/help$/, async msg => {
  await bot.sendMessage(
    msg.chat.id,
    `📚 NICEGOLD MON HELP

/pair <number>
Connect your WhatsApp.

/status
Check your WhatsApp connection.

/mystatus
Show your own session.

/logout
Disconnect your WhatsApp session.

Example:
/pair 2348012345678`
  );
});

bot.onText(/^\/pair(?:\s+(.+))?$/, async (msg, match) => {
  const telegramId = String(msg.from.id);
  const raw = (match?.[1] || '').trim();
  const phone = raw.replace(/\D/g, '');

  if (!phone || phone.length < 8) {
    return bot.sendMessage(
      msg.chat.id,
      'Usage: /pair 2348012345678'
    );
  }

  try {
    let session = getSession(telegramId);

    if (!session) {
      await bot.sendMessage(
        msg.chat.id,
        '⏳ Creating your private WhatsApp session...'
      );

      session = await createSession(telegramId);
    }

    if (session.connected) {
      return bot.sendMessage(
        msg.chat.id,
        `✅ Your WhatsApp session is already connected.\n\nNumber: ${session.phone || 'Connected'}`
      );
    }

    session.phone = phone;

    await bot.sendMessage(
      msg.chat.id,
      '⏳ Requesting your WhatsApp pairing code...'
    );

    const code = await session.sock.requestPairingCode(phone);

    const formatted =
      String(code).match(/.{1,4}/g)?.join('-') || String(code);

    await bot.sendMessage(
      msg.chat.id,
      `🔐 NICEGOLD MON PAIRING CODE

${formatted}

On WhatsApp:

Linked Devices
→ Link a Device
→ Link with phone number instead
→ Enter the code above

⚠️ Keep the pairing code private.`
    );

  } catch (err) {
    console.error('[telegram pair]', err);

    await bot.sendMessage(
      msg.chat.id,
      `❌ Pairing failed.

${err.message}`
    );
  }
});

bot.onText(/^\/status$/, async msg => {
  const sessions = getAllSessions();

  const total = sessions.size;

  let connected = 0;

  for (const session of sessions.values()) {
    if (session.connected) connected++;
  }

  await bot.sendMessage(
    msg.chat.id,
    `📊 NICEGOLD MON SERVER

Active sessions: ${total}
Connected WhatsApp sessions: ${connected}
Telegram bridge: ONLINE`
  );
});

bot.onText(/^\/mystatus$/, async msg => {
  const telegramId = String(msg.from.id);
  const session = getSession(telegramId);

  if (!session) {
    return bot.sendMessage(
      msg.chat.id,
      `📱 Your session does not exist yet.

Use:
/pair 2348012345678`
    );
  }

  await bot.sendMessage(
    msg.chat.id,
    `📱 YOUR NICEGOLD MON SESSION

Status: ${session.connected ? 'CONNECTED 🟢' : 'CONNECTING 🟡'}
Number: ${session.phone || 'Not connected yet'}
Session: ACTIVE`
  );
});

bot.onText(/^\/logout$/, async msg => {
  const telegramId = String(msg.from.id);
  const session = getSession(telegramId);

  if (!session) {
    return bot.sendMessage(
      msg.chat.id,
      'You do not currently have an active session.'
    );
  }

  try {
    if (session.sock?.logout) {
      await session.sock.logout();
    }
  } catch (err) {
    console.warn('[telegram logout]', err.message);
  }

  await bot.sendMessage(
    msg.chat.id,
    '🔌 Your NICEGOLD MON WhatsApp session has been disconnected.'
  );
});

bot.on('polling_error', err => {
  console.error('[telegram polling]', err.message);
});

console.log('[telegram] multi-user bridge is online');

module.exports = bot;
