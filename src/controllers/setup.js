const lib = require('../lib/setup.js');

const createGame = (req, res) => {
  try {
    const { player } = req.body;
    const gameObject = lib.createGame(player);
    res.send({ message: 'Game created!', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const joinGame = (req, res) => {
  try {
    const { player } = req.body;
    //const { gameId } = req.query;
    const gameObject = lib.joinGame(player);
    res.send({ message: `Player ${player.name} joined game`, gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

const startGame = (req, res) => {
  try {
    const { player } = req.body;
    const gameObject = lib.startGame(player);
    res.send({ message: 'Game started!', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  createGame,
  joinGame,
  startGame,
};