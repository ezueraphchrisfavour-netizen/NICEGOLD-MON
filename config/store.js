const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function load(name, fallback = {}) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return fallback;
  }
}

function save(name, data) {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

module.exports = { load, save };
