module.exports = {
  name: 'emoji',
  category: 'fun',
  description: 'Send a random emoji.',
  execute: async ({ sock, from }) => {
    const emojis = [
      '😂', '🔥', '🚀', '🎯', '🤖', '👑',
      '💎', '⚡', '🎮', '🌟', '🦁', '🍀',
      '🎲', '🧠', '✨', '🥳'
    ];

    await sock.sendMessage(from, {
      text: emojis[Math.floor(Math.random() * emojis.length)]
    });
  },
};
