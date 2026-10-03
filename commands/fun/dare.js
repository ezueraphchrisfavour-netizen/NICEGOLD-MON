module.exports = {
  name: 'dare',
  category: 'fun',
  description: 'Get a harmless group dare.',
  execute: async ({ sock, from }) => {
    const dares = [
      'Send the group your favorite emoji.',
      'Type your next message using only capital letters.',
      'Describe your day using three words.',
      'Send a funny but appropriate status idea.',
      'Say one nice thing about the group.',
      'Use only emojis for your next message.'
    ];

    const dare = dares[Math.floor(Math.random() * dares.length)];

    await sock.sendMessage(from, {
      text: `🎯 DARE\n\n${dare}`
    });
  },
};
