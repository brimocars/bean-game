const path = require('path');
const express = require('express');
const accounts = require('../controllers/accounts.js');
const { requiresLogin, requiresLogout } = require('../middleware');

const router = express.Router();

const getIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
};

router.post('/login', accounts.login);
router.post('/signup', accounts.signup);
router.post('/changePassword', accounts.changePassword);
router.get('/logout', requiresLogin, accounts.logout);

router.use('/login-page', requiresLogout, express.static('dist/src/login'));
router.get('/', requiresLogin, getIndex);
router.use('/', express.static('dist'));

module.exports = router;
