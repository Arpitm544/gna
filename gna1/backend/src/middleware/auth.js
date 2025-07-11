const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user) return res.status(401).json({ message: 'User not found or inactive' });

    req.user = user;
    req.token = token;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { auth, checkRole };