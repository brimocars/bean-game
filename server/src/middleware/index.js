const requiresLogin = (req, res, next) => {
  if (!req.session?.account) {
    return res.redirect('/login-page');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session?.account) {
    return res.redirect('/');
  }
  return next();
};

module.exports = {
  requiresLogin,
  requiresLogout,
};
