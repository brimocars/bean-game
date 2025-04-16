const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) {
    // return res.status(401).send({ message: 'No token provided' });
    console.log('redirect')
    return res.redirect('/login-page');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    // return res.status(401).send({ message: 'Invalid token' });
    return res.redirect('/login-page');
  }
  req.user = decoded;
  return next();
};

module.exports = {
  auth,
};
