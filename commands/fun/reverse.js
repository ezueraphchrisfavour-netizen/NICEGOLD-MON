module.exports = {
  name: 'reverse',
  category: 'fun',
  description: 'Reverse text.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, {
        text: 'Usage: .reverse <text>'
      });
    }

    const text = args.join(' ');
    await sock.sendMessage(from, {
      text: text.split('').reverse().join('')
    });
  },
};
