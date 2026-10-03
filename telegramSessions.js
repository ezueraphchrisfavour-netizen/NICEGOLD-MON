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
  'telegram-sessions'
);

fs.mkdirSync(BASE_DIR, {
  recursive: true,
});

function safeId(id) {
  return String(id).replace(
    /[^0-9_-]/g,
    '_'
  );
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
  });

  const session = {
    telegramId: id,
    sock,
    phone: null,
    connected: false,
    createdAt: Date.now(),
  };

  sessions.set(id, session);

  sock.ev.on(
    'creds.update',
    saveCreds
  );

  sock.ev.on(
    'connection.update',
    ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        session.connected = true;

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

        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;

        console.log(
          `[multi-session] ${id} closed. reconnect=${shouldReconnect}`
        );

        sessions.delete(id);

        if (shouldReconnect) {
          setTimeout(() => {
            createSession(id).catch(
              err => {
                console.error(
                  `[multi-session] reconnect failed for ${id}:`,
                  err.message
                );
              }
            );
          }, 2500);
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

function getSession(telegramId) {
  return (
    sessions.get(
      String(telegramId)
    ) || null
  );
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
  getSession,
  removeSession,
  getAllSessions,
};
