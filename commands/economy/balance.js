const { load } = require('../../config/store');

module.exports = {
  name: 'balance',
  category: 'economy',
  description: 'Check your coin balance.',
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
`💰 NICEGOLD WALLET

Coins: ${user.balance}
Level: ${user.level}
XP: ${user.xp}`
    });
  },
};
