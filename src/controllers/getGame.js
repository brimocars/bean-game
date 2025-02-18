const lib = require('../lib/getGame');

const getGame = (req, res) => {
  try {
    //const { gameId } = req.query;
    const gameObject = lib.getGame();
    res.send({ message: 'Game found', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

module.exports = {
  getGame,
};