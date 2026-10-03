module.exports = {
  name: 'number',
  category: 'fun',
  description: 'Pick a random number between two values.',
  execute: async ({ sock, from, args }) => {
    const min = Number(args[0]);
    const max = Number(args[1]);

    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
      return sock.sendMessage(from, {
        text: 'Usage: .number 1 100'
      });
    }

    const result =
      Math.floor(Math.random() * (max - min + 1)) + min;

    await sock.sendMessage(from, {
      text: `🎲 Number picked: ${result}`
    });
  },
};
