module.exports = {
  name: 'unbinary',
  category: 'tools',
  description: 'Convert binary back to text.',
  execute: async ({ sock, from, args }) => {
    const input = args.join(' ').trim();

    if (!/^[01\s]+$/.test(input)) {
      return sock.sendMessage(from, {
        text: 'Usage: .unbinary 01001000 01101001'
      });
    }

    try {
      const text = input
        .split(/\s+/)
        .map(x => String.fromCharCode(parseInt(x, 2)))
        .join('');

      await sock.sendMessage(from, {
        text: `🔓 Text:\n${text}`
      });
    } catch {
      await sock.sendMessage(from, {
        text: '❌ Invalid binary.'
      });
    }
  },
};
