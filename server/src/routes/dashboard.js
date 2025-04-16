const express = require('express');
const accounts = require('../controllers/accounts.js');
const { auth } = require('../middleware');

const router = express.Router();

router.post('/login', accounts.login);
router.post('/signup', accounts.signup);
router.use('/', auth, express.static('dist'));
router.use('/login-page', express.static('dist/login-page'));

module.exports = router;
