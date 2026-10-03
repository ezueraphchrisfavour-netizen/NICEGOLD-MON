const { load, save } = require('../../config/store');

module.exports = {
  name: 'antilink',
  category: 'protection',
  description: 'Toggle link detection: .antilink on|off [warn|kick] [limit]',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args }) => {
    const settings = load('antilink', {});
    const [state, action = 'warn', limit] = args;

    if (state !== 'on' && state !== 'off') {
      return sock.sendMessage(from, { text: 'Usage: .antilink on [warn|kick] [warning-limit]\n.antilink off' });
    }

    settings[from] = {
      enabled: state === 'on',
      action: action === 'kick' ? 'kick' : 'warn',
      limit: parseInt(limit, 10) || 3,
    };
    save('antilink', settings);

    await sock.sendMessage(from, {
      text: state === 'on'
        ? `🔗 Antilink ON — action: ${settings[from].action}, limit: ${settings[from].limit}`
        : '🔗 Antilink OFF',
    });
  },
};
