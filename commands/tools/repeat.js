module.exports = {
  name: 'repeat',
  category: 'tools',
  description: 'Repeat text a specified number of times.',
  execute: async ({ sock, from, args }) => {
    const amount = Number(args[0]);
    const text = args.slice(1).join(' ');

    if (!Number.isInteger(amount) || amount < 1 || amount > 10 || !text) {
      return sock.sendMessage(from, {
        text: 'Usage: .repeat 3 hello'
      });
    }

    await sock.sendMessage(from, {
      text: Array(amount).fill(text).join('\n')
    });
  },
};
