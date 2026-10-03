const { startGame, getGame, GAME_DURATION_MS, GRID_SIZE } = require('../../config/pianoGames');

function renderGrid() {
  const tiles = [];
  for (let i = 1; i <= GRID_SIZE; i++) tiles.push(`🎹${i}`);
  // 3 per row
  const rows = [];
  for (let i = 0; i < tiles.length; i += 3) rows.push(tiles.slice(i, i + 3).join('  '));
  return rows.join('\n');
}

module.exports = {
  name: 'piano',
  category: 'games',
  description: 'Guess the hidden piano tile to win coins',
  execute: async ({ sock, from }) => {
    const existing = getGame(from);
    if (existing) {
      return sock.sendMessage(from, { text: '🎹 A piano game is already running here — reply with a number 1-9!' });
    }

    startGame(from);
    const seconds = GAME_DURATION_MS / 1000;

    await sock.sendMessage(from, {
      text:
        `🎹 PIANO GAME 🎹\n\n${renderGrid()}\n\n` +
        `One tile is the winning key. Reply with just its number (1-${GRID_SIZE}) within ${seconds}s to win 100 coins!`,
    });
  },
};
