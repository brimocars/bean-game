const express = require('express');
const { requiresLogin } = require('../middleware');

const router = express.Router();
const setup = require('./setup');
const play = require('./play');
const getGame = require('./getGame');
const dashboard = require('./dashboard');
const admin = require('./admin');

router.use('/setup', setup);
router.use('/play', play);
router.use('/game', getGame);
router.use('/', dashboard);
router.use('/admin', requiresLogin, admin);

module.exports = router;
