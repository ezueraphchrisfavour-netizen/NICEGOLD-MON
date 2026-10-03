const JOKES = [
  "I told my computer I needed a break, and it said no problem — it would go to sleep too.",
  "Why don't scientists trust atoms? Because they make up everything.",
  "I would tell you a UDP joke, but you might not get it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "I'm reading a book on anti-gravity. It's impossible to put down.",
];

module.exports = {
  name: 'joke',
  category: 'fun',
  description: 'Send a random joke',
  execute: async ({ sock, from }) => {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    await sock.sendMessage(from, { text: `😂 ${joke}` });
  },
};
