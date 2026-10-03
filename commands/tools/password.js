module.exports = {
  name: 'password',
  category: 'tools',
  description: 'Generate a random password.',
  execute: async ({ sock, from, args }) => {
    let length = Number(args[0]) || 12;
    length = Math.max(6, Math.min(length, 32));

    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';

    let password = '';

    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    await sock.sendMessage(from, {
      text: `🔐 Generated password:\n${password}\n\nKeep it private.`
    });
  },
};
