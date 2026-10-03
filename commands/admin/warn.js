const { load, save } = require('../../config/store');
const { getTargetJid } = require('../../config/target');

module.exports = {
  name: 'warn',
  aliases: ['warnings'],
  category: 'admin',
  description: 'Warn a member, or check warnings with .warnings',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, msg, from, args, invokedAs }) => {
    const target = getTargetJid(msg, args);
    if (!target) return sock.sendMessage(from, { text: 'Reply to the user or use .warn <number>' });

    const warnings = load('warnings', {});
    warnings[from] = warnings[from] || {};

    if (invokedAs === 'warnings') {
      const count = warnings[from][target] || 0;
      return sock.sendMessage(from, {
        text: `@${target.split('@')[0]} has ${count} warning(s).`,
        mentions: [target],
      });
    }

    warnings[from][target] = (warnings[from][target] || 0) + 1;
    save('warnings', warnings);
    await sock.sendMessage(from, {
      text: `⚠️ @${target.split('@')[0]} warned (${warnings[from][target]} total).`,
      mentions: [target],
    });
  },
};
