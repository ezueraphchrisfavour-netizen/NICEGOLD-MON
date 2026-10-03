module.exports = {
  name: 'guess',
  category: 'games',
  description: 'Guess a number from 1 to 10.',
  execute: async ({ sock, from, args }) => {
    const guess = Number(args[0]);

    if (!Number.isInteger(guess) || guess < 1 || guess > 10) {
      return sock.sendMessage(from, {
        text: '🎯 Usage: .guess <1-10>'
      });
    }

    const answer = Math.floor(Math.random() * 10) + 1;

    await sock.sendMessage(from, {
      text:
        guess === answer
          ? `🎯 Correct! The number was ${answer}.`
          : `🎯 Not this time.\n\nYour guess: ${guess}\nNumber: ${answer}`
    });
  },
};
