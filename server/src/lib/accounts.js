const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AccountModel = require('../db/accounts');

const signup = async (username, password, accessCode) => {
  if (!username || !password || !accessCode) {
    throw new Error('Username, password, and accessCode are required');
  }
  if (accessCode !== process.env.ACCESS_CODE) {
    throw new Error('Invalid access code');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await AccountModel.create({ username, password: hashedPassword });
};

const login = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username, password, and accessCode are required');
  }
  const hashedPassword = await AccountModel.findOne({ username }, 'password').lean().exec();
  const match = await bcrypt.compare(password, hashedPassword.password);
  if (!match) {
    throw new Error('Incorrect login information');
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

module.exports = {
  signup,
  login,
};
