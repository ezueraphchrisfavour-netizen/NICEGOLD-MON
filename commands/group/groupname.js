module.exports = {
  name: 'groupname',
  category: 'group',
  description: 'Show the group name.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    const metadata = await sock.groupMetadata(from);

    await sock.sendMessage(from, {
      text: `🏷️ Group name:\n${metadata.subject}`
    });
  },
};
