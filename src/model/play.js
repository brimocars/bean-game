const shuffle = require('shuffle-array');
const { v4: uuidv4 } = require('uuid');
const gameObjects = require('../db/gameObjects.js');
const { Phases } = require('./utils/enums.js');

const shuffleDrawPileOrEndGame = async (gameId) => {
  const gameObject = await gameObjects.get(gameId);
  if (gameObject.timesShuffled < 2) {
    shuffle(gameObject.discard);
    [gameObject.draw, gameObject.discard] = [gameObject.discard, gameObject.draw];
    gameObject.timesShuffled += 1;
  } else {
    gameObject.isOver = true;
  }
  return gameObject.isOver;
};

const endGame = async (gameId) => {
  const gameObject = await gameObjects.get(gameId);
  gameObject.players.forEach((player) => {
    player.fields.forEach((field) => {
      harvestField(gameId, player, field);
    });
  });

  const gameResults = {};
  gameObject.players.forEach((player) => {
    gameResults[player.name] = player.money;
    console.log(`player ${player.name} has ${player.money} money`);
  });
  const winner = gameObject.players.reduce((w, player) => (player.money > w.money ? player : w), { money: -1 });
  console.log(`winner is ${winner.name} with ${winner.money} money`);
  return gameResults;
};

const harvestField = async (gameId, player, field) => {
  const gameObject = await gameObjects.get(gameId);
  let moneyToGet = 0;
  const amountInField = field.amount;
  const nameInField = field.card.name;
  field.card.amountToMoney.forEach((amount, index) => {
    if (amountInField >= amount) {
      moneyToGet = index + 1;
    }
  });

  for (let i = moneyToGet; i < amountInField; i++) {
    gameObject.discard.push(field.card);
  }
  player.money += moneyToGet;
  field.amount = 0;
  field.card = null;
  return nameInField;
};

const plantFromHand = async (gameId, fieldIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }

  const activePlayer = gameObject.players[gameObject.activePlayerIndex];

  const fieldToPlantIn = activePlayer.fields[fieldIndex];
  if (!fieldToPlantIn) {
    throw new Error('Invalid field');
  }

  if (activePlayer.plantedThisTurn >= 2) {
    throw new Error('Max plantings reached');
  }

  if (activePlayer.hand.length === 0) {
    throw new Error('No cards to plant');
  }

  if (fieldToPlantIn.amount === 0 || fieldToPlantIn.card?.name === activePlayer.hand[0].name) {
    const cardToPlant = activePlayer.hand.shift();
    fieldToPlantIn.amount++;
    fieldToPlantIn.card = cardToPlant;
    activePlayer.plantedThisTurn = activePlayer.plantedThisTurn ? activePlayer.plantedThisTurn + 1 : 1;
    gameObject.updateId = uuidv4();
    await gameObjects.insert(gameObject);
    return { gameObject, planted: `${fieldToPlantIn.amount} ${cardToPlant.name}` };
  }
  throw new Error('Unable to plant in occupied field');
};

const turn = async (gameId) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }

  if (gameObject.phase !== Phases.PLANT) {
    throw new Error('Incorrect phase');
  }

  const activePlayer = gameObject.players[gameObject.activePlayerIndex];
  const { draw } = gameObject;

  if (!activePlayer.plantedThisTurn) {
    throw new Error('Must plant at least one card');
  }

  gameObject.phase = Phases.TRADE;
  delete activePlayer.plantedThisTurn;
  const turnedCards = [];

  if (draw.length <= 2) {
    while (draw.length > 0 && turnedCards.length < 2) {
      turnedCards.push(draw.pop());
    }
    if (!shuffleDrawPileOrEndGame(gameId)) {
      while (draw.length > 0 && turnedCards.length < 2) {
        turnedCards.push(draw.pop());
      }
    }
  } else {
    turnedCards.push(draw.pop());
    turnedCards.push(draw.pop());
  }

  gameObject.turnedCards = turnedCards;
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return { gameObject, turnedCards: turnedCards.reduce((str, card) => `${str}${card.name}, `, '') };
};

// const validateTrade = (trader, tradee, cardsToGive, cardsToReceive) => {

// };

const offerTrade = async (gameId, traderName, tradeeName, cardsToGive, cardsToReceive) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.TRADE) {
    throw new Error('Incorrect phase');
  }
  if (!traderName || !tradeeName || !cardsToGive || !cardsToReceive) {
    throw new Error('Invalid trade');
  }
  if (cardsToGive.length === 0 && cardsToReceive.length === 0) {
    throw new Error('Cannot trade nothing for nothing');
  }
  if (traderName === tradeeName) {
    throw new Error('Cannot trade with yourself');
  }

  const activePlayer = gameObject.players[gameObject.activePlayerIndex];
  if (activePlayer.name !== traderName && activePlayer.name !== tradeeName) {
    throw new Error('Cannot trade between players not currently taking their turns');
  }
  const trader = gameObject.players.find((p) => p.name === traderName);
  const tradee = gameObject.players.find((p) => p.name === tradeeName);
  if (!trader || !tradee) {
    throw new Error('Player not found');
  }
  if (cardsToGive.turnedCards?.length && trader.name !== activePlayer.name) {
    throw new Error('Cannot trade away turned cards unless you are the active player');
  }

  const { turnedCards } = gameObject;
  if (trader === activePlayer) {
    cardsToGive.turnedCards?.forEach((cardIndex) => {
      if (!turnedCards[cardIndex]) {
        throw new Error('Card not available');
      }
    });
  }
  cardsToGive.hand?.forEach((cardIndex) => {
    if (!trader.hand[cardIndex]) {
      throw new Error('Card not available');
    }
  });

  let tradeeCardsAmount = tradee.hand.length;
  if (tradee === activePlayer) {
    tradeeCardsAmount += turnedCards.length;
  }
  if (tradeeCardsAmount < cardsToReceive.length) {
    throw new Error('Tradee does not have enough cards to give');
  }

  const trade = {
    tradeId: uuidv4(),
    traderName,
    tradeeName,
    cardsToGive,
    cardsToReceive,
  };
  gameObject.activeTrades.push(trade);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return { gameObject, newTrade: trade.tradeId };
};

const acceptTrade = async (gameId, tradeId, chosenCardsToReceive) => {
  const gameObject = await gameObjects.get(gameId);

  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.TRADE) {
    throw new Error('Incorrect phase');
  }
  const trade = gameObject.activeTrades.find((t) => t.tradeId === tradeId);
  if (!trade) {
    throw new Error('Trade not found');
  }

  const {
    traderName, tradeeName, cardsToGive, cardsToReceive,
  } = trade;
  const trader = gameObject.players.find((p) => p.name === traderName);
  const tradee = gameObject.players.find((p) => p.name === tradeeName);
  const activePlayer = gameObject.players[gameObject.activePlayerIndex];

  if (chosenCardsToReceive.turnedCards?.length && tradee !== activePlayer) {
    throw new Error('Cannot trade away turned cards because you are the active player');
  }

  const { turnedCards } = gameObject;
  if (tradee === activePlayer) {
    const usedTurnedIndexes = new Set();
    chosenCardsToReceive.turnedCards?.forEach((cardIndex) => {
      const foundCardIndex = cardsToReceive
        .findIndex((cardName, index) => turnedCards[cardIndex].name === cardName && !usedTurnedIndexes.has(index));
      if (foundCardIndex === -1) {
        throw new Error('Invalid card');
      }
      usedTurnedIndexes.add(foundCardIndex);
    });
  }
  const usedHandIndexes = new Set();
  chosenCardsToReceive.hand?.forEach((cardIndex) => {
    // if (!tradee.hand[cardIndex]) {
    //   throw new Error('Card not available');
    // }
    const foundCardIndex = cardsToReceive
      .findIndex((cardName, index) => tradee.hand[cardIndex].name === cardName && !usedHandIndexes.has(index));
    if (foundCardIndex === -1) {
      throw new Error('Invalid card');
    }
    usedHandIndexes.add(foundCardIndex);
  });

  // validation complete, we can move stuff around now
  tradee.cardsToPlantNow = tradee.cardsToPlantNow ?? [];
  trader.cardsToPlantNow = trader.cardsToPlantNow ?? [];

  chosenCardsToReceive.turnedCards?.forEach((cardIndex) => {
    trader.cardsToPlantNow.push(turnedCards[cardIndex]);
    turnedCards[cardIndex] = null;
  });
  cardsToGive.turnedCards?.forEach((cardIndex) => {
    tradee.cardsToPlantNow.push(turnedCards[cardIndex]);
    turnedCards[cardIndex] = null;
  });
  chosenCardsToReceive.hand?.forEach((cardIndex) => {
    trader.cardsToPlantNow.push(tradee.hand[cardIndex]);
    tradee.hand[cardIndex] = null;
  });
  cardsToGive.hand?.forEach((cardIndex) => {
    tradee.cardsToPlantNow.push(trader.hand[cardIndex]);
    trader.hand[cardIndex] = null;
  });

  trader.hand = trader.hand.filter((card) => card !== null);
  tradee.hand = tradee.hand.filter((card) => card !== null);
  gameObject.turnedCards = turnedCards.filter((card) => card !== null);

  // maybe cancel other active trades because stuff moved around
  // TODO: make this smart
  gameObject.activeTrades = [];
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const denyTrade = async (gameId, tradeId) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.TRADE) {
    throw new Error('Incorrect phase');
  }
  const trade = gameObject.activeTrades.find((t) => t.tradeId === tradeId);
  if (!trade) {
    throw new Error('Trade not found');
  }
  gameObject.activeTrades = gameObject.activeTrades.filter((t) => t.tradeId !== tradeId);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const endTradingPhase = async (gameId) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.TRADE) {
    throw new Error('Incorrect phase');
  }
  gameObject.activeTrades = [];
  const activePlayer = gameObject.players[gameObject.activePlayerIndex];
  gameObject.phase = Phases.END;
  gameObject.turnedCards.forEach((card) => {
    if (card !== null) {
      activePlayer.cardsToPlantNow.push(card);
    }
  });
  gameObject.turnedCards = [];
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return gameObject;
};

const harvest = async (gameId, playerName, fieldIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  const player = gameObject.players.find((p) => p.name === playerName);
  if (!player) {
    throw new Error('Player not found');
  }

  const field = player.fields[fieldIndex];
  if (!field) {
    throw new Error('Invalid field index');
  }
  if (field.amount === 0 || !field.card) {
    throw new Error('Cannot harvest empty field');
  }
  // protected bean clause
  if (field.amount === 1 && player.fields.some((f) => f.amount > 1)) {
    throw new Error('Protected bean clause: cannot harvest a field of 1 if you have another field with more than 1');
  }

  const harvestedCardName = harvestField(gameId, player, field);
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return { gameObject, money: player.money, card: harvestedCardName };
};

const plantFromPlantNow = async (gameId, playerName, cardName, fieldIndex) => {
  const gameObject = await gameObjects.get(gameId);
  if (!gameObject) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.END) {
    throw new Error('Incorrect phase');
  }
  const player = gameObject.players.find((p) => p.name === playerName);
  if (!player) {
    throw new Error('Player not found');
  }
  const field = player.fields[fieldIndex];
  if (!field) {
    throw new Error('Invalid field index');
  }
  const cardToPlantIndex = player.cardsToPlantNow.findIndex((card) => card.name === cardName);
  if (cardToPlantIndex === -1) {
    throw new Error('Card not found');
  }
  const cardToPlant = player.cardsToPlantNow[cardToPlantIndex];
  if (field.amount !== 0 && field.card?.name !== cardToPlant.name) {
    throw new Error('Cannot plant in occupied field');
  }
  field.amount++;
  field.card = cardToPlant;
  player.cardsToPlantNow.splice(cardToPlantIndex, 1);

  const timeToMoveOn = gameObject.players.every((p) => !p.cardsToPlantNow.length);
  if (timeToMoveOn) {
    if (gameObject.draw.length > gameObject.players.length) {
      // deck will not run out
      let playerIndexToDraw = gameObject.activePlayerIndex;
      for (let i = 0; i < gameObject.players.length; i++) {
        gameObject.players[playerIndexToDraw].hand.push(gameObject.draw.pop());
        playerIndexToDraw++;
        if (playerIndexToDraw >= gameObject.players.length) {
          playerIndexToDraw = 0;
        }
      }
    } else {
      // deck will run out
      const amountToDraw = gameObject.draw.length;
      const amountToDrawAfter = gameObject.players.length - amountToDraw;
      let playerIndexToDraw = gameObject.activePlayerIndex;
      for (let i = 0; i < amountToDraw; i++) {
        gameObject.players[playerIndexToDraw].hand.push(gameObject.draw.pop());
        playerIndexToDraw++;
        if (playerIndexToDraw >= gameObject.players.length) {
          playerIndexToDraw = 0;
        }
      }
      if (!shuffleDrawPileOrEndGame(gameId)) {
        for (let i = 0; i < amountToDrawAfter; i++) {
          // TODO: maybe fix bug where if only 1 card is in the discard when it gets shuffled,
          // shuffleDrawPileOrEndGame will need to be called again. But honestly this is unlikely and I have more
          // important things to do
          const nextCard = gameObject.draw.pop();
          if (nextCard) {
            gameObject.players[playerIndexToDraw].hand.push(nextCard);
          }
          playerIndexToDraw++;
          if (playerIndexToDraw >= gameObject.players.length) {
            playerIndexToDraw = 0;
          }
        }
      }

      if (gameObject.isOver) {
        gameObject.gameResults = endGame(gameId);
      }
    }
    gameObject.phase = Phases.PLANT;
    gameObject.activePlayerIndex = (gameObject.activePlayerIndex + 1) % gameObject.players.length;
  }
  gameObject.updateId = uuidv4();
  await gameObjects.insert(gameObject);
  return { gameObject, planted: `${field.amount} ${cardToPlant.name}` };
};

module.exports = {
  plantFromHand,
  turn,
  offerTrade,
  acceptTrade,
  denyTrade,
  endTradingPhase,
  harvest,
  plantFromPlantNow,
};
