const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

/**
 * Loads every command from commands/ and maps:
 *
 *   command name -> command
 *   alias        -> command
 *
 * The first registration wins.
 * Duplicate aliases are skipped instead of silently overwriting
 * an already working command.
 */
function loadCommands() {
  const commands = new Map();
  const allFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.js')
      ) {
        allFiles.push(fullPath);
      }
    }
  }

  walk(COMMANDS_DIR);

  function registerModule(mod, file) {
    if (
      !mod ||
      !mod.name ||
      typeof mod.execute !== 'function'
    ) {
      console.warn(
        `[commandLoader] Skipping ${file} — missing name/execute`
      );
      return;
    }

    const names = [
      mod.name,
      ...(Array.isArray(mod.aliases) ? mod.aliases : [])
    ];

    for (const alias of names) {
      const key = String(alias).toLowerCase().trim();

      if (!key) continue;

      if (commands.has(key)) {
        const existing = commands.get(key);

        console.warn(
          `[commandLoader] Duplicate "${key}" skipped: ` +
          `${file} -> ${mod.name}; ` +
          `keeping existing command -> ${existing.name}`
        );

        continue;
      }

      commands.set(key, mod);
    }
  }

  for (const file of allFiles) {
    try {
      delete require.cache[require.resolve(file)];

      const mod = require(file);

      if (mod && Array.isArray(mod.multi)) {
        for (const sub of mod.multi) {
          registerModule(sub, file);
        }
      } else {
        registerModule(mod, file);
      }
    } catch (err) {
      console.error(
        `[commandLoader] Failed to load ${file}:`,
        err.message
      );
    }
  }

  console.log(
    `[commandLoader] Loaded ${allFiles.length} command files, ` +
    `${commands.size} unique aliases`
  );

  return commands;
}

module.exports = {
  loadCommands,
  COMMANDS_DIR,
};
