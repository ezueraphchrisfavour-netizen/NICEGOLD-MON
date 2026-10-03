module.exports = {
  name: 'admins',
  category: 'group',
  description: 'List group administrators.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants.filter(
      p => p.admin === 'admin' || p.admin === 'superadmin'
    );

    const text = admins.length
      ? admins.map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`).join('\n')
      : 'No administrators found.';

    await sock.sendMessage(from, {
      text: `🛡️ GROUP ADMINS\n\n${text}`,
      mentions: admins.map(p => p.id)
    });
  },
};
