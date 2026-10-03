const { getTargetJid } = require('../../config/target');

module.exports = {
  name: 'kick',
  category: 'admin',
  description: 'Remove a member from the group (reply to their message, or .kick <number>)',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, msg, from, args }) => {
    const target = getTargetJid(msg, args);
    if (!target) {
      return sock.sendMessage(from, { text: 'Reply to the user\'s message or use .kick <number>' });
    }
    await sock.groupParticipantsUpdate(from, [target], 'remove');
    await sock.sendMessage(from, { text: `✅ Removed @${target.split('@')[0]}`, mentions: [target] });
  },
};
