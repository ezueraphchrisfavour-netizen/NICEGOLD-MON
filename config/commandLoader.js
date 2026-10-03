const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

/**
 * Walks the commands/ directory (including subfolders like commands/fun, commands/admin)
 * and returns a Map where every alias points at the same handler object.
 *
 * Each command file must export:
 * {
 *   name: 'ping',
 *   aliases: ['p', 'alive-check'],   // optional
 *   category: 'bot',                 // optional, used by .menu
 *   description: '...',
 *   ownerOnly: false,                // optional
 *   groupOnly: false,                // optional
 *   adminOnly: false,                // optional
 *   execute: async ({ sock, msg, from, sender, args, isGroup, isAdmin, isOwner }) => { ... }
 * }
 */
function loadCommands() {
  const commands = new Map();
  const allFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        allFiles.push(fullPath);
      }
    }
  }

  walk(COMMANDS_DIR);

  function registerModule(mod, file) {
    if (!mod || !mod.name || typeof mod.execute !== 'function') {
      console.warn(`[commandLoader] Skipping a module in ${file} — missing name/execute`);
      return;
    }
    const names = [mod.name, ...(mod.aliases || [])];
    for (const alias of names) {
      const key = alias.toLowerCase();
      if (commands.has(key)) {
        console.warn(`[commandLoader] Duplicate alias "${key}" (in ${file}) — overwriting`);
      }
      commands.set(key, mod);
    }
  }

  for (const file of allFiles) {
    delete require.cache[require.resolve(file)];
    const mod = require(file);

    // a file can export { multi: [...] } to register several commands from one file
    // (used by commands/prexzy/dynamic.js, which builds many commands from a config list)
    if (mod && Array.isArray(mod.multi)) {
      for (const sub of mod.multi) registerModule(sub, file);
      continue;
    }

    registerModule(mod, file);
  }

  console.log(`[commandLoader] Loaded ${allFiles.length} command files, ${commands.size} total aliases`);
  return commands;
}

module.exports = { loadCommands, COMMANDS_DIR };
