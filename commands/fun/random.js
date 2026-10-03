module.exports = {
  name: 'random',
  category: 'fun',
  description: 'Generate a random number.',
  execute: async ({ sock, from, args }) => {
    const max = Math.max(1, Math.min(Number(args[0]) || 1000000, 1000000));
    const number = Math.floor(Math.random() * max) + 1;

    await sock.sendMessage(from, {
      text: `🎲 Random number: ${number}`
    });
  },
};
