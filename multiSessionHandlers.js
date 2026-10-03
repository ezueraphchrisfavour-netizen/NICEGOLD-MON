const fs = require('fs');
const path = require('path');

const { loadCommands } = require('./config/commandLoader');
const { parseMessage } = require('./config/parser');
const { load, save } = require('./config/store');
const { getGame, endGame } = require('./config/pianoGames');

const BOT_NAME = '𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵';

function getSenderNumber(sender) {
  return String(sender || '').split('@')[0];
}

async function setProfilePicture(sock) {
  const imagePath = path.join(__dirname, 'assets', 'nicegold.jpg');

  if (
    !fs.existsSync(imagePath) ||
    !sock?.user?.id ||
    !sock.updateProfilePicture
  ) {
    return;
  }

  try {
    await sock.updateProfilePicture(sock.user.id, {
      url: imagePath,
    });

    console.log('[profile] NICEGOLD image applied');
  } catch (err) {
    console.warn('[profile] profile picture failed:', err.message);
  }
}

async function checkAntiLink({ sock, msg, from, sender, body, session }) {
  const settings = load('antilink', {});
  const groupSettings = settings[from];

  if (!groupSettings?.enabled) return;

  const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com)/i;

  if (!linkRegex.test(body)) return;

  const ownerNumber = String(session.phone || '');
  const senderNumber = getSenderNumber(sender);

  if (ownerNumber && senderNumber === ownerNumber) return;

  try {
    await sock.sendMessage(from, {
      delete: msg.key,
    });
  } catch (err) {
    console.warn('[antilink] delete failed:', err.message);
  }

  const warnings = load('warnings', {});

  warnings[from] = warnings[from] || {};
  warnings[from][sender] = (warnings[from][sender] || 0) + 1;

  save('warnings', warnings);

  const count = warnings[from][sender];
  const limit = groupSettings.limit || 3;

  await sock.sendMessage(from, {
    text:
      `🔗 Link detected and removed.\n` +
      `@${senderNumber} — warning ${count}/${limit}`,
    mentions: [sender],
  });

  if (count >= limit && groupSettings.action === 'kick') {
    try {
      await sock.groupParticipantsUpdate(
        from,
        [sender],
        'remove'
      );

      warnings[from][sender] = 0;
      save('warnings', warnings);
    } catch (err) {
      console.warn('[antilink] kick failed:', err.message);
    }
  }
}

const spamWindows = new Map();

async function checkAntiSpam({ sock, from, sender }) {
  const settings = load('antispam', {});
  const cfg = settings[from];

  if (!cfg?.enabled) return;

  const key = `${from}:${sender}`;
  const now = Date.now();

  const timestamps = (
    spamWindows.get(key) || []
  ).filter(t => now - t < cfg.windowMs);

  timestamps.push(now);
  spamWindows.set(key, timestamps);

  if (timestamps.length > cfg.max) {
    spamWindows.set(key, []);

    await sock.sendMessage(from, {
      text:
        `🚫 @${getSenderNumber(sender)} is sending ` +
        `messages too fast — slow down.`,
      mentions: [sender],
    });
  }
}

async function checkPianoGuess({
  sock,
  from,
  sender,
  guess,
}) {
  const game = getGame(from);

  if (!game) return false;

  if (guess !== game.winningTile) return false;

  endGame(from);

  const economy = load('economy', {});

  economy[sender] = economy[sender] || {
    balance: 0,
    lastDaily: 0,
    level: 1,
    xp: 0,
  };

  economy[sender].balance += 100;

  save('economy', economy);

  await sock.sendMessage(from, {
    text:
      `🎹 @${getSenderNumber(sender)} ` +
      `hit the right key and won 100 coins!`,
    mentions: [sender],
  });

  return true;
}

function attachSessionHandlers(sock, session) {
  let commands = loadCommands();

  sock.ev.on(
    'connection.update',
    async ({ connection }) => {
      if (connection === 'open') {
        await setProfilePicture(sock);
        console.log(
          `[multi-session] command engine ready for ${session.phone || session.telegramId}`
        );
      }
    }
  );

  sock.ev.on(
    'messages.upsert',
    async ({ messages }) => {
      for (const msg of messages || []) {
        try {
          if (!msg?.message || msg.key?.fromMe) {
            continue;
          }

          const from = msg.key.remoteJid;

          if (!from) continue;

          const sender =
            msg.key.participant ||
            msg.key.remoteJid;

          const isGroup = from.endsWith('@g.us');

          const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            msg.message.videoMessage?.caption ||
            '';

          if (isGroup) {
            await checkAntiLink({
              sock,
              msg,
              from,
              sender,
              body,
              session,
            });

            await checkAntiSpam({
              sock,
              from,
              sender,
            });
          }

          if (/^\d+$/.test(body.trim())) {
            const handled = await checkPianoGuess({
              sock,
              from,
              sender,
              guess: parseInt(body.trim(), 10),
            });

            if (handled) continue;
          }

          const parsed = parseMessage(body);

          console.log(
            `[command-debug] body=${JSON.stringify(body)} parsed=${JSON.stringify(parsed)}`
          );

          if (!parsed) continue;

          const command = commands.get(parsed.command);

          console.log(
            `[command-debug] command=${parsed.command} found=${!!command} handler=${command?.name || 'NONE'}`
          );

          if (!command) continue;

          let isAdmin = false;

          const senderNumber = getSenderNumber(sender);
          const ownerNumber = String(session.phone || '');

          const isOwner =
            !!ownerNumber &&
            senderNumber === ownerNumber;

          if (
            isGroup &&
            (command.adminOnly || command.groupOnly)
          ) {
            try {
              const meta =
                await sock.groupMetadata(from);

              const participant =
                meta.participants.find(
                  p => p.id === sender
                );

              isAdmin =
                participant?.admin === 'admin' ||
                participant?.admin === 'superadmin';
            } catch (err) {
              console.warn(
                '[groupMetadata] failed:',
                err.message
              );
            }
          }

          if (command.groupOnly && !isGroup) {
            await sock.sendMessage(from, {
              text:
                '⚠️ This command only works in groups.',
            });

            continue;
          }

          if (command.ownerOnly && !isOwner) {
            await sock.sendMessage(from, {
              text: '⛔ Owner-only command.',
            });

            continue;
          }

          if (
            command.adminOnly &&
            !isAdmin &&
            !isOwner
          ) {
            await sock.sendMessage(from, {
              text: '⛔ Admins only.',
            });

            continue;
          }

          await command.execute({
            sock,
            msg,
            from,
            sender,
            args: parsed.args,
            isGroup,
            isAdmin,
            isOwner,
            allCommands: commands,
            invokedAs: parsed.command,
            session,
            botName: BOT_NAME,
          });

        } catch (err) {
          console.error(
            '[multi-session command error]',
            err
          );

          try {
            await sock.sendMessage(
              msg.key.remoteJid,
              {
                text:
                  `❌ Error running command.\n` +
                  `${err.message}`,
              }
            );
          } catch {}
        }
      }
    }
  );

  sock.ev.on(
    'group-participants.update',
    async event => {
      try {
        const {
          id: groupId,
          participants,
          action,
        } = event;

        const greetings = load(
          'greetings',
          {}
        );

        const config =
          greetings[groupId]?.[
            action === 'add'
              ? 'welcome'
              : 'goodbye'
          ];

        if (!config?.enabled) return;

        for (const participant of participants) {
          const name =
            `@${getSenderNumber(participant)}`;

          const text = (
            config.message ||
            (
              action === 'add'
                ? 'Welcome {user}!'
                : 'Goodbye {user}.'
            )
          ).replace(
            '{user}',
            name
          );

          await sock.sendMessage(
            groupId,
            {
              text,
              mentions: [participant],
            }
          );
        }
      } catch (err) {
        console.warn(
          '[greetings] error:',
          err.message
        );
      }
    }
  );

  sock.ev.on(
    'reload-commands',
    () => {
      commands = loadCommands();
      console.log(
        `[multi-session] commands reloaded for ${session.telegramId}`
      );
    }
  );
}

module.exports = {
  attachSessionHandlers,
};
