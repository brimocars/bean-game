const router = require('express').Router();
const play = require('../controllers/play.js');

router.post('/plantFromHand', play.plantFromHand);
router.post('/turn', play.turn);
router.post('/trade/offer', play.offerTrade);
router.post('/trade/accept', play.acceptTrade);
router.post('/trade/end', play.endTradingPhase);
router.post('/harvest', play.harvest);
router.post('/plantFromPlantNow', play.plantFromPlantNow);

module.exports = router;