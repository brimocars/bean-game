const gameObjects = require('../db/gameObjects.js');

const getGame = (gameId) => {
  const gameObject = gameObjects.get(gameId);
  if (gameObject) {
    return gameObject;
  }
  throw new Error('Game not found');
};

module.exports = {
  getGame,
};
