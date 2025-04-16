const express = require('express');

const router = express.Router();
const setup = require('./setup');
const play = require('./play');
const getGame = require('./getGame');
const dashboard = require('./dashboard');

router.use('/setup', setup);
router.use('/play', play);
router.use('/game', getGame);
router.use('/', dashboard);

module.exports = router;
