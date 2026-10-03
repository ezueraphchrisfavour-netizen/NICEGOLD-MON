function getTargetJid(msg, args) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  if (ctx?.participant) return ctx.participant;
  if (ctx?.mentionedJid?.[0]) return ctx.mentionedJid[0];
  if (args[0]) return `${args[0].replace(/\D/g, '')}@s.whatsapp.net`;
  return null;
}

module.exports = { getTargetJid };
