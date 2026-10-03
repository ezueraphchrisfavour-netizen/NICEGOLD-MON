const EIGHTBALL = ['Yes.', 'No.', 'Ask again later.', 'Definitely.', 'Absolutely not.', 'It\'s certain.', 'Very doubtful.'];
const TRUTHS = ["What's your biggest fear?", "What's a secret you've never told anyone?", "What's the most embarrassing thing you've done?"];
const DARES = ["Send the last photo in your gallery.", "Text your crush 'hi' right now.", "Do 10 pushups and send a video."];
const ROASTS = ["You're the reason the gene pool needs a lifeguard.", "You bring everyone so much joy... when you leave the room.", "I'd explain it to you but I don't have crayons."];
const RIDDLES = ["I speak without a mouth and hear without ears. What am I? (An echo)", "The more you take, the more you leave behind. What am I? (Footsteps)"];
const FACTS = ["Honey never spoils.", "Bananas are berries, but strawberries aren't.", "Octopuses have three hearts."];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = {
  name: '8ball',
  aliases: ['truth', 'dare', 'roast', 'riddle', 'fact', 'howgay', 'howcute', 'rate'],
  category: 'fun',
  description: 'Various one-shot fun commands',
  execute: async ({ sock, from, args, invokedAs }) => {
    let text;
    switch (invokedAs) {
      case '8ball':
        if (!args.length) return sock.sendMessage(from, { text: 'Usage: .8ball <question>' });
        text = `🎱 ${pick(EIGHTBALL)}`;
        break;
      case 'truth':
        text = `❓ ${pick(TRUTHS)}`;
        break;
      case 'dare':
        text = `🔥 ${pick(DARES)}`;
        break;
      case 'roast':
        text = `💀 ${pick(ROASTS)}`;
        break;
      case 'riddle':
        text = `🧩 ${pick(RIDDLES)}`;
        break;
      case 'fact':
        text = `📚 ${pick(FACTS)}`;
        break;
      case 'howgay':
      case 'howcute':
      case 'rate':
        text = `📊 ${Math.floor(Math.random() * 101)}%`;
        break;
      default:
        text = '❓ Unknown fun command.';
    }
    await sock.sendMessage(from, { text });
  },
};
