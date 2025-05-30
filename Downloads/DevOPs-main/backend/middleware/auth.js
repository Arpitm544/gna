const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
    
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        
        // Find user and add to request
        const user = await User.findById(decoded.userId || decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid - user not found' });
        }

        console.log('Found user:', { id: user._id, type: user.type }); // Debug log

        req.user = {
            userId: user._id,
            type: user.type,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token format' });
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;