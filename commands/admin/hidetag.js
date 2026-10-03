module.exports = {
  name: 'hidetag',
  category: 'admin',
  description: 'Mention everyone without displaying their numbers.',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args }) => {
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants.map(p => p.id);
    const text = args.length ? args.join(' ') : '𓉳 NICEGOLD MON 𓉳';

    await sock.sendMessage(from, {
      text,
      mentions: participants
    });
  },
};
