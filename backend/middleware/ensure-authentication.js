const jwt = require('jsonwebtoken');

const ensureAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = ensureAuth;