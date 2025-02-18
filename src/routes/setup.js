const router = require('express').Router();
const setup = require('../controllers/setup.js');

router.post('/', setup.createGame);

router.post('/join', setup.joinGame);

router.post('/start', setup.startGame);

module.exports = router;