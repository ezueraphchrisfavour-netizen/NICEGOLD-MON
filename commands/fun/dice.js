module.exports = {
  name: 'dice',
  category: 'fun',
  description: 'Roll a six-sided dice.',
  execute: async ({ sock, from }) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    await sock.sendMessage(from, {
      text: `🎲 You rolled: ${roll}`
    });
  },
};
