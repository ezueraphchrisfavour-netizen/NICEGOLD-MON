module.exports = {
  name: 'calc',
  category: 'tools',
  description: 'Calculate a basic expression.',
  execute: async ({ sock, from, args }) => {
    const expression = args.join(' ').replace(/[^0-9+\-*/().% ]/g, '');
    if (!expression) {
      return sock.sendMessage(from, { text: '🧮 Usage: .calc 25 * 4 + 10' });
    }

    try {
      const result = Function(`"use strict"; return (${expression})`)();
      if (!Number.isFinite(result)) throw new Error('Invalid result');

      await sock.sendMessage(from, {
        text: `🧮 ${expression} = ${result}`
      });
    } catch {
      await sock.sendMessage(from, {
        text: '❌ I could not calculate that expression.'
      });
    }
  },
};
