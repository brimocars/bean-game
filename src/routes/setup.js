const router = require('express').Router();
const setup = require('../controllers/setup.js');

router.post('/', setup.createGame);
router.delete('/', setup.deleteGame);
router.post('/join', setup.joinGame);
router.delete('/leave', setup.leaveGame);
router.post('/start', setup.startGame);

module.exports = router;
