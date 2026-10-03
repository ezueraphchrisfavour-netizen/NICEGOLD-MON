module.exports = {
  name: 'id',
  category: 'info',
  description: 'Show the current chat ID.',
  execute: async ({ sock, from }) => {
    await sock.sendMessage(from, {
      text: `🆔 Chat ID:\n${from}`
    });
  },
};
