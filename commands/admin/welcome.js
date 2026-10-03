const { load, save } = require('../../config/store');

module.exports = {
  name: 'welcome',
  aliases: ['goodbye'],
  category: 'admin',
  description: 'Configure welcome/goodbye messages: .welcome on|off|<custom message>',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args, invokedAs }) => {
    const settings = load('greetings', {});
    settings[from] = settings[from] || {};
    const key = invokedAs; // 'welcome' or 'goodbye'

    const arg = args.join(' ');
    if (arg === 'on' || arg === 'off') {
      settings[from][key] = settings[from][key] || {};
      settings[from][key].enabled = arg === 'on';
    } else if (arg) {
      settings[from][key] = settings[from][key] || {};
      settings[from][key].message = arg;
      settings[from][key].enabled = true;
    } else {
      return sock.sendMessage(from, { text: `Usage: .${key} on | .${key} off | .${key} <custom message with {user}>` });
    }

    save('greetings', settings);
    await sock.sendMessage(from, { text: `✅ ${key} settings updated.` });
  },
};
