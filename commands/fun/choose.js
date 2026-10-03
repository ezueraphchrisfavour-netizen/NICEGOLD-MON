module.exports = {
  name: 'choose',
  category: 'fun',
  description: 'Choose randomly from options separated by |.',
  execute: async ({ sock, from, args }) => {
    const input = args.join(' ');
    const options = input.split('|').map(x => x.trim()).filter(Boolean);

    if (options.length < 2) {
      return sock.sendMessage(from, {
        text: 'Usage: .choose pizza | rice | noodles'
      });
    }

    const choice = options[Math.floor(Math.random() * options.length)];

    await sock.sendMessage(from, {
      text: `🎯 My choice:\n\n${choice}`
    });
  },
};
