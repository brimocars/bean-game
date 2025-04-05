const model = require('../model/setup.js');

const createGame = async (req, res) => {
  try {
    const { player } = req.body;
    const gameObject = await model.createGame(player);
    res.send({ message: 'Game created!', gameObject });
  } catch (error) {
    console.log(`create game: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const joinGame = async (req, res) => {
  try {
    const { player } = req.body;
    const { gameCode } = req.query;
    const gameObject = await model.joinGame(player, gameCode);
    res.send({ message: `Player ${player.name} joined game`, gameObject });
  } catch (error) {
    console.log(`join game: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const startGame = async (req, res) => {
  try {
    const { gameId } = req.query;
    const gameObject = await model.startGame(gameId);
    res.send({ message: 'Game started!', gameObject });
  } catch (error) {
    console.log(`start game: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { gameId } = req.query;
    const returnedGameId = await model.deleteGame(gameId);
    res.send({ message: 'Game deleted', gameId: returnedGameId });
  } catch (error) {
    console.log(`delete game: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const leaveGame = async (req, res) => {
  try {
    const { player } = req.body;
    const { gameId } = req.query;
    const gameObject = await model.leaveGame(gameId, player);
    res.send({ message: `Player ${player.name} has left game ${gameId}`, gameObject });
  } catch (error) {
    console.log(`leave game: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  createGame,
  joinGame,
  startGame,
  deleteGame,
  leaveGame,
};
