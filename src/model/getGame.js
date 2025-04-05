const gameObjects = require('../db/gameObjects.js');

const getGame = async (gameId) => {
  if (!gameId) {
    return gameObjects.getAll();
  }
  const gameObject = await gameObjects.get(gameId);
  if (gameObject) {
    return gameObject;
  }
  throw new Error('Game not found');
};

module.exports = {
  getGame,
};
