const shuffle = require('shuffle-array');
const { v4: uuidv4 } = require('uuid');
const { Phases } = require('./utils/enums.js');
const Card = require('./utils/card.js');
const gameObjects = require('../db/gameObjects.js');

const defaultBeans = {
  // TODO: uncomment
  // wax: new Card([4, 7, 9, 11], 22, 'wax'),
  // blue: new Card([4, 6, 8, 10], 20, 'blue'),
  // chili: new Card([3, 6, 8, 9], 18, 'chili'),
  // stink: new Card([3, 5, 7, 8], 16, 'stink'),
  // green: new Card([3, 5, 6, 7], 14, 'green'),
  // soy: new Card([2, 4, 6, 7], 12, 'soy'),
  black: new Card([2, 4, 5, 6], 10, 'black'),
  red: new Card([2, 3, 4, 5], 8, 'red'),
};

const coffee = new Card([4, 7, 10, 12], 24, 'coffee');
const garden = new Card([0, 2, 3, 3], 6, 'garden');
const cocoa = new Card([2, 2, 3, 4], 4, 'cocoa');

const createGame = (player) => {
  if (!player) {
    throw new Error('No player');
  }

  if (typeof player.name !== 'string' || player.name.length === 0) {
    throw new Error('Invalid player name');
  }

  const gameId = uuidv4();
  gameObjects.set(gameId, {
    gameId,
    players: [player],
  });

  return gameObjects.get(gameId);
};

const joinGame = (player, gameId) => {
  const gameObject = gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }

  if (gameObject.phase) {
    throw new Error('Game already started');
  }

  if (gameObject.players.length > 6) {
    throw new Error('Max players reached');
  }

  if (typeof player.name !== 'string' || player.name.length === 0) {
    throw new Error('Invalid player name');
  }

  if (gameObject.players.find((p) => p.name === player.name)) {
    throw new Error(`Player '${player.name}' already in game`);
  }

  gameObject.players.push(player);
  return gameObject;
};

const startGame = (gameId) => {
  const gameObject = gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }

  if (gameObject.phase) {
    throw new Error('Game already started');
  }

  if (gameObject.players?.length < 3) {
    throw new Error('Not enough players');
  }

  const deck = [];
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(defaultBeans)) {
    for (let i = 0; i < value.amountInDeck; i++) {
      deck.push(value);
    }
  }

  switch (gameObject.players.length) {
    case 3:
      for (let i = 0; i < coffee.amountInDeck; i++) {
        deck.push(coffee);
      }
      for (let i = 0; i < garden.amountInDeck; i++) {
        deck.push(garden);
      }
      gameObject.players.forEach((player) => {
        player.maxFields = 3;
      });
      break;
    case 4:
    case 5:
      // TODO: uncomment
      // for (let i = 0; i < cocoa.amountInDeck; i++) {
      //   deck.push(cocoa);
      // }
      for (let i = 0; i < garden.amountInDeck; i++) {
        deck.push(garden);
      }
      gameObject.players.forEach((player) => {
        player.maxFields = 2;
      });
      break;
    case 6:
    case 7:
      for (let i = 0; i < coffee.amountInDeck; i++) {
        deck.push(cocoa);
      }
      gameObject.players.forEach((player) => {
        player.maxFields = 2;
      });
      break;
    default:
      throw new Error('Invalid number of players');
  }

  gameObject.players.forEach((player) => {
    player.hand = [];
    player.money = 0;
    player.fields = [];
    for (let i = 0; i < player.maxFields; i++) {
      player.fields.push({ amount: 0, card: undefined });
    }
    player.cardsToPlantNow = [];
  });

  shuffle(gameObject.players);
  shuffle(deck);
  gameObject.players.forEach((player, index) => {
    player.index = index;
  });
  const shuffledDeck = shuffle(deck);
  gameObject.draw = [];
  gameObject.discard = [];
  gameObject.timesShuffled = 0;
  gameObject.activeTrades = [];
  gameObject.isOver = false;

  for (let i = 0; i < shuffledDeck.length; i++) {
    const player = gameObject.players[Math.floor(i / 5)];
    if (player) {
      player.hand.push(shuffledDeck[i]);
    } else {
      gameObject.draw.push(shuffledDeck[i]);
    }
  }
  gameObject.activePlayerIndex = 0;
  gameObject.phase = Phases.PLANT;

  return gameObject;
};

const deleteGame = (gameId) => {
  const gameObject = gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  gameObjects.delete(gameId);
  return gameId;
};

const leaveGame = (gameId, player) => {
  const gameObject = gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (gameObject.phase) {
    throw new Error('Game already started');
  }
  if (!gameObject.players.find((p) => p.name === player.name)) {
    throw new Error(`Player '${player.name}' not in game`);
  }
  gameObject.players = gameObject.players.filter((p) => p.name !== player.name);
  if (gameObject.players.length === 0) {
    // delete game if no players are left
    gameObjects.delete(gameId);
    return {};
  }
  return gameObject;
};

module.exports = {
  createGame,
  joinGame,
  startGame,
  deleteGame,
  leaveGame,
};
