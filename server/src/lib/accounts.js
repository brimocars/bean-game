const bcrypt = require('bcrypt');
const AccountModel = require('../db/accounts');

const signup = async (username, password, accessCode) => {
  if (!username || !password || !accessCode) {
    throw new Error('Username, password, and accessCode are required');
  }
  if (accessCode !== process.env.ACCESS_CODE) {
    throw new Error('Invalid access code');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = { username, password: hashedPassword };
    await AccountModel.create(newAccount);
    return AccountModel.toAPI(newAccount);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return {
        status: 400,
        error: 'Username already in use!',
      };
    }
    return {
      status: 500,
      error: 'An error occurred!',
    };
  }
};

const login = async (username, password) => {
  if (!username || !password) {
    return {
      status: 400,
      error: 'Username and password are required',
    };
  }
  const account = await AccountModel.findOne({ username }).lean().exec();
  const match = await bcrypt.compare(password, account.password);
  if (!match) {
    return {
      status: 401,
      error: 'Incorrect login information',
    };
  }

  return AccountModel.toAPI(account);
};

const changePassword = async (username, oldPassword, newPassword) => {
  if (!username || !oldPassword || !newPassword) {
    return {
      status: 400,
      error: 'Username, old password, and new password are required',
    };
  }
  const account = await AccountModel.findOne({ username }).lean().exec();
  const match = await bcrypt.compare(oldPassword, account.password);
  if (!match) {
    return {
      status: 401,
      error: 'Incorrect login information',
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await AccountModel.updateOne({ username }, { password: hashedPassword });

  return AccountModel.toAPI(account);
};

module.exports = {
  signup,
  login,
  changePassword,
};
