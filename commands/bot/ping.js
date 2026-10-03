const START_TIME = Date.now();

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

module.exports = {
  name: 'ping',
  aliases: ['alive', 'uptime', 'botinfo', 'status'],
  category: 'bot',
  description: 'Bot status commands',
  execute: async ({ sock, from, invokedAs }) => {
    const start = Date.now();
    if (invokedAs === 'ping') {
      const sent = await sock.sendMessage(from, { text: 'Pinging...' });
      const ms = Date.now() - start;
      return sock.sendMessage(from, { text: `🏓 Pong! ${ms}ms` });
    }

    const text =
      `✅ Bot is alive.\n` +
      `Uptime: ${formatUptime(Date.now() - START_TIME)}\n` +
      `Node: ${process.version}`;

    await sock.sendMessage(from, { text });
  },
};
