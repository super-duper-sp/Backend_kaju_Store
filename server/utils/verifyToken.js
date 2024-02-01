const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

module.exports= verifyToken;