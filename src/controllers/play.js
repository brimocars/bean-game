const lib = require('../lib/play.js');

const plantFromHand = (req, res) => {
  try {
    const { player, fieldIndex } = req.body;
    const gameObject = lib.plantFromHand(player, fieldIndex);
    res.send({ message: 'Planted', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

const turn = (req, res) => {
  try {
    const gameObject = lib.turn();
    res.send({ message: 'Turned over', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

const offerTrade = (req, res) => {
  try {
    const { trader, tradee, cardsToGive, cardsToReceive } = req.body;
    const gameObject = lib.offerTrade(trader, tradee, cardsToGive, cardsToReceive);
    res.send({ message: 'Trade offered', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

const acceptTrade = (req, res) => {
  try {
    const { tradeId, chosenCardsToReceive } = req.body;
    const gameObject = lib.acceptTrade(tradeId, chosenCardsToReceive);
    res.send({ message: 'Trade offered', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

module.exports = {
  plantFromHand,
  turn,
  offerTrade,
  acceptTrade,
};