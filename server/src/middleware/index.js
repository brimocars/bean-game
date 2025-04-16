const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).send({ message: 'Invalid token' });
  }
  req.user = decoded;
  return next();
};

module.exports = {
  auth,
};
