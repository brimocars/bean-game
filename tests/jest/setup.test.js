const model = require('../../src/model/setup.js');
const gameObjects = require('../../src/db/gameObjects.js');

jest.mock('../../src/db/gameObjects.js', () => {
  const go = new Map();
  return go;
});

beforeEach(() => {
  gameObjects.clear();
});

describe('create game', () => {
  it('should create a game', () => {
    expect(Array.from(gameObjects.keys())).toHaveLength(0);
    const { gameId } = model.createGame({ name: 'a' });
    const go = gameObjects.get(gameId);
    expect(go).toBeDefined();
    expect(go.players).toHaveLength(1);
  });

  it('should fail to create a game with no player', () => {
    // wrapping the function call in a function is required to test with toThrow
    expect(() => model.createGame()).toThrow();
  });
  it('should fail to create a game with an invalid name', () => {
    expect(() => model.createGame({ name: 123 })).toThrow();
  });
});

describe('join game', () => {
  let gameId;
  beforeEach(() => {
    gameId = model.createGame({ name: 'a' }).gameId;
  });

  it('should join a game', () => {
    const go = model.joinGame({ name: 'b' }, gameId);
    expect(go.players).toHaveLength(2);
  });

  it('should join a game with multiple players', () => {
    const go = gameObjects.get(gameId);
    model.joinGame({ name: 'b' }, gameId);
    model.joinGame({ name: 'c' }, gameId);
    model.joinGame({ name: 'd' }, gameId);
    model.joinGame({ name: 'e' }, gameId);
    model.joinGame({ name: 'f' }, gameId);
    expect(go.players).toHaveLength(6);
  });

  it('should fail to join a game with too many players', () => {
    const go = gameObjects.get(gameId);
    model.joinGame({ name: 'b' }, gameId);
    model.joinGame({ name: 'c' }, gameId);
    model.joinGame({ name: 'd' }, gameId);
    model.joinGame({ name: 'e' }, gameId);
    model.joinGame({ name: 'f' }, gameId);
    model.joinGame({ name: 'g' }, gameId);
    expect(() => model.joinGame({ name: 'h' }, gameId)).toThrow();
    expect(go.players).toHaveLength(7);
  });

  it('should fail to join with a duplicate name', () => {
    const go = gameObjects.get(gameId);
    model.joinGame({ name: 'b' }, gameId);
    expect(() => model.joinGame({ name: 'b' }, gameId)).toThrow();
    expect(go.players).toHaveLength(2);
  });
});
