module.exports = {
  name: 'tagadmins',
  category: 'group',
  description: 'Mention all group administrators.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants.filter(
      p => p.admin === 'admin' || p.admin === 'superadmin'
    );

    if (!admins.length) {
      return sock.sendMessage(from, {
        text: 'No admins found.'
      });
    }

    await sock.sendMessage(from, {
      text:
        `🛡️ ADMINS\n\n` +
        admins.map(p => `@${p.id.split('@')[0]}`).join('\n'),
      mentions: admins.map(p => p.id)
    });
  },
};
