module.exports = {
  name: 'date',
  category: 'info',
  description: 'Show the current date.',
  execute: async ({ sock, from }) => {
    const now = new Date();
    await sock.sendMessage(from, {
      text: `📅 Date: ${now.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`
    });
  },
};
