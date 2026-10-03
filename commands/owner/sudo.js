const { load, save } = require('../../config/store');

module.exports = {
  name: 'addsudo',
  aliases: ['delsudo'],
  category: 'owner',
  description: 'Add or remove a sudo (trusted) user number',
  ownerOnly: true,
  execute: async ({ sock, from, args, invokedAs }) => {
    const number = (args[0] || '').replace(/\D/g, '');
    if (!number) return sock.sendMessage(from, { text: 'Usage: .addsudo <number> or .delsudo <number>' });

    const sudoList = load('sudo', { numbers: [] });

    if (invokedAs === 'delsudo') {
      sudoList.numbers = sudoList.numbers.filter(n => n !== number);
      save('sudo', sudoList);
      return sock.sendMessage(from, { text: `✅ ${number} removed from sudo list.` });
    }

    if (!sudoList.numbers.includes(number)) sudoList.numbers.push(number);
    save('sudo', sudoList);
    return sock.sendMessage(from, { text: `✅ ${number} added to sudo list.` });
  },
};
