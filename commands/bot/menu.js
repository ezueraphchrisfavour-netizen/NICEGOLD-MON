const fs = require('fs');
const path = require('path');

const BOT_NAME = '𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵';
const IMAGE_PATH = path.join(__dirname, '..', 'assets', 'nicegold.jpg');

module.exports = {
  name: 'menu',
  aliases: ['help'],
  category: 'bot',
  description: 'Show all available commands grouped by category',
  execute: async ({ sock, from, allCommands }) => {
    const seen = new Set();
    const byCategory = {};

    for (const [alias, cmd] of allCommands.entries()) {
      if (seen.has(cmd)) continue;
      seen.add(cmd);
      const cat = cmd.category || 'misc';
      byCategory[cat] = byCategory[cat] || [];
      byCategory[cat].push(cmd.name);
    }

    let text = `${BOT_NAME}\n\n`;
    for (const [cat, names] of Object.entries(byCategory)) {
      text += `${cat.toUpperCase()} (${names.length})\n`;
      text += names.map(n => `.${n}`).join(' ');
      text += `\n\n`;
    }
    text += `Total: ${seen.size} commands`;

    if (fs.existsSync(IMAGE_PATH)) {
      await sock.sendMessage(from, {
        image: { url: IMAGE_PATH },
        caption: text,
      });
    } else {
      await sock.sendMessage(from, { text });
    }
  },
};
