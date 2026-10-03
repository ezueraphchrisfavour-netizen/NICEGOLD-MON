module.exports = {
  name: 'time',
  category: 'info',
  description: 'Show the current server time.',
  execute: async ({ sock, from }) => {
    const now = new Date();
    await sock.sendMessage(from, {
      text: `🕒 Current server time:\n${now.toString()}`
    });
  },
};
