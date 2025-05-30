const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings' 
    }],
});

module.exports = mongoose.model('Client', ClientSchema);
