const { load } = require('../../config/store');

module.exports = {
  name: 'profile',
  category: 'economy',
  description: 'Show your NICEGOLD profile.',
  execute: async ({ sock, from, sender }) => {
    const economy = load('economy', {});
    const user = economy[sender] || {
      balance: 0,
      lastDaily: 0,
      level: 1,
      xp: 0
    };

    await sock.sendMessage(from, {
      text:
`👤 NICEGOLD PROFILE

User: @${sender.split('@')[0]}
Level: ${user.level}
XP: ${user.xp}
Coins: ${user.balance}`,
      mentions: [sender]
    });
  },
};
