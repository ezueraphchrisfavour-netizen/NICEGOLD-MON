module.exports = {
  name: 'lock',
  aliases: ['unlock'],
  category: 'admin',
  description: 'Lock (admins-only messaging) or unlock the group',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, invokedAs }) => {
    await sock.groupSettingUpdate(from, invokedAs === 'lock' ? 'announcement' : 'not_announcement');
    await sock.sendMessage(from, { text: invokedAs === 'lock' ? '🔒 Group locked.' : '🔓 Group unlocked.' });
  },
};
