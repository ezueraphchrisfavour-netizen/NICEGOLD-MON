module.exports = {
  name: 'binary',
  category: 'tools',
  description: 'Convert text to binary.',
  execute: async ({ sock, from, args }) => {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(from, {
        text: 'Usage: .binary hello'
      });
    }

    const binary = [...text]
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');

    await sock.sendMessage(from, {
      text: `💻 Binary:\n${binary}`
    });
  },
};
