module.exports = {
  name: 'members',
  category: 'group',
  description: 'Show the number of group members.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    const metadata = await sock.groupMetadata(from);

    await sock.sendMessage(from, {
      text: `👥 Group members: ${metadata.participants.length}`
    });
  },
};
