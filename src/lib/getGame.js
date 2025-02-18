const gameObject = require('../db/gameObject.js');

const getGame = () => {
  if (gameObject.gameId) {
    return gameObject;
  } else {
    throw new Error('Game not found');
  }
}

module.exports = {
  getGame,
}