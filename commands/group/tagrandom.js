module.exports = {
  name: 'tagrandom',
  category: 'group',
  description: 'Randomly tag one group member.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    if (!participants.length) {
      return sock.sendMessage(from, { text: 'No members found.' });
    }

    const chosen =
      participants[Math.floor(Math.random() * participants.length)];

    await sock.sendMessage(from, {
      text: `🎯 Random member:\n@${chosen.id.split('@')[0]}`,
      mentions: [chosen.id]
    });
  },
};
