const setup = require('../../src/model/setup.js');
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
    const { gameId } = setup.createGame({ name: 'a' });
    const go = gameObjects.get(gameId);
    expect(go).toBeDefined();
    expect(go.players).toHaveLength(1);
  });

  it('should fail to create a game with no player', () => {
    // wrapping the function call in a function is required to test with toThrow
    expect(() => setup.createGame()).toThrow();
  });
  it('should fail to create a game with an invalid name', () => {
    expect(() => setup.createGame({ name: 123 })).toThrow();
  });
});

describe('join game', () => {
  let gameId;
  beforeEach(() => {
    gameId = setup.createGame({ name: 'a' }).gameId;
  });

  it('should join a game', () => {
    const go = setup.joinGame({ name: 'b' }, gameId);
    expect(go.players).toHaveLength(2);
  });

  it('should join a game with multiple players', () => {
    const go = gameObjects.get(gameId);
    setup.joinGame({ name: 'b' }, gameId);
    setup.joinGame({ name: 'c' }, gameId);
    setup.joinGame({ name: 'd' }, gameId);
    setup.joinGame({ name: 'e' }, gameId);
    setup.joinGame({ name: 'f' }, gameId);
    expect(go.players).toHaveLength(6);
  });

  it('should fail to join a game with too many players', () => {
    const go = gameObjects.get(gameId);
    setup.joinGame({ name: 'b' }, gameId);
    setup.joinGame({ name: 'c' }, gameId);
    setup.joinGame({ name: 'd' }, gameId);
    setup.joinGame({ name: 'e' }, gameId);
    setup.joinGame({ name: 'f' }, gameId);
    setup.joinGame({ name: 'g' }, gameId);
    expect(() => setup.joinGame({ name: 'h' }, gameId)).toThrow();
    expect(go.players).toHaveLength(7);
  });

  it('should fail to join with a duplicate name', () => {
    const go = gameObjects.get(gameId);
    setup.joinGame({ name: 'b' }, gameId);
    expect(() => setup.joinGame({ name: 'b' }, gameId)).toThrow();
    expect(go.players).toHaveLength(2);
  });

  it('should fail to join a game that doesn\t exist', () => {
    expect(() => setup.joinGame({ name: 'b' }, 'fake')).toThrow();
  });
});

describe('start game', () => {
  let gameId;
  beforeEach(() => {
    gameId = setup.createGame({ name: 'a' }).gameId;
  });
  const addPlayersToGame = () => {
    setup.joinGame({ name: 'b' }, gameId);
    setup.joinGame({ name: 'c' }, gameId);
  };

  it('should start a game', () => {
    const go = gameObjects.get(gameId);
    addPlayersToGame();
    setup.startGame(gameId);
    expect(go.phase).toBe('plant');
  });

  it('should fail to start a game without enough players', () => {
    expect(() => setup.startGame(gameId)).toThrow();
  });

  it('should fail to start a game that doesn\'t exist', () => {
    addPlayersToGame();
    expect(() => setup.startGame('fake')).toThrow();
  });

  it('should fail to start a game that has already started', () => {
    addPlayersToGame();
    setup.startGame(gameId);
    expect(() => setup.startGame(gameId)).toThrow();
  });
});

describe('delete and leave game', () => {
  let gameId;
  beforeEach(() => {
    gameId = setup.createGame({ name: 'a' }).gameId;
    setup.joinGame({ name: 'b' }, gameId);
    setup.joinGame({ name: 'c' }, gameId);
  });

  it('should delete a game', () => {
    setup.deleteGame(gameId);
    const go = gameObjects.get(gameId);
    expect(go).toBeUndefined();
  });

  it('should fail to delete a game that doesn\'t exist', () => {
    setup.deleteGame(gameId);
    expect(() => setup.deleteGame(gameId)).toThrow();
  });
});
