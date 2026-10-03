module.exports = {
  name: 'del',
  aliases: ['delete'],
  category: 'admin',
  description: 'Delete a replied-to message (bot must be admin)',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, msg, from }) => {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    if (!ctx?.stanzaId) {
      return sock.sendMessage(from, { text: 'Reply to the message you want deleted.' });
    }
    await sock.sendMessage(from, {
      delete: {
        remoteJid: from,
        fromMe: false,
        id: ctx.stanzaId,
        participant: ctx.participant,
      },
    });
  },
};
