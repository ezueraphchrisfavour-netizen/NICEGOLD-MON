const { getTargetJid } = require('../../config/target');

const BASE_URL = 'https://api.waifu.pics/sfw';

// category -> verb used in the caption
const ACTIONS = {
  slap: 'slapped',
  kill: 'obliterated',
  kick: 'kicked',
  punch: 'punched', // waifu.pics has no dedicated punch, falls back to slap gif
  hug: 'hugged',
  pat: 'patted',
  cuddle: 'cuddled',
  kiss: 'kissed',
  bite: 'bit',
  poke: 'poked', // falls back to bonk gif
  bonk: 'bonked',
  yeet: 'yeeted',
  cry: 'is crying because of',
  wink: 'winked at',
  highfive: 'high-fived',
  handhold: 'is holding hands with',
  wave: 'waved at',
  happy: 'is happy with',
  blush: 'is blushing at',
  smile: 'smiled at',
};

// map commands without a direct waifu.pics category onto the closest one that exists
const CATEGORY_OVERRIDE = {
  punch: 'slap',
  poke: 'bonk',
};

async function fetchGif(category) {
  const res = await fetch(`${BASE_URL}/${category}`);
  const data = await res.json();
  return data.url;
}

async function runAction(actionName, { sock, msg, from, sender, args }) {
  const target = getTargetJid(msg, args);
  const category = CATEGORY_OVERRIDE[actionName] || actionName;

  let gifUrl;
  try {
    gifUrl = await fetchGif(category);
  } catch (err) {
    return sock.sendMessage(from, { text: `❌ Couldn't fetch a gif right now: ${err.message}` });
  }

  const verb = ACTIONS[actionName];
  const senderTag = `@${sender.split('@')[0]}`;
  const caption = target
    ? `${senderTag} ${verb} @${target.split('@')[0]}!`
    : `${senderTag} ${verb} the chat!`;

  const mentions = target ? [sender, target] : [sender];

  await sock.sendMessage(from, {
    image: { url: gifUrl },
    caption,
    mentions,
  });
}

const commandModules = Object.keys(ACTIONS).map((actionName) => ({
  name: actionName,
  category: 'fun',
  description: `React with a ${actionName} gif: .${actionName} (reply to someone, or .${actionName} <number>)`,
  execute: (ctx) => runAction(actionName, ctx),
}));

module.exports = { multi: commandModules };
