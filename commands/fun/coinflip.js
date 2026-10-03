module.exports = {
  name: 'coinflip',
  category: 'fun',
  description: 'Flip a virtual coin.',
  execute: async ({ sock, from }) => {
    const result = Math.random() < 0.5 ? 'HEADS 🪙' : 'TAILS 🪙';
    await sock.sendMessage(from, { text: `🪙 Coin flip\n\n${result}` });
  },
};
