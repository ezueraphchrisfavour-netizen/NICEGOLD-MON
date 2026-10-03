module.exports = {
  name: 'uppercase',
  category: 'tools',
  description: 'Convert text to uppercase.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, { text: 'Usage: .uppercase <text>' });
    }

    await sock.sendMessage(from, {
      text: args.join(' ').toUpperCase()
    });
  },
};
