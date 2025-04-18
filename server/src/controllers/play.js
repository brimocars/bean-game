const lib = require('../lib/play.js');

const plantFromHand = async (req, res) => {
  try {
    const { fieldIndex } = req.body;
    const { gameId } = req.query;
    const { gameObject, planted } = await lib.plantFromHand(gameId, fieldIndex);
    res.send({ message: `Field now has ${planted}`, gameObject });
  } catch (error) {
    console.log(`plant from hand: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const turn = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { gameObject, turnedCards } = await lib.turn(gameId);
    res.send({ message: `Turned: ${turnedCards}`, gameObject });
  } catch (error) {
    console.log(`turn: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const offerTrade = async (req, res) => {
  try {
    const { gameId } = req.query;
    const {
      trader, tradee, cardsToGive, cardsToReceive,
    } = req.body;
    const { gameObject, newTrade } = await lib.offerTrade(gameId, trader, tradee, cardsToGive, cardsToReceive);
    res.send({ message: `Trade offered: ${newTrade}`, gameObject });
  } catch (error) {
    console.log(`offer trade: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const acceptTrade = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { tradeId, chosenCardsToReceive } = req.body;
    const gameObject = await lib.acceptTrade(gameId, tradeId, chosenCardsToReceive);
    res.send({ message: 'Trade accepted', gameObject });
  } catch (error) {
    console.log(`trade accepted: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const denyTrade = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { tradeId } = req.body;
    const gameObject = await lib.denyTrade(gameId, tradeId);
    res.send({ message: 'Trade denied and deleted', gameObject });
  } catch (error) {
    console.log(`trade denied: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const endTradingPhase = async (req, res) => {
  try {
    const { gameId } = req.query;
    const gameObject = await lib.endTradingPhase(gameId);
    res.send({ message: 'Trading phase ended', gameObject });
  } catch (error) {
    console.log(`end trading phase: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const harvest = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, fieldIndex } = req.body;
    const { gameObject, money, card } = await lib.harvest(gameId, playerName, fieldIndex);
    res.send({ message: `harvested ${card} in field ${fieldIndex} for ${money} money`, gameObject });
  } catch (error) {
    console.log(`harvest: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const plantFromPlantNow = async (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, cardName, fieldIndex } = req.body;
    const { gameObject, planted } = await lib.plantFromPlantNow(gameId, playerName, cardName, fieldIndex);
    res.send({ message: `Field now has ${planted}`, gameObject });
  } catch (error) {
    console.log(`plaasync nt from hand: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  plantFromHand,
  turn,
  offerTrade,
  acceptTrade,
  denyTrade,
  endTradingPhase,
  harvest,
  plantFromPlantNow,
};
