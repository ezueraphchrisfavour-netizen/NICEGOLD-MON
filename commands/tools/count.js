module.exports = {
  name: 'count',
  category: 'tools',
  description: 'Count words and characters.',
  execute: async ({ sock, from, args }) => {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(from, {
        text: 'Usage: .count <text>'
      });
    }

    const words = text.trim().split(/\s+/).length;
    const characters = text.length;

    await sock.sendMessage(from, {
      text: `📊 TEXT COUNT

Words: ${words}
Characters: ${characters}`
    });
  },
};
