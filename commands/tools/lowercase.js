module.exports = {
  name: 'lowercase',
  category: 'tools',
  description: 'Convert text to lowercase.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, { text: 'Usage: .lowercase <text>' });
    }

    await sock.sendMessage(from, {
      text: args.join(' ').toLowerCase()
    });
  },
};
