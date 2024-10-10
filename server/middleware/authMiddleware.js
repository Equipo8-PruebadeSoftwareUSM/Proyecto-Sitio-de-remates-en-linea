const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../config/config');
const logger = require('../logger');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('Authentication attempt without token');
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.userType !== 'ADMIN') {
    logger.warn(`Unauthorized admin access attempt by user: ${req.user?.userId}`);
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };