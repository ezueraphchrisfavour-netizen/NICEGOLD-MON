module.exports = {
  name: 'rps',
  category: 'games',
  description: 'Play rock paper scissors.',
  execute: async ({ sock, from, args }) => {
    const choices = ['rock', 'paper', 'scissors'];
    const user = (args[0] || '').toLowerCase();

    if (!choices.includes(user)) {
      return sock.sendMessage(from, {
        text: '🎮 Usage: .rps rock\n\nChoices: rock, paper, scissors'
      });
    }

    const bot = choices[Math.floor(Math.random() * choices.length)];

    let result = 'Draw 🤝';

    if (
      (user === 'rock' && bot === 'scissors') ||
      (user === 'paper' && bot === 'rock') ||
      (user === 'scissors' && bot === 'paper')
    ) {
      result = 'You win this round 🎉';
    } else if (user !== bot) {
      result = 'I win this round 🤖';
    }

    await sock.sendMessage(from, {
      text: `🎮 Rock Paper Scissors

You: ${user}
NICEGOLD: ${bot}

${result}`
    });
  },
};
