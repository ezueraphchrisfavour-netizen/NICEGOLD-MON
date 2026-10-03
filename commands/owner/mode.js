const { load, save } = require('../../config/store');

module.exports = {
  name: 'mode',
  aliases: ['public', 'private'],
  category: 'owner',
  description: 'Set bot to public (anyone can use commands) or private (owner/sudo only)',
  ownerOnly: true,
  execute: async ({ sock, from, args, invokedAs }) => {
    const settings = load('settings', {});
    let resolved;
    if (invokedAs === 'public' || invokedAs === 'private') {
      resolved = invokedAs;
    } else {
      resolved = args[0] === 'private' ? 'private' : 'public';
    }
    settings.mode = resolved;
    save('settings', settings);
    await sock.sendMessage(from, { text: `✅ Bot mode set to: ${resolved}` });
  },
};
