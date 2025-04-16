const setup = require('../../src/lib/setup.js');
const gameObjects = require('../../src/db/gameObjects.js');

jest.mock('../../src/db/gameObjects.js', () => {
  class FakeGameObjects {
    constructor(go) {
      this.go = go;
    }

    async get(gameId) {
      return (this.go?.gameId === gameId) ? this.go : undefined;
    }

    async findByGameCode(gameCode) {
      return (this.go?.gameCode === gameCode) ? this.go : undefined;
    }

    async insert(gameObject) {
      this.go = gameObject;
    }

    async delete(gameId) {
      if (this.go?.gameId === gameId) {
        this.go = undefined;
      }
    }
  }

  const fakeGameObjects = new FakeGameObjects();
  return fakeGameObjects;
});

beforeEach(() => {
  gameObjects.go = undefined;
});

describe('create game', () => {
  it('should create a game', async () => {
    const { gameId } = await setup.createGame('a');
    const go = await gameObjects.get(gameId);
    expect(go).toBeDefined();
    expect(go.players).toHaveLength(1);
  });

  it('should fail to create a game with no player', () => {
    // wrapping the function call in a function is required to test with toThrow
    expect(async () => setup.createGame()).rejects.toThrow();
  });
  it('should fail to create a game with an invalid name', () => {
    expect(async () => setup.createGame(123)).rejects.toThrow();
  });
});

describe('join game', () => {
  let gameCode;
  let gameId;
  beforeEach(async () => {
    const game = await setup.createGame('a');
    gameCode = game.gameCode;
    gameId = game.gameId;
  });

  it('should join a game', async () => {
    const go = await setup.joinGame('b', gameCode);
    expect(go.players).toHaveLength(2);
  });

  it('should join a game with multiple players', async () => {
    const go = await gameObjects.get(gameId);
    await setup.joinGame('b', gameCode);
    await setup.joinGame('c', gameCode);
    await setup.joinGame('d', gameCode);
    await setup.joinGame('e', gameCode);
    await setup.joinGame('f', gameCode);
    expect(go.players).toHaveLength(6);
  });

  it('should fail to join a game with too many players', async () => {
    const go = await gameObjects.get(gameId);
    await setup.joinGame('b', gameCode);
    await setup.joinGame('c', gameCode);
    await setup.joinGame('d', gameCode);
    await setup.joinGame('e', gameCode);
    await setup.joinGame('f', gameCode);
    await setup.joinGame('g', gameCode);
    expect(async () => setup.joinGame('h', gameCode)).rejects.toThrow();
    expect(go.players).toHaveLength(7);
  });

  it('should fail to join with a duplicate name', async () => {
    const go = await gameObjects.get(gameId);
    await setup.joinGame('b', gameCode);
    expect(async () => setup.joinGame('b', gameCode)).rejects.toThrow();
    expect(go.players).toHaveLength(2);
  });

  it('should fail to join a game that doesn\t exist', () => {
    expect(async () => setup.joinGame('b', 'fake')).rejects.toThrow();
  });
});

describe('start game', () => {
  let gameCode;
  let gameId;
  beforeEach(async () => {
    const game = await setup.createGame('a');
    gameCode = game.gameCode;
    gameId = game.gameId;
  });
  const addPlayersToGame = async () => {
    await setup.joinGame('b', gameCode);
    await setup.joinGame('c', gameCode);
  };

  it('should start a game', async () => {
    const go = await gameObjects.get(gameId);
    await addPlayersToGame();
    await setup.startGame(gameId);
    expect(go.phase).toBe('plant');
  });

  it('should fail to start a game without enough players', async () => {
    expect(async () => setup.startGame(gameId)).rejects.toThrow();
  });

  it('should fail to start a game that doesn\'t exist', async () => {
    await addPlayersToGame();
    expect(async () => setup.startGame('fake')).rejects.toThrow();
  });

  it('should fail to start a game that has already started', async () => {
    await addPlayersToGame();
    await setup.startGame(gameId);
    expect(async () => setup.startGame(gameId)).rejects.toThrow();
  });
});

describe('delete and leave game', () => {
  let gameCode;
  let gameId;
  beforeEach(async () => {
    const game = await setup.createGame('a');
    gameCode = game.gameCode;
    gameId = game.gameId;
    await setup.joinGame('b', gameCode);
    await setup.joinGame('c', gameCode);
  });

  it('should delete a game', async () => {
    await setup.deleteGame(gameId);
    const go = await gameObjects.get(gameId);
    expect(go).toBeUndefined();
  });

  it('should fail to delete a game that doesn\'t exist', async () => {
    await setup.deleteGame(gameId);
    expect(() => setup.deleteGame(gameId)).rejects.toThrow();
  });
});
