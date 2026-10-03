const { load, save } = require('../../config/store');

module.exports = {
  name: 'daily',
  category: 'economy',
  description: 'Claim daily coins.',
  execute: async ({ sock, from, sender }) => {
    const economy = load('economy', {});
    const user = economy[sender] || {
      balance: 0,
      lastDaily: 0,
      level: 1,
      xp: 0
    };

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (now - user.lastDaily < cooldown) {
      const remaining = cooldown - (now - user.lastDaily);
      const hours = Math.ceil(remaining / 3600000);

      return sock.sendMessage(from, {
        text: `⏳ You already claimed your daily reward.\nTry again in about ${hours} hour(s).`
      });
    }

    user.balance += 250;
    user.xp += 25;
    user.lastDaily = now;

    economy[sender] = user;
    save('economy', economy);

    await sock.sendMessage(from, {
      text: `🎁 DAILY REWARD

+250 coins
+25 XP

Balance: ${user.balance}`
    });
  },
};
