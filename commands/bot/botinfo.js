module.exports = {
  name: 'botinfo',
  category: 'bot',
  description: 'Show bot information.',
  execute: async ({ sock, from }) => {
    await sock.sendMessage(from, {
      text:
`𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵

Version: 1.0.0
Engine: Node.js
WhatsApp: Baileys
Mode: Modular
AI: Coming later
Status: Online`
    });
  },
};
