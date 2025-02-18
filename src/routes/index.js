const express = require('express');
const router = express.Router();

const setup = require('./setup');
const play = require('./play');
const getGame = require('./getGame');

router.use('/setup', setup);
router.use('/play', play);
router.use('/game', getGame);

module.exports = router;