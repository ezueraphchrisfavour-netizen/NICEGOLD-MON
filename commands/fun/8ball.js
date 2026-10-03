module.exports = {
  name: '8ball',
  category: 'fun',
  description: 'Ask the virtual 8-ball a question.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, {
        text: '🎱 Usage: .8ball <question>'
      });
    }

    const answers = [
      'Yes.',
      'No.',
      'Maybe.',
      'Probably.',
      'Definitely.',
      'Not right now.',
      'Ask again later.',
      'The answer is unclear.',
      'There is a chance.'
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)];

    await sock.sendMessage(from, {
      text: `🎱 ${answer}`
    });
  },
};
