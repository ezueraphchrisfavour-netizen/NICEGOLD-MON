module.exports = {
  name: 'rate',
  category: 'fun',
  description: 'Give a random fun rating.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, {
        text: 'Usage: .rate <something>'
      });
    }

    const rating = Math.floor(Math.random() * 101);

    await sock.sendMessage(from, {
      text: `⭐ ${args.join(' ')}\n\nNICEGOLD rating: ${rating}/100`
    });
  },
};
