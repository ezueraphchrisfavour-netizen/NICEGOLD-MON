module.exports = {
  name: 'groupid',
  category: 'group',
  description: 'Show the group ID.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    await sock.sendMessage(from, {
      text: `🆔 Group ID:\n${from}`
    });
  },
};
