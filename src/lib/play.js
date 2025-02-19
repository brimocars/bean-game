const shuffle = require('shuffle-array');
const { v4: uuidv4 } = require('uuid');
const gameObject = require('../db/gameObject.js');
const { Phases } = require('./utils/enums.js');

const plantFromHand = (player, fieldIndex) => {
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

const turn = () => {
  if (!gameObject.gameId) {
    throw new Error('Game not found');
  }

  if (gameObject.phase !== Phases.PLANT) {
    throw new Error('Incorrect phase');
  }

  const activePlayer = gameObject.players[gameObject.activePlayerIndex];
  const { draw, discard } = gameObject;

  if (activePlayer.plantedThisTurn < 1) {
    throw new Error('Must plant at least one card');
  }

  gameObject.phase = Phases.TRADE;
  delete activePlayer.plantedThisTurn;
  const turnedCards = [];

  if (draw.length <= 2) {
    while (draw.length > 0 && turnedCards.length < 2) {
      turnedCards.push(draw.pop());
    }
    if (gameObject.timesShuffled < 2) {
      shuffle(discard);
      [draw, discard] = [discard, draw];
      gameObject.timesShuffled += 1
      while (turnedCards.length < 2) {
        turnedCards.push(draw.pop());
      }
    } else {
      gameObject.isOver = true
    }
  } else {
    turnedCards.push(draw.pop());
    turnedCards.push(draw.pop());
  }

  gameObject.turnedCards = turnedCards;
  return gameObject;
}

const validateTrade = (trader, tradee, cardsToGive, cardsToReceive) => {

}

const offerTrade = (traderName, tradeeName, cardsToGive, cardsToReceive) => {
  if (!gameObject.gameId) {
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
  if (activePlayer.name !== trader.name && activePlayer !== tradee.name) {
    throw new Error('Cannot trade between players not currently taking their turns');
  }
  const trader = gameObject.find((p) => p.name === trader.name);
  const tradee = gameObject.find((p) => p.name === tradee.name);
  if (!trader || !tradee) {
    throw new Error('Player not found');
  }
  if (cardsToGive.turnedCards && trader !== activePlayer) {
    throw new Error('Cannot trade away turned cards unless you are the active player');
  }

  const { turnedCards } = gameObject;
  if (trader === activePlayer) {
    cardsToGive.turnedCards?.forEach((cardIndex) => {
      if (!turnedCards[cardIndex]) {
        throw new Error('Card not available');
      }
    })
  }
  cardsToGive.hand?.forEach((cardIndex) => {
    if (!trader.hand[cardIndex]) {
      throw new Error('Card not available');
    }
  })

  let tradeeCardsAmount = tradee.hand.length;
  if (tradee === activePlayer) {
    tradeeCardsAmount += turnedCards.length;
  }
  if (tradeeCardsAmount > cardsToReceive.length) {
    throw new Error('Tradee does not have enough cards to give');
  }

  const trade = {
    tradeId: uuidv4(),
    traderName,
    tradeeName,
    cardsToGive,
    cardsToReceive,
  }
  gameObject.activeTrades.push(trade);
  return gameObject;
}

const acceptTrade = (tradeId, chosenCardsToReceive) => {
  if (!gameObject.gameId) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.TRADE) {
    throw new Error('Incorrect phase');
  }
  const trade = gameObject.activeTrades.find((t) => t.tradeId === tradeId);
  if (!trade) {
    throw new Error('Trade not found');
  }
  
  const { traderName, tradeeName, cardsToGive, cardsToReceive } = trade;
  const trader = gameObject.players.find((p) => p.name === traderName);
  const tradee = gameObject.players.find((p) => p.name === tradeeName);
  const activePlayer = gameObject.players[gameObject.activePlayerIndex];

  if (chosenCardsToReceive.turnedCards && tradee !== activePlayer) {
    throw new Error('Cannot trade away turned cards because you are the active player');
  }

  const { turnedCards } = gameObject;
  if (tradee === activePlayer) {
    const usedTurnedIndexes = new Set();
    chosenCardsToReceive.turnedCards?.forEach((cardIndex) => {
      // if (!turnedCards[cardIndex]) {
      //   throw new Error('Card not available');
      // }
      const foundCardIndex = cardsToReceive.findIndex((cardName) => {
        return turnedCards[cardIndex].name === cardName && !usedTurnedIndexes.has(cardIndex);
      });
      if (foundCardIndex === -1) {
        throw new Error('Invalid card');
      }
      usedTurnedIndexes.add(foundCardIndex);
    })
  }
  const usedHandIndexes = new Set();
  chosenCardsToReceive.hand?.forEach((cardIndex) => {
    // if (!tradee.hand[cardIndex]) {
    //   throw new Error('Card not available');
    // }
    const foundCardIndex = cardsToReceive.findIndex((cardName) => {
      return tradee.hand[cardIndex].name === cardName && !usedHandIndexes.has(cardIndex);
    });
    if (foundCardIndex === -1) {
      throw new Error('Invalid card');
    }
    usedHandIndexes.add(foundCardIndex);
  })

  // validation complete, we can move stuff around now
  tradee.cardsToPlantNow = [];
  trader.cardsToPlantNow = [];

  chosenCardsToReceive.turnedCards?.forEach((cardIndex) => {
    trader.cardsToPlantNow.push(turnedCards[cardIndex]);
    turnedCards[cardIndex] = null;
  })
  cardsToGive.turnedCards?.forEach((cardIndex) => {
    tradee.cardsToPlantNow.push(turnedCards[cardIndex]);
    turnedCards[cardIndex] = null;
  })
  chosenCardsToReceive.hand?.forEach((cardIndex) => {
    trader.cardsToPlantNow.push(tradee.hand[cardIndex]);
    tradee.hand[cardIndex] = null;
  })
  cardsToGive.hand?.forEach((cardIndex) => {
    tradee.cardsToPlantNow.push(trader.hand[cardIndex]);
    trader.hand[cardIndex] = null;
  })

  trader.hand = trader.hand.filter((card) => card !== null);
  tradee.hand = tradee.hand.filter((card) => card !== null);

  // maybe cancel other active trades because stuff moved around
  // TODO: make this smart
  gameObject.activeTrades = [];
  return gameObject;
}

const endTradingPhase = () => {
  if (!gameObject.gameId) {
    throw new Error('Game not found');
  }
  if (gameObject.phase !== Phases.TRADE) {
    throw new Error('Incorrect phase');
  }
  const activePlayer = gameObject.players[gameObject.activePlayerIndex];
  gameObject.phase = Phases.END;
  gameObject.turnedCards.forEach((card) => {
    if (card !== null) {
      activePlayer.cardsToPlantNow.push(card);
    }
  })
  return gameObject;
}

module.exports = {
  plantFromHand,
  turn,
  offerTrade,
  acceptTrade,
  endTradingPhase,
}