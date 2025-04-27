const { v4: uuidv4 } = require('uuid');
const gameObjects = require('../db/gameObjects.js');
const { Phases } = require('./utils/enums.js');

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

  if (gameObject.activePlayerIndex === player.index && gameObject.phase === Phases.PLANT) {
    player.plantedThisTurn = player.plantedThisTurn ? player.plantedThisTurn + 1 : 1;
  }

  player.hand.splice(handIndex, 1);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const deleteFromPlantNow = async (gameId, playerName, plantNowIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const player = gameObject.players.find((p) => p.name === playerName);
  if (!player) {
    throw new Error('Player not found');
  }
  if (!player.cardsToPlantNow) {
    throw new Error('No cards to plant now');
  }
  if (plantNowIndex < 0 || plantNowIndex >= player.cardsToPlantNow.length) {
    throw new Error('Invalid plant now index');
  }
  player.cardsToPlantNow.splice(plantNowIndex, 1);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const addToPlantNow = async (gameId, playerName, cardName) => {
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
  player.cardsToPlantNow.push(cardToAdd);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const addToDraw = async (gameId, cardName) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const cardToAdd = gameObject.uniqueCardsInDeck[cardName];
  if (!cardToAdd) {
    throw new Error('Card not found in deck');
  }
  gameObject.draw.push(cardToAdd);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const addToDiscard = async (gameId, cardName) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const cardToAdd = gameObject.uniqueCardsInDeck[cardName];
  if (!cardToAdd) {
    throw new Error('Card not found in deck');
  }
  gameObject.discard.push(cardToAdd);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const deleteFromDraw = async (gameId, drawIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (drawIndex < 0 || drawIndex >= gameObject.draw.length) {
    throw new Error('Invalid draw index');
  }
  gameObject.draw.splice(drawIndex, 1);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const deleteFromDiscard = async (gameId, discardIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (discardIndex < 0 || discardIndex >= gameObject.discard.length) {
    throw new Error('Invalid draw index');
  }
  gameObject.discard.splice(discardIndex, 1);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

module.exports = {
  deleteFromHand,
  addToHand,
  plantFromAnywhereInHand,
  deleteFromPlantNow,
  addToPlantNow,
  addToDraw,
  addToDiscard,
  deleteFromDraw,
  deleteFromDiscard,
};
