const booking = require("../db/models/booking");
const Booking = require("../db/models/booking");
const users=require('../db/models/user')
const { Performer } = require("../db/models/performer");


const createBooking = async (req, res) => {
    try {
        const { performerId, date, time, location } = req.body;
        const clientId = req.user.userId;

        const newBooking = new Booking({
            performerId,
            clientId,
            date,
            time, 
            location
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error: error.message });
    }
};



const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("performerId", "name email")
            .populate("clientId", "name email");

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};


const getBookingById = async (req, res) => {
    try {
        const bookings = await Booking.find({ performerId: req.params.id }) 
            .populate("performerId", "name email")
            .sort({ createdAt: -1 });
        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this performer" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving booking", error: error.message });
    }
};


const updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, paymentStatus },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking updated", booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking", error: error.message });
    }
};


const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error: error.message });
    }
};



const getClientBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ clientId: req.params.id })
            .sort({ createdAt: -1 });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this client" });
        }

        // Add performerName while keeping original structure
        const bookingsWithName = await Promise.all(bookings.map(async (booking) => {
            const bookingObj = booking.toObject();
            let performerName = 'Unknown Performer';
            
            if (bookingObj.performerId) {
                const user = await users.findOne({ _id: bookingObj.performerId });
                if (user) {
                    performerName = user.name;
                }
            }

            return {
                ...bookingObj,
                performerName
            };
        }));

        res.status(200).json(bookingsWithName);
    } catch (error) {
        console.error("Error in getClientBookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

const getPerformerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ performerId: req.user.userId })
            .populate('clientId', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const bookingId = req.params.id;

        console.log("Booking ID:", bookingId);
        console.log("Incoming paymentStatus:", paymentStatus);

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.paymentStatus = paymentStatus || "Paid";
        await booking.save();

        res.json({ message: "Payment status updated", booking });
    } catch (error) {
        console.error("Payment update error:", error);
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};



const detailsByID = async (req, res) => {
    try {
        const bookingDetails = await booking.findById(req.params.id);
        if (!bookingDetails) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const performerDetails = await Performer.findOne({ userId: bookingDetails.performerId })
            .populate("userId", "name email"); 

        if (!performerDetails) {
            return res.status(404).json({ message: "Performer not found" });
        }

        return res.status(200).json({
            price: performerDetails.pricing,
            performers: performerDetails.userId, // returns populated user object with name & email
            booking:bookingDetails
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    getClientBookings,
    getPerformerBookings,
    updatePaymentStatus,
    detailsByID
};
