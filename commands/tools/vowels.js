module.exports = {
  name: 'vowels',
  category: 'tools',
  description: 'Count vowels in text.',
  execute: async ({ sock, from, args }) => {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(from, { text: 'Usage: .vowels <text>' });
    }

    const matches = text.match(/[aeiou]/gi) || [];

    await sock.sendMessage(from, {
      text: `🔤 Vowels found: ${matches.length}`
    });
  },
};
