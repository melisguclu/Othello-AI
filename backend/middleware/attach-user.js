const jwt = require('jsonwebtoken');
const User = require('../models/user');

const attachUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};

module.exports = attachUser;
