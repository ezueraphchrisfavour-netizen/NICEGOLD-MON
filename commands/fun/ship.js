module.exports = {
  name: 'ship',
  category: 'fun',
  description: 'Give a random friendship compatibility score.',
  execute: async ({ sock, from, args }) => {
    if (args.length < 2) {
      return sock.sendMessage(from, {
        text: 'Usage: .ship name1 name2'
      });
    }

    const score = Math.floor(Math.random() * 101);

    await sock.sendMessage(from, {
      text: `🚢 NICEGOLD SHIP

${args[0]} + ${args[1]}
Compatibility: ${score}%`
    });
  },
};
