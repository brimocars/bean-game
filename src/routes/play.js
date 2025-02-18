const router = require('express').Router();
const play = require('../controllers/play.js');

router.post('/plant', play.plant);

module.exports = router;