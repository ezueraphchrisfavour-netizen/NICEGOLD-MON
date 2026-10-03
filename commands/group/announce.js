module.exports = {
  name: 'announce',
  category: 'group',
  description: 'Send a group announcement.',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args }) => {
    if (!args.length) {
      return sock.sendMessage(from, {
        text: 'Usage: .announce <message>'
      });
    }

    await sock.sendMessage(from, {
      text: `📢 GROUP ANNOUNCEMENT\n\n${args.join(' ')}`
    });
  },
};
