const fs = require('fs');
const path = require('path');
const pino = require('pino');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require('@whiskeysockets/baileys');

const {
  attachSessionHandlers,
} = require('./multiSessionHandlers');

const sessions = new Map();

const BASE_DIR = path.join(
  __dirname,
  'data',
  'telegram-sessions'
);

fs.mkdirSync(BASE_DIR, {
  recursive: true,
});

function safeId(id) {
  return String(id).replace(/[^0-9_-]/g, '_');
}

function sessionPath(telegramId) {
  return path.join(
    BASE_DIR,
    safeId(telegramId)
  );
}

async function createSession(telegramId) {
  const id = String(telegramId);

  if (sessions.has(id)) {
    return sessions.get(id);
  }

  const dir = sessionPath(id);

  fs.mkdirSync(dir, {
    recursive: true,
  });

  const {
    state,
    saveCreds,
  } = await useMultiFileAuthState(dir);

  const {
    version,
  } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,

    logger: pino({
      level: 'silent',
    }),

    printQRInTerminal: false,

    browser: [
      'NICEGOLD MON',
      'Chrome',
      '1.0.0',
    ],

    markOnlineOnConnect: false,
  });

  const session = {
    telegramId: id,
    sock,

    phone: null,

    connected: false,
    connecting: true,

    createdAt: Date.now(),

    pairingRequested: false,
    pairingCode: null,
  };

  sessions.set(id, session);

  sock.ev.on(
    'creds.update',
    saveCreds
  );

  sock.ev.on(
    'connection.update',
    ({ connection, lastDisconnect }) => {
      if (connection === 'connecting') {
        session.connecting = true;

        console.log(
          `[multi-session] ${id} connecting...`
        );
      }

      if (connection === 'open') {
        session.connected = true;
        session.connecting = false;
        session.pairingRequested = false;
        session.pairingCode = null;

        if (sock.user?.id) {
          session.phone =
            sock.user.id.split(':')[0];
        }

        console.log(
          `[multi-session] Telegram ${id} connected as ${session.phone || 'unknown'}`
        );
      }

      if (connection === 'close') {
        session.connected = false;
        session.connecting = false;

        const statusCode =
          lastDisconnect?.error?.output?.statusCode;

        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut;

        console.log(
          `[multi-session] ${id} closed. reconnect=${shouldReconnect} status=${statusCode || 'unknown'}`
        );

        sessions.delete(id);

        if (shouldReconnect) {
          setTimeout(() => {
            createSession(id).catch(err => {
              console.error(
                `[multi-session] reconnect failed for ${id}:`,
                err.message
              );
            });
          }, 3000);
        }
      }
    }
  );

  attachSessionHandlers(
    sock,
    session
  );

  return session;
}

async function requestPairingCode(
  telegramId,
  phone
) {
  const id = String(telegramId);

  let session = sessions.get(id);

  if (!session) {
    session = await createSession(id);
  }

  if (session.connected) {
    throw new Error(
      'This WhatsApp session is already connected.'
    );
  }

  if (
    !phone ||
    !/^\d{8,15}$/.test(phone)
  ) {
    throw new Error(
      'Invalid phone number. Use international format without + or spaces. Example: 2348012345678'
    );
  }

  session.phone = phone;

  /*
   * WhatsApp/Baileys needs the socket connection
   * to be initialized before requesting the code.
   *
   * Give the socket a short moment to establish
   * its connection.
   */
  await new Promise(resolve => {
    setTimeout(resolve, 3500);
  });

  if (session.connected) {
    throw new Error(
      'This WhatsApp session became connected before the pairing code was requested.'
    );
  }

  try {
    session.pairingRequested = true;

    const code =
      await session.sock.requestPairingCode(
        phone
      );

    session.pairingCode = String(code);

    console.log(
      `[multi-session] Pairing code generated for Telegram ${id}`
    );

    return session.pairingCode;
  } catch (err) {
    session.pairingRequested = false;

    console.error(
      `[multi-session] Pairing code failed for ${id}:`,
      err
    );

    throw err;
  }
}

function getSession(telegramId) {
  return (
    sessions.get(
      String(telegramId)
    ) || null
  );
}

async function logoutSession(telegramId) {
  const id = String(telegramId);

  const session = sessions.get(id);

  if (!session) {
    return false;
  }

  try {
    if (session.sock?.logout) {
      await session.sock.logout();
    }
  } catch (err) {
    console.warn(
      `[multi-session] logout warning for ${id}:`,
      err.message
    );
  }

  sessions.delete(id);

  /*
   * Remove saved WhatsApp authentication.
   * This makes /logout a real logout instead
   * of leaving old credentials on disk.
   */
  const dir = sessionPath(id);

  try {
    fs.rmSync(dir, {
      recursive: true,
      force: true,
    });
  } catch (err) {
    console.warn(
      `[multi-session] failed to remove session files for ${id}:`,
      err.message
    );
  }

  return true;
}

function removeSession(telegramId) {
  sessions.delete(
    String(telegramId)
  );
}

function getAllSessions() {
  return sessions;
}

module.exports = {
  createSession,
  requestPairingCode,
  getSession,
  logoutSession,
  removeSession,
  getAllSessions,
};
