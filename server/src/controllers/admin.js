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

const plantFromAnywhereInHand = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, handIndex, fieldIndex } = req.body;
    const gameObject = await lib.plantFromAnywhereInHand(gameId, playerName, handIndex, fieldIndex);
    res.send({ message: 'Card planted from hand', gameObject });
  } catch (error) {
    console.log(`plant from anywhere in hand: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const deleteFromPlantNow = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, plantNowIndex } = req.body;
    const gameObject = await lib.deleteFromPlantNow(gameId, playerName, plantNowIndex);
    res.send({ message: 'Card deleted from plant now', gameObject });
  } catch (error) {
    console.log(`delete from plant now: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const addCardToPlantNow = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, cardName } = req.body;
    const gameObject = await lib.addToPlantNow(gameId, playerName, cardName);
    res.send({ message: 'Card added from plant now', gameObject });
  } catch (error) {
    console.log(`add to plant now: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  deleteFromHand,
  addToHand,
  plantFromAnywhereInHand,
  deleteFromPlantNow,
  addCardToPlantNow,
};
