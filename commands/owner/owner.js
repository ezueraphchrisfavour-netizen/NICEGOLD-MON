module.exports = {
  name: 'owner',
  aliases: ['ownerinfo'],
  category: 'owner',
  description: 'Show owner contact info',
  execute: async ({ sock, from }) => {
    const owners = (process.env.OWNER_NUMBERS || '').split(',').filter(Boolean);
    const text = owners.length
      ? `👑 Owner:\n${owners.map(n => `+${n}`).join('\n')}`
      : '⚠️ No owner number configured (set OWNER_NUMBERS in .env)';
    await sock.sendMessage(from, { text });
  },
};
