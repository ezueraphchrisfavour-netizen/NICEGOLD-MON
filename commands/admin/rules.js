module.exports = {
  name: 'rules',
  category: 'admin',
  description: 'Show group rules.',
  groupOnly: true,
  execute: async ({ sock, from }) => {
    await sock.sendMessage(from, {
      text:
`📜 GROUP RULES

1. Respect other members.
2. No unnecessary spam.
3. No unwanted links.
4. Follow the group administrator's instructions.
5. Keep conversations appropriate.
6. Have fun without disturbing others.

𓉳 NICEGOLD MON 𓉳`
    });
  },
};
