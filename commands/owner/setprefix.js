const { load, save } = require('../../config/store');

module.exports = {
  name: 'setprefix',
  category: 'owner',
  description: 'Change the bot prefix for this chat',
  ownerOnly: true,
  execute: async ({ sock, from, args }) => {
    const newPrefix = args[0];
    if (!newPrefix || newPrefix.length > 3) {
      return sock.sendMessage(from, { text: 'Usage: .setprefix <symbol>  (max 3 chars)' });
    }
    const settings = load('settings', {});
    settings[from] = settings[from] || {};
    settings[from].prefix = newPrefix;
    save('settings', settings);
    await sock.sendMessage(from, { text: `✅ Prefix for this chat set to: ${newPrefix}` });
  },
};
