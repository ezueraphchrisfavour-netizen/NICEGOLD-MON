module.exports = {
  name: 'setname',
  aliases: ['setdesc'],
  category: 'admin',
  description: 'Change the group name (.setname) or description (.setdesc)',
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, from, args, invokedAs }) => {
    const text = args.join(' ');
    if (!text) return sock.sendMessage(from, { text: `Usage: .${invokedAs} <new text>` });

    if (invokedAs === 'setdesc') {
      await sock.groupUpdateDescription(from, text);
    } else {
      await sock.groupUpdateSubject(from, text);
    }
    await sock.sendMessage(from, { text: `✅ Updated.` });
  },
};
