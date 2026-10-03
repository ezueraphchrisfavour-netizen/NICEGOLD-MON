module.exports = {
  name: 'meme',
  category: 'fun',
  description: 'Generate a simple text meme.',
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, {
        text: 'Usage: .meme <text>'
      });
    }

    await sock.sendMessage(from, {
      text: `😂 MEME

WHEN SOMEONE SAYS:
"${args.join(' ')}"

NICEGOLD MON: 👁️👄👁️`
    });
  },
};
