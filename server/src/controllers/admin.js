const lib = require('../lib/admin.js');

const deleteFromHand = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, handIndex } = req.body;
    const gameObject = await lib.deleteFromHand(gameId, playerName, handIndex);
    res.send({ message: 'Card deleted from hand', gameObject });
  } catch (error) {
    console.log(`delete from hand: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const addToHand = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, cardName } = req.body;
    const gameObject = await lib.addToHand(gameId, playerName, cardName);
    res.send({ message: 'Card added to hand', gameObject });
  } catch (error) {
    console.log(`add to hand: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  deleteFromHand,
  addToHand,
};
