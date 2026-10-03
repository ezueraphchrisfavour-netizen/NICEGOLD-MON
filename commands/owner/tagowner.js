module.exports = {
  name: 'tagowner',
  category: 'owner',
  description: 'Tag the owner in the current chat',
  execute: async ({ sock, from }) => {
    const owners = (process.env.OWNER_NUMBERS || '').split(',').filter(Boolean);
    if (!owners.length) return sock.sendMessage(from, { text: '⚠️ No owner configured.' });

    const mentions = owners.map(n => `${n}@s.whatsapp.net`);
    await sock.sendMessage(from, {
      text: `📣 ${mentions.map(m => `@${m.split('@')[0]}`).join(' ')}`,
      mentions,
    });
  },
};
