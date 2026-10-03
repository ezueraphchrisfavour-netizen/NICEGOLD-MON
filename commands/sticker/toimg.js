const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'toimg',
  category: 'sticker',
  description: 'Convert a replied sticker back into an image',
  execute: async ({ sock, msg, from }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.stickerMessage) {
      return sock.sendMessage(from, { text: 'Reply to a sticker with .toimg' });
    }
    const buffer = await downloadMediaMessage({ message: quoted, key: msg.key }, 'buffer', {});
    await sock.sendMessage(from, { image: buffer });
  },
};
