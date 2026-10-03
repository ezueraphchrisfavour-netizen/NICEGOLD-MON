module.exports = {
  name: 'quote',
  category: 'fun',
  description: 'Send a random quote.',
  execute: async ({ sock, from }) => {
    const quotes = [
      'Small steps still move you forward.',
      'Knowledge becomes powerful when you use it.',
      'Consistency can turn an idea into a system.',
      'A clear mind makes better decisions.',
      'Build patiently. Improve continuously.',
      'Every expert once started with a first attempt.'
    ];

    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    await sock.sendMessage(from, {
      text: `💭 ${quote}`
    });
  },
};
