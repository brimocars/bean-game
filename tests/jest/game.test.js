const play = require('../../src/model/play.js');
const gameObjects = require('../../src/db/gameObjects.js');

const defaultGameId = 'eed66300-da60-4a1a-bbf8-5db7310c9cde';
jest.mock('../../src/db/gameObjects.js', () => {
  const go = new Map();
  go.set(defaultGameId, {
    gameId: 'eed66300-da60-4a1a-bbf8-5db7310c9cde',
    players: [
      {
        name: 'd',
        maxFields: 2,
        hand: [
          {
            name: 'garden',
            amountToMoney: [
              0,
              2,
              3,
              3,
            ],
            amountInDeck: 6,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
          {
            name: 'garden',
            amountToMoney: [
              0,
              2,
              3,
              3,
            ],
            amountInDeck: 6,
          },
        ],
        money: 0,
        fields: [
          {
            amount: 0,
          },
          {
            amount: 0,
          },
        ],
        cardsToPlantNow: [],
        index: 0,
      },
      {
        name: 'a',
        maxFields: 2,
        hand: [
          {
            name: 'red',
            amountToMoney: [
              2,
              3,
              4,
              5,
            ],
            amountInDeck: 8,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
          {
            name: 'garden',
            amountToMoney: [
              0,
              2,
              3,
              3,
            ],
            amountInDeck: 6,
          },
          {
            name: 'garden',
            amountToMoney: [
              0,
              2,
              3,
              3,
            ],
            amountInDeck: 6,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
        ],
        money: 0,
        fields: [
          {
            amount: 0,
          },
          {
            amount: 0,
          },
        ],
        cardsToPlantNow: [],
        index: 1,
      },
      {
        name: 'b',
        maxFields: 2,
        hand: [
          {
            name: 'red',
            amountToMoney: [
              2,
              3,
              4,
              5,
            ],
            amountInDeck: 8,
          },
          {
            name: 'red',
            amountToMoney: [
              2,
              3,
              4,
              5,
            ],
            amountInDeck: 8,
          },
          {
            name: 'garden',
            amountToMoney: [
              0,
              2,
              3,
              3,
            ],
            amountInDeck: 6,
          },
          {
            name: 'red',
            amountToMoney: [
              2,
              3,
              4,
              5,
            ],
            amountInDeck: 8,
          },
          {
            name: 'red',
            amountToMoney: [
              2,
              3,
              4,
              5,
            ],
            amountInDeck: 8,
          },
        ],
        money: 0,
        fields: [
          {
            amount: 0,
          },
          {
            amount: 0,
          },
        ],
        cardsToPlantNow: [],
        index: 2,
      },
      {
        name: 'c',
        maxFields: 2,
        hand: [
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
          {
            name: 'red',
            amountToMoney: [
              2,
              3,
              4,
              5,
            ],
            amountInDeck: 8,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
          {
            name: 'garden',
            amountToMoney: [
              0,
              2,
              3,
              3,
            ],
            amountInDeck: 6,
          },
          {
            name: 'black',
            amountToMoney: [
              2,
              4,
              5,
              6,
            ],
            amountInDeck: 10,
          },
        ],
        money: 0,
        fields: [
          {
            amount: 0,
          },
          {
            amount: 0,
          },
        ],
        cardsToPlantNow: [],
        index: 3,
      },
    ],
    draw: [
      {
        name: 'black',
        amountToMoney: [
          2,
          4,
          5,
          6,
        ],
        amountInDeck: 10,
      },
      {
        name: 'black',
        amountToMoney: [
          2,
          4,
          5,
          6,
        ],
        amountInDeck: 10,
      },
      {
        name: 'red',
        amountToMoney: [
          2,
          3,
          4,
          5,
        ],
        amountInDeck: 8,
      },
      {
        name: 'red',
        amountToMoney: [
          2,
          3,
          4,
          5,
        ],
        amountInDeck: 8,
      },
    ],
    discard: [],
    timesShuffled: 0,
    activeTrades: [],
    turnedCards: [],
    isOver: false,
    activePlayerIndex: 0,
    phase: 'plant',
  });
  return go;
});

const gameObject = gameObjects.get(defaultGameId);
const getPlayer = (name) => gameObject.players.find((p) => p.name === name);

describe('plant from hand', () => {
  it('should fail to turn before a card has been planted', () => {
    expect(() => play.turn(defaultGameId)).toThrow();
  });
  it('should plant the first card', () => {
    expect(gameObject.players[0].hand.length).toBe(5);
    play.plantFromHand(defaultGameId, 0);
    expect(gameObject.players[0].hand.length).toBe(4);
    expect(gameObject.players[0].fields[0].amount).toBe(1);
    expect(gameObject.players[0].fields[0].card.name).toBe('garden');
  });
  it('should fail to plant in an invalid field', () => {
    expect(() => play.plantFromHand(defaultGameId, 2)).toThrow();
  });
  it('should fail to plant a second card in the same field', () => {
    expect(() => play.plantFromHand(defaultGameId, 0)).toThrow();
  });
  it('should plant the second card in the second field', () => {
    play.plantFromHand(defaultGameId, 1);
    expect(gameObject.players[0].hand.length).toBe(3);
    expect(gameObject.players[0].fields[1].amount).toBe(1);
    expect(gameObject.players[0].fields[1].card.name).toBe('black');
  });
  it('should fail to plant a third card', () => {
    expect(() => play.plantFromHand(defaultGameId, 1)).toThrow();
  });
  it('should fail to plant in a game that doesn\'t exist', () => {
    expect(() => play.plantFromHand('fake', 1)).toThrow();
  });
});

describe('turn', () => {
  it('should fail to turn in a game that doesn\'t exist', () => {
    expect(() => play.turn('fake')).toThrow();
  });
  it('should turn over 2 cards', () => {
    expect(gameObject.draw.length).toBe(4);
    expect(gameObject.turnedCards?.length).toBe(0);
    play.turn(defaultGameId);
    expect(gameObject.draw.length).toBe(2);
    expect(gameObject.turnedCards.length).toBe(2);
    expect(gameObject.phase).toBe('trade');
  });
  it('should fail to turn over again', () => {
    expect(() => play.turn(defaultGameId)).toThrow();
  });
});

describe('offer trade', () => {
  it('should fail to offer a trade in a game that doesn\'t exist', () => {
    expect(() => play.offerTrade('fake')).toThrow();
  });
  it('should fail to offer a trade with an invalid player', () => {
    expect(() => play.offerTrade(defaultGameId, 'asdf', gameObject.players[0], { hand: [0] }, ['red'])).toThrow();
  });
  it('should fail to offer an empty trade', () => {
    expect(() => play.offerTrade(defaultGameId, gameObject.players[0], gameObject.players[1], {}, [])).toThrow();
  });
  it('should fail to offer a trade with cards that don\'t exist', () => {
    expect(() => play.offerTrade(
      defaultGameId,
      'd',
      'a',
      { hand: [13] },
      ['red'],
    )).toThrow();
    expect(() => play.offerTrade(
      defaultGameId,
      'd',
      'a',
      { turnedCards: [10] },
      ['red'],
    )).toThrow();
  });
  it('should offer a trade', () => {
    play.offerTrade(
      defaultGameId,
      'd',
      'a',
      { turnedCards: [0] },
      ['red'],
    );
    expect(gameObject.activeTrades.length).toBe(1);
  });
  it('should offer another trade', () => {
    play.offerTrade(
      defaultGameId,
      'd',
      'a',
      { hand: [0] },
      ['black'],
    );
    expect(gameObject.activeTrades.length).toBe(2);
  });
  it('should offer yet another trade', () => {
    play.offerTrade(
      defaultGameId,
      'a',
      'd',
      { hand: [0] },
      ['black'],
    );
    expect(gameObject.activeTrades.length).toBe(3);
  });
  it('should fail to offer a trade from a non-active player with turned cards', () => {
    expect(() => play.offerTrade(
      defaultGameId,
      'a',
      'd',
      { turnedCards: [0] },
      ['black'],
    )).toThrow();
  });
  it('should fail to offer between 2 non-active players', () => {
    expect(() => play.offerTrade(
      defaultGameId,
      'b',
      'a',
      { hand: [0] },
      ['black'],
    )).toThrow();
  });
});

describe('accept trade', () => {
  it('should fail to accept a trade in a game that doesn\'t exist', () => {
    expect(() => play.acceptTrade('fake')).toThrow();
  });
  it('should fail to accept a trade that doesn\'t exist', () => {
    expect(() => play.acceptTrade(defaultGameId, 'fake')).toThrow();
  });
  it('should fail to accept a trade with turned cards when not the active player', () => {
    expect(() => play.acceptTrade(defaultGameId, gameObject.activeTrades[2].tradeId, { turnedCards: [0] })).toThrow();
  });
  it('should fail to accept a trade with cards that don\'t match the offer', () => {
    expect(() => play.acceptTrade(defaultGameId, gameObject.activeTrades[0].tradeId, { hand: [1] })).toThrow();
  });
  it('should accept a trade', () => {
    const turnedOne = gameObject.turnedCards[0];
    play.acceptTrade(defaultGameId, gameObject.activeTrades[0].tradeId, { hand: [0] });
    expect(gameObject.activeTrades.length).toBe(0); // accepting a trade cancels other trades (for now)
    const d = getPlayer('d');
    const a = getPlayer('a');
    expect(a.hand.length).toBe(4);
    expect(d.cardsToPlantNow.length).toBe(1);
    expect(d.cardsToPlantNow[0].name).toBe('red');
    expect(a.cardsToPlantNow.length).toBe(1);
    expect(a.cardsToPlantNow[0].name).toBe(turnedOne.name);
  });
  it('should accept a trade (after re-offering it)', () => {
    play.offerTrade(
      defaultGameId,
      'a',
      'd',
      { hand: [2] },
      ['black'],
    );
    const d = getPlayer('d');
    const a = getPlayer('a');
    expect(d.cardsToPlantNow.length).toBe(1);
    console.log(gameObject.activeTrades);
    console.log(gameObject.activeTrades[0].cardsToGive);
    play.acceptTrade(defaultGameId, gameObject.activeTrades[0].tradeId, { hand: [1] });
    expect(a.hand.length).toBe(3);
    expect(d.cardsToPlantNow.length).toBe(2);
    expect(d.cardsToPlantNow[1].name).toBe('garden');
    expect(a.cardsToPlantNow.length).toBe(2);
    expect(a.cardsToPlantNow[1].name).toBe('black');
  });
});

describe('deny trade', () => {
  it('should fail to deny a trade in a game that doesn\'t exist', () => {
    expect(() => play.denyTrade('fake')).toThrow();
  });
  it('should fail to deny a trade that doesn\'t exist', () => {
    expect(() => play.denyTrade(defaultGameId, 'fake')).toThrow();
  });
  it('should deny a trade', () => {
    play.offerTrade(
      defaultGameId,
      'a',
      'd',
      { hand: [2] },
      ['black'],
    );
    expect(gameObject.activeTrades.length).toBe(1);
    play.denyTrade(defaultGameId, gameObject.activeTrades[0].tradeId);
    expect(gameObject.activeTrades.length).toBe(0);
  });
});

describe('end trading phase', () => {
  it('should fail to end trading phase in a game that doesn\'t exist', () => {
    expect(() => play.endTradingPhase('fake')).toThrow();
  });
  it('should end trading phase', () => {
    play.offerTrade(
      defaultGameId,
      'a',
      'd',
      { hand: [2] },
      ['black'],
    );
    const remainingTurned = gameObject.turnedCards[0];
    play.endTradingPhase(defaultGameId);
    expect(gameObject.phase).toBe('end');
    expect(gameObject.activeTrades.length).toBe(0);
    expect(getPlayer('d').cardsToPlantNow.length).toBe(3);
    expect(gameObject.turnedCards.length).toBe(0);
    expect(getPlayer('d').cardsToPlantNow[2].name).toBe(remainingTurned.name);
  });
});

// plant from plant now
// harvest
// ending game stuff
