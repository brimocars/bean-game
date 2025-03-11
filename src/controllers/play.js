const lib = require('../model/play.js');

const plantFromHand = (req, res) => {
  try {
    const { fieldIndex } = req.body;
    const { gameId } = req.query;
    const { gameObject, planted } = lib.plantFromHand(gameId, fieldIndex);
    res.send({ message: `Field now has ${planted}`, gameObject });
  } catch (error) {
    console.log(`plant from hand: ${error}`);
    res.status(400).send({ message: error.message });
  }
};

const turn = (req, res) => {
  try {
    const { gameId } = req.query;
    const { gameObject, turnedCards } = lib.turn(gameId);
    res.send({ message: `Turned: ${turnedCards}`, gameObject });
  } catch (error) {
    console.log(`turn: ${error}`);
    res.status(400).send({ message: error.message });
  }
};

const offerTrade = (req, res) => {
  try {
    const { gameId } = req.query;
    const {
      trader, tradee, cardsToGive, cardsToReceive,
    } = req.body;
    const { gameObject, newTrade } = lib.offerTrade(gameId, trader, tradee, cardsToGive, cardsToReceive);
    res.send({ message: `Trade offered: ${newTrade}`, gameObject });
  } catch (error) {
    console.log(`offer trade: ${error}`);
    res.status(400).send({ message: error.message });
  }
};

const acceptTrade = (req, res) => {
  try {
    const { gameId } = req.query;
    const { tradeId, chosenCardsToReceive } = req.body;
    const gameObject = lib.acceptTrade(gameId, tradeId, chosenCardsToReceive);
    res.send({ message: 'Trade accepted', gameObject });
  } catch (error) {
    console.log(`trade accepted: ${error}`);

    res.status(400).send({ message: error.message });
  }
};

const endTradingPhase = (req, res) => {
  try {
    const { gameId } = req.query;
    const gameObject = lib.endTradingPhase(gameId);
    res.send({ message: 'Trading phase ended', gameObject });
  } catch (error) {
    console.log(`end trading phase: ${error}`);
    res.status(400).send({ message: error.message });
  }
};

const harvest = (req, res) => {
  try {
    const { gameId } = req.query;
    const { player, fieldIndex } = req.body;
    const { gameObject, money, card } = lib.harvest(gameId, player, fieldIndex);
    res.send({ message: `harvested ${card} in field ${fieldIndex} for ${money} money`, gameObject });
  } catch (error) {
    console.log(`harvest: ${error}`);
    res.status(400).send({ message: error.message });
  }
};

const plantFromPlantNow = (req, res) => {
  try {
    const { gameId } = req.query;
    const { playerName, cardName, fieldIndex } = req.body;
    const { gameObject, planted } = lib.plantFromPlantNow(gameId, playerName, cardName, fieldIndex);
    res.send({ message: `Field now has ${planted}`, gameObject });
  } catch (error) {
    console.log(`plant from hand: ${error}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  plantFromHand,
  turn,
  offerTrade,
  acceptTrade,
  endTradingPhase,
  harvest,
  plantFromPlantNow,
};
