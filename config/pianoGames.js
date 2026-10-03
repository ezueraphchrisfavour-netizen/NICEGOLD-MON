// Not persisted to disk on purpose — a game that survives a bot restart mid-round would be confusing.
const activeGames = new Map();

const GAME_DURATION_MS = 20_000;
const GRID_SIZE = 9; // 3x3

function startGame(chatId) {
  const winningTile = Math.floor(Math.random() * GRID_SIZE) + 1;
  const game = {
    winningTile,
    expiresAt: Date.now() + GAME_DURATION_MS,
  };
  activeGames.set(chatId, game);
  return game;
}

function getGame(chatId) {
  const game = activeGames.get(chatId);
  if (!game) return null;
  if (Date.now() > game.expiresAt) {
    activeGames.delete(chatId);
    return null;
  }
  return game;
}

function endGame(chatId) {
  activeGames.delete(chatId);
}

module.exports = { startGame, getGame, endGame, GAME_DURATION_MS, GRID_SIZE };
