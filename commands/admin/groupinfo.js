module.exports = {
  name: 'groupinfo',
  aliases: ['admins'],
  category: 'admin',
  description: 'Show group info, or just the admin list with .admins',
  groupOnly: true,
  execute: async ({ sock, from, invokedAs }) => {
    const meta = await sock.groupMetadata(from);
    const admins = meta.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

    if (invokedAs === 'admins') {
      const text = `👮 Admins:\n${admins.map(a => `@${a.id.split('@')[0]}`).join('\n')}`;
      return sock.sendMessage(from, { text, mentions: admins.map(a => a.id) });
    }

    const text =
      `📋 ${meta.subject}\n\n` +
      `Members: ${meta.participants.length}\n` +
      `Admins: ${admins.length}\n` +
      `Created: ${new Date(meta.creation * 1000).toLocaleDateString()}\n` +
      (meta.desc ? `\nDescription:\n${meta.desc}` : '');

    await sock.sendMessage(from, { text });
  },
};
