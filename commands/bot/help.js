module.exports = {
  name: 'help',
  category: 'bot',
  description: 'Show a quick command guide.',
  execute: async ({ sock, from }) => {
    await sock.sendMessage(from, {
      text:
`𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵

╭─〔 BOT 〕
│ .menu
│ .help
│ .ping
│ .botinfo
│ .uptime
│ .time
│ .date
│ .owner
╰────────────

╭─〔 GROUP 〕
│ .groupinfo
│ .admins
│ .tagall
│ .hidetag
│ .rules
╰────────────

╭─〔 FUN 〕
│ .joke
│ .quote
│ .coinflip
│ .dice
│ .choose
│ .8ball
│ .say
│ .reverse
╰────────────

╭─〔 ECONOMY 〕
│ .balance
│ .daily
│ .profile
╰────────────

Use .menu for the full existing menu.`
    });
  },
};
