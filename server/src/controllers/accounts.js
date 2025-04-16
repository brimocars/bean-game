const lib = require('../lib/accounts');

const signup = async (req, res) => {
  try {
    const { username, password, accessCode } = req.body;
    await lib.signup(username, password, accessCode);
    res.status(201).send({ message: 'Account created' });
  } catch (error) {
    console.log(`signup: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await lib.login(username, password);
    res.send({ message: 'Logged in', token });
  } catch (error) {
    console.log(`login: ${error.stack}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
};
