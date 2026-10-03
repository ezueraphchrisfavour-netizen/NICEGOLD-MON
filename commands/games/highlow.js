module.exports = {
  name: 'highlow',
  category: 'games',
  description: 'Guess whether the next number is higher or lower.',
  execute: async ({ sock, from, args }) => {
    const choice = (args[0] || '').toLowerCase();

    if (!['high', 'low'].includes(choice)) {
      return sock.sendMessage(from, {
        text: 'Usage: .highlow high\nor\n.highlow low'
      });
    }

    const first = Math.floor(Math.random() * 100) + 1;
    const second = Math.floor(Math.random() * 100) + 1;

    const correct =
      second === first
        ? 'Draw 🤝'
        : choice === 'high' && second > first
          ? 'Correct 🎉'
          : choice === 'low' && second < first
            ? 'Correct 🎉'
            : 'Wrong this round 🎲';

    await sock.sendMessage(from, {
      text: `🎲 HIGH / LOW

First: ${first}
Next: ${second}

Your choice: ${choice}
${correct}`
    });
  },
};
