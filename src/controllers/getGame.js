const model = require('../model/getGame');

const getGame = (req, res) => {
  try {
    const { gameId } = req.query;
    const gameObject = model.getGame(gameId);
    res.send({ message: 'Game found', gameObject });
  } catch (error) {
    console.log(`get game: ${error.stack}`);
    res.status(404).send({ message: error.message });
  }
};

module.exports = {
  getGame,
};
