function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = {
  name: 'dice',
  aliases: ['coin', 'rps', 'math'],
  category: 'games',
  description: 'Quick games: .dice, .coin, .rps <rock|paper|scissors>, .math',
  execute: async ({ sock, from, args, invokedAs }) => {
    let text;

    if (invokedAs === 'dice') {
      text = `🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}`;
    }

    if (invokedAs === 'coin') {
      text = `🪙 ${pick(['Heads', 'Tails'])}`;
    }

    if (invokedAs === 'rps') {
      const choices = ['rock', 'paper', 'scissors'];
      const user = (args[0] || '').toLowerCase();
      if (!choices.includes(user)) {
        return sock.sendMessage(from, { text: 'Usage: .rps rock|paper|scissors' });
      }
      const bot = pick(choices);
      let result;
      if (user === bot) result = "It's a tie!";
      else if (
        (user === 'rock' && bot === 'scissors') ||
        (user === 'paper' && bot === 'rock') ||
        (user === 'scissors' && bot === 'paper')
      ) result = 'You win!';
      else result = 'I win!';
      text = `You: ${user} | Me: ${bot}\n${result}`;
    }

    if (invokedAs === 'math') {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const op = pick(['+', '-', '*']);
      const answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
      text = `🧮 ${a} ${op} ${b} = ?\n(answer: ${answer} — a real deployment would wait for a reply and check it)`;
    }

    await sock.sendMessage(from, { text });
  },
};
