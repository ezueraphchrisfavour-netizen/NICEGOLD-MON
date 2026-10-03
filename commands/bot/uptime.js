module.exports = {
  name: 'uptime',
  category: 'bot',
  description: 'Show bot uptime.',
  execute: async ({ sock, from }) => {
    const seconds = Math.floor(process.uptime());
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    await sock.sendMessage(from, {
      text: `⏱️ NICEGOLD MON uptime\n\n${d}d ${h}h ${m}m ${s}s`
    });
  },
};
