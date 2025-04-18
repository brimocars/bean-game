const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log(req.url);
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) {
    console.log('no token');
    return res.redirect('/login-page');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    console.log('invalid token');
    return res.redirect('/login-page');
  }
  req.user = decoded;
  return next();
};

module.exports = {
  auth,
};
