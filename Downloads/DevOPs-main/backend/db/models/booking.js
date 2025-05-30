const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    performerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "performers", 
        required: true 
    },
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Client", 
        required: true 
    },
    date: {
        type: Date,
        required: true
    },
    time: { 
        type: String, 
        required: true 
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined', 'Confirmed'],
        default: 'Pending'
    },
    paymentStatus: {
    type: String,
    enum: ['Not Initiated', 'Pending', 'Paid', 'Failed'],
    default: 'Not Initiated'
    }
}, { timestamps: true });

module.exports = mongoose.model("bookings", BookingSchema);
