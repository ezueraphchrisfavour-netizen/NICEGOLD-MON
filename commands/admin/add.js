module.exports = {
  name: 'add',
  category: 'admin',
  description: 'Add a member to the group by number: .add 2348012345678',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args }) => {
    const number = (args[0] || '').replace(/\D/g, '');
    if (!number) return sock.sendMessage(from, { text: 'Usage: .add <number>' });
    const jid = `${number}@s.whatsapp.net`;
    const res = await sock.groupParticipantsUpdate(from, [jid], 'add');
    await sock.sendMessage(from, { text: `✅ Add attempted for ${number}.\n${JSON.stringify(res)}` });
  },
};
