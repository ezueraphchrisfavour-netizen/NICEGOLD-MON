module.exports = {
  name: 'tagall',
  aliases: ['hidetag'],
  category: 'admin',
  description: 'Tag everyone in the group. .tagall lists numbers, .hidetag sends your text silently tagging all',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args, invokedAs }) => {
    const meta = await sock.groupMetadata(from);
    const participants = meta.participants.map(p => p.id);

    if (invokedAs === 'hidetag') {
      const text = args.join(' ') || '\u200b';
      return sock.sendMessage(from, { text, mentions: participants });
    }

    const text = `📢 Tagging everyone:\n\n${participants.map(p => `@${p.split('@')[0]}`).join('\n')}`;
    await sock.sendMessage(from, { text, mentions: participants });
  },
};
