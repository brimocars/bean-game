const { v4: uuidv4 } = require('uuid');
const gameObjects = require('../db/gameObjects.js');

const deleteFromHand = async (gameId, playerName, handIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const player = gameObject.players.find((p) => p.name === playerName);
  if (!player) {
    throw new Error('Player not found');
  }
  if (handIndex < 0 || handIndex >= player.hand.length) {
    throw new Error('Invalid hand index');
  }
  player.hand.splice(handIndex, 1);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const addToHand = async (gameId, playerName, cardName) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const player = gameObject.players.find((p) => p.name === playerName);
  if (!player) {
    throw new Error('Player not found');
  }
  const cardToAdd = gameObject.uniqueCardsInDeck[cardName];
  if (!cardToAdd) {
    throw new Error('Card not found in deck');
  }
  player.hand.push(cardToAdd);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const plantFromAnywhereInHand = async (gameId, playerName, handIndex, fieldIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const player = gameObject.players.find((p) => p.name === playerName);
  if (!player) {
    throw new Error('Player not found');
  }
  if ((handIndex !== 0 && !handIndex) || handIndex < 0 || handIndex >= player.hand.length) {
    throw new Error('Invalid hand index');
  }
  if ((fieldIndex !== 0 && !fieldIndex) || fieldIndex < 0 || fieldIndex >= player.fields.length) {
    throw new Error('Invalid field index');
  }
  const cardToPlant = player.hand[handIndex];

  if (player.fields[fieldIndex].card !== null && player.fields[fieldIndex].card.name !== cardToPlant.name) {
    throw new Error('Unable to plant in occupied field');
  }

  if (player.fields[fieldIndex].card === null) {
    player.fields[fieldIndex].card = cardToPlant;
    player.fields[fieldIndex].amount = 1;
  } else {
    player.fields[fieldIndex].amount += 1;
  }

  player.hand.splice(handIndex, 1);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

module.exports = {
  deleteFromHand,
  addToHand,
  plantFromAnywhereInHand,
};
