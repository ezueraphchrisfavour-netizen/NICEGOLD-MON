module.exports = {
  name: 'math',
  category: 'games',
  description: 'Get a quick math challenge.',
  execute: async ({ sock, from }) => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operations = [
      [`${a} + ${b}`, a + b],
      [`${a} - ${b}`, a - b],
      [`${a} × ${b}`, a * b]
    ];

    const challenge =
      operations[Math.floor(Math.random() * operations.length)];

    await sock.sendMessage(from, {
      text: `🧠 MATH CHALLENGE

Solve:
${challenge[0]}

Answer: ${challenge[1]}`
    });
  },
};
