const { callPrexzy } = require('../../config/prexzyApi');
const definitions = require('../../config/prexzyCommands');

function formatJson(data) {
  // keep replies readable instead of dumping raw JSON when possible
  if (typeof data === 'string') return data;
  if (data?.result && typeof data.result === 'string') return data.result;
  if (data?.message && typeof data.message === 'string') return data.message;
  return '```' + JSON.stringify(data, null, 2).slice(0, 3500) + '```';
}

async function runDefinition(def, { sock, from, args }) {
  if (def.usage && def.paramName && args.length === 0) {
    return sock.sendMessage(from, { text: `Usage: ${def.usage}` });
  }

  // special-cased commands that need more than one param
  if (def.custom === 'compiler') {
    const [language, ...codeParts] = args;
    if (!language || !codeParts.length) {
      return sock.sendMessage(from, { text: `Usage: ${def.usage}` });
    }
    const result = await callPrexzy(def.path, { language, code: codeParts.join(' ') }, 'POST');
    return sock.sendMessage(from, { text: formatJson(result.data) });
  }

  const params = def.paramName ? { [def.paramName]: args.join(' ') } : {};

  let result;
  try {
    result = await callPrexzy(def.path, params, 'GET');
  } catch (err) {
    return sock.sendMessage(from, { text: `❌ API request failed: ${err.message}` });
  }

  if (result.type === 'buffer') {
    if (result.contentType.startsWith('image/')) {
      return sock.sendMessage(from, { image: result.data });
    }
    if (result.contentType.startsWith('audio/')) {
      return sock.sendMessage(from, { audio: result.data, mimetype: result.contentType });
    }
    return sock.sendMessage(from, { document: result.data, mimetype: result.contentType });
  }

  // API returned JSON but hints it's actually an image URL to fetch and send
  if (def.resultHint === 'image' && result.data?.url) {
    return sock.sendMessage(from, { image: { url: result.data.url } });
  }
  if (def.resultHint === 'audio' && result.data?.url) {
    return sock.sendMessage(from, { audio: { url: result.data.url }, mimetype: 'audio/mpeg' });
  }

  await sock.sendMessage(from, { text: formatJson(result.data) });
}

// build one exported module per definition, aliases and all, exactly like a normal command file
const commandModules = definitions.map((def) => ({
  name: def.name,
  aliases: def.aliases || [],
  category: def.category,
  description: def.description,
  execute: (ctx) => runDefinition(def, ctx),
}));

// commandLoader.js expects one { name, execute } module per file. Since this file defines
// several, we export them as a special array — commandLoader checks for `module.exports.multi`
// and registers each one. See the small patch needed in config/commandLoader.js (README.md).
module.exports = { multi: commandModules };
