const { load, save } = require('../../config/store');

module.exports = {
  name: 'antispam',
  aliases: ['antiflood'],
  category: 'protection',
  description: 'Toggle flood protection: .antispam on [max-msgs] [window-seconds]',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args }) => {
    const settings = load('antispam', {});
    const [state, max, windowSec] = args;

    if (state !== 'on' && state !== 'off') {
      return sock.sendMessage(from, { text: 'Usage: .antispam on [max-messages] [window-seconds]\n.antispam off' });
    }

    settings[from] = {
      enabled: state === 'on',
      max: parseInt(max, 10) || 6,
      windowMs: (parseInt(windowSec, 10) || 10) * 1000,
    };
    save('antispam', settings);

    await sock.sendMessage(from, {
      text: state === 'on'
        ? `🚫 Antispam ON — max ${settings[from].max} msgs / ${settings[from].windowMs / 1000}s`
        : '🚫 Antispam OFF',
    });
  },
};
