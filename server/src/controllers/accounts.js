const lib = require('../lib/accounts');

const logout = (req, res) => {
  console.log('logout');
  req.session.destroy();
  return res.json({ redirect: '/' });
};

const signup = async (req, res) => {
  try {
    const { username, password, accessCode } = req.body;
    const response = await lib.signup(username, password, accessCode);
    if (response.error) {
      return res.status(response.status).send({ message: response.error });
    }
    req.session.account = response;
    return res.json({ redirect: '/' });
  } catch (error) {
    console.log(`signup: ${error.stack}`);
    return res.status(400).send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await lib.login(username, password);
    if (response.error) {
      return res.status(response.status).send({ message: response.error });
    }
    req.session.account = response;
    return res.json({ redirect: '/' });
  } catch (error) {
    console.log(`login: ${error.stack}`);
    return res.status(400).send({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const response = await lib.changePassword(username, oldPassword, newPassword);
    if (response.error) {
      return res.status(response.status).send({ message: response.error });
    }
    req.session.account = response;
    return res.json({ redirect: '/' });
  } catch (error) {
    console.log(`changePassword: ${error.stack}`);
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  changePassword,
};
