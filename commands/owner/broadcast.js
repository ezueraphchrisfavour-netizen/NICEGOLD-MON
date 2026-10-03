const { load } = require('../../config/store');

module.exports = {
  name: 'broadcast',
  aliases: ['bc'],
  category: 'owner',
  description: 'Send a message to every group the bot is in',
  ownerOnly: true,
  execute: async ({ sock, from, args }) => {
    const text = args.join(' ');
    if (!text) return sock.sendMessage(from, { text: 'Usage: .broadcast <message>' });

    const groups = await sock.groupFetchAllParticipating();
    const ids = Object.keys(groups);

    let sent = 0;
    for (const id of ids) {
      try {
        await sock.sendMessage(id, { text: `📢 Broadcast:\n\n${text}` });
        sent++;
      } catch (e) {
        console.warn('[broadcast] failed for', id, e.message);
      }
    }
    await sock.sendMessage(from, { text: `✅ Broadcast sent to ${sent}/${ids.length} groups.` });
  },
};
