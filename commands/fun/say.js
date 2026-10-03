module.exports = {
  name: 'say',
  category: 'fun',
  description: 'Make NICEGOLD MON repeat text.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, {
        text: 'Usage: .say <text>'
      });
    }

    await sock.sendMessage(from, {
      text: args.join(' ')
    });
  },
};
