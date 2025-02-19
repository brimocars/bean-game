const router = require('express').Router();
const play = require('../controllers/play.js');

router.post('/plantFromHand', play.plantFromHand);
router.post('/turn', play.turn);
router.post('/trade/offer', play.offerTrade);
router.post('/trade/accept', play.acceptTrade);

module.exports = router;