const PREFIX = process.env.BOT_PREFIX || '.';

/**
 * Parses a raw message body into { command, args } or null if it's not a command.
 */
function parseMessage(body) {
  if (!body || typeof body !== 'string') return null;
  if (!body.startsWith(PREFIX)) return null;

  const withoutPrefix = body.slice(PREFIX.length).trim();
  if (!withoutPrefix) return null;

  const parts = withoutPrefix.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}

module.exports = { parseMessage, PREFIX };
