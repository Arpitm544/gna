const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // console.log('Auth middleware - No token found');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // console.log('Auth middleware - Token found, verifying...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      // console.log('Auth middleware - User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    // console.log('Auth middleware - User authenticated:', user.username);
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error.message);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = auth; 