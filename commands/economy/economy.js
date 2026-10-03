const { load, save } = require('../../config/store');

function getUser(economy, jid) {
  if (!economy[jid]) {
    economy[jid] = { balance: 0, lastDaily: 0, level: 1, xp: 0 };
  }
  return economy[jid];
}

module.exports = {
  name: 'balance',
  aliases: ['daily', 'work', 'profile', 'give', 'leaderboard'],
  category: 'economy',
  description: 'Simple economy system: balance, daily, work, profile, give, leaderboard',
  execute: async ({ sock, from, sender, args, invokedAs }) => {
    const economy = load('economy', {});
    const user = getUser(economy, sender);

    if (invokedAs === 'balance') {
      await sock.sendMessage(from, { text: `💰 Balance: ${user.balance} coins` });
    }

    if (invokedAs === 'daily') {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - user.lastDaily < oneDay) {
        const remaining = oneDay - (now - user.lastDaily);
        const hours = Math.ceil(remaining / (60 * 60 * 1000));
        await sock.sendMessage(from, { text: `⏳ Already claimed. Try again in ~${hours}h.` });
      } else {
        user.balance += 200;
        user.lastDaily = now;
        save('economy', economy);
        await sock.sendMessage(from, { text: `✅ Claimed daily reward: +200 coins (total: ${user.balance})` });
      }
    }

    if (invokedAs === 'work') {
      const earned = Math.floor(Math.random() * 100) + 20;
      user.balance += earned;
      save('economy', economy);
      await sock.sendMessage(from, { text: `💼 You worked and earned ${earned} coins (total: ${user.balance})` });
    }

    if (invokedAs === 'profile') {
      await sock.sendMessage(from, {
        text: `👤 Profile\nBalance: ${user.balance}\nLevel: ${user.level}\nXP: ${user.xp}`,
      });
    }

    if (invokedAs === 'give') {
      const targetNum = (args[0] || '').replace(/\D/g, '');
      const amount = parseInt(args[1], 10);
      if (!targetNum || !amount || amount <= 0) {
        return sock.sendMessage(from, { text: 'Usage: .give <number> <amount>' });
      }
      if (user.balance < amount) {
        return sock.sendMessage(from, { text: '❌ Not enough balance.' });
      }
      const targetJid = `${targetNum}@s.whatsapp.net`;
      const target = getUser(economy, targetJid);
      user.balance -= amount;
      target.balance += amount;
      save('economy', economy);
      await sock.sendMessage(from, { text: `✅ Sent ${amount} coins to ${targetNum}` });
    }

    if (invokedAs === 'leaderboard') {
      const top = Object.entries(economy)
        .sort((a, b) => b[1].balance - a[1].balance)
        .slice(0, 10);
      const text = `🏆 Leaderboard\n\n${top.map(([jid, u], i) => `${i + 1}. ${jid.split('@')[0]} — ${u.balance}`).join('\n')}`;
      await sock.sendMessage(from, { text });
    }
  },
};
