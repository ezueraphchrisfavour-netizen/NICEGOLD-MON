const { getTargetJid } = require('../../config/target');

module.exports = {
  name: 'promote',
  aliases: ['demote'],
  category: 'admin',
  description: 'Promote/demote a member to/from admin (reply to their message)',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, msg, from, args, invokedAs }) => {
    const target = getTargetJid(msg, args);
    if (!target) return sock.sendMessage(from, { text: `Reply to the user or use .${invokedAs} <number>` });

    const action = invokedAs === 'demote' ? 'demote' : 'promote';
    await sock.groupParticipantsUpdate(from, [target], action);
    await sock.sendMessage(from, {
      text: `✅ @${target.split('@')[0]} ${action === 'promote' ? 'promoted to' : 'demoted from'} admin.`,
      mentions: [target],
    });
  },
};
