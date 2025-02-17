const jwt = require('jsonwebtoken');

const attachUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(); //if there is no token attachUser will not attach any user to the request object
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded; // decoded contains the payload of the JWT
    }
    next();
  });
};

module.exports = attachUser;
