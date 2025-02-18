const router = require('express').Router();
const getGame = require('../controllers/getGame.js');

router.get('/', getGame.getGame);

module.exports = router;