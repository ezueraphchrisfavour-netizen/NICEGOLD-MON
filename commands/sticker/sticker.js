const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'sticker',
  aliases: ['s'],
  category: 'sticker',
  description: 'Convert a replied image/short video into a sticker',
  execute: async ({ sock, msg, from }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target = quoted?.imageMessage || quoted?.videoMessage
      ? { message: quoted, key: msg.key }
      : msg.message?.imageMessage
        ? msg
        : null;

    if (!target) {
      return sock.sendMessage(from, { text: 'Reply to (or send) an image/short video with .sticker' });
    }

    const buffer = await downloadMediaMessage(target, 'buffer', {});
    await sock.sendMessage(from, { sticker: buffer });
  },
};
