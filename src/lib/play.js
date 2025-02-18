const gameObject = require('../db/gameObject.js');
const { Phases } = require('./utils/enums.js');

const plant = (player, fieldIndex) => {
  if (!gameObject.gameId) {
    throw new Error('Game not found');
  }
  
  const activePlayer = gameObject.players[gameObject.activePlayerIndex];
  if (activePlayer.name !== player.name) {
    throw new Error('Not your turn');
  }

  const fieldToPlantIn = activePlayer.fields[fieldIndex];
  if (!fieldToPlantIn) {
    throw new Error('Invalid field');
  }

  if (activePlayer.plantedThisTurn >= 2) {
    throw new Error('Max plantings reached');
  }

  if (activePlayer.hand.length === 0) {
    gameObject.phase = Phases.DRAW;
    return gameObject;
  }

  if (fieldToPlantIn.length === 0 || fieldToPlantIn[0].name === activePlayer.hand[0].name) {
    const cardToPlant = activePlayer.hand.shift();
    fieldToPlantIn.push(cardToPlant);
    activePlayer.plantedThisTurn = activePlayer.plantedThisTurn ? activePlayer.plantedThisTurn + 1 : 1;
    return gameObject;
  } else {
    throw new Error('Unable to plant in occupied field');
  }
}

module.exports = {
  plant,
}