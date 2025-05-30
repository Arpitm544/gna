const User = require('../db/models/user');

// Performer Role Check Middleware
const isPerformer = (req, res, next) => {
    if (req.user.type !== 1) {
        return res.status(403).json({ message: 'Access denied. Performers only.' });
    }
    next();
};

const isClient = (req, res, next) => {
    if (req.user.type !== 0) {
        return res.status(403).json({ message: 'Access denied. Clients only.' });
    }
    next();
};

module.exports = {
    isPerformer,
    isClient
};
