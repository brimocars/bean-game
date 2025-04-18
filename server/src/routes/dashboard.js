const path = require('path');
const express = require('express');
const accounts = require('../controllers/accounts.js');
const { auth } = require('../middleware');

const router = express.Router();

const getIndex = (req, res) => {
  console.log('thing');
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
};

router.post('/login', accounts.login);
router.post('/signup', accounts.signup);
router.use('/login-page', express.static('dist/src/login'));
router.get('/', auth, getIndex);
router.use('/', express.static('dist'));

module.exports = router;
