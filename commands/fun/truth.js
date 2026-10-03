module.exports = {
  name: 'truth',
  category: 'fun',
  description: 'Get a random truth question.',
  execute: async ({ sock, from }) => {
    const questions = [
      'What is one skill you want to learn?',
      'What is your favorite food?',
      'What is something that always makes you laugh?',
      'What is your favorite movie?',
      'What is one place you would like to visit?',
      'What hobby do you enjoy most?',
      'What is one goal you have this year?'
    ];

    const q = questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(from, {
      text: `🎤 TRUTH\n\n${q}`
    });
  },
};
