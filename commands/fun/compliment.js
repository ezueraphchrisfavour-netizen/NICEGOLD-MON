module.exports = {
  name: 'compliment',
  category: 'fun',
  description: 'Generate a friendly compliment.',
  execute: async ({ sock, from }) => {
    const compliments = [
      'Your energy is excellent today. ✨',
      'You bring interesting ideas to the table. 💡',
      'Your persistence deserves respect. 🔥',
      'You have a creative way of looking at things. 🎨',
      'You are making progress. Keep building. 🚀'
    ];

    await sock.sendMessage(from, {
      text: `💬 ${compliments[Math.floor(Math.random() * compliments.length)]}`
    });
  },
};
