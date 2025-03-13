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
