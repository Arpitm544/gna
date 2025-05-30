const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { bookingValidationRules, validate } = require('../middleware/validators');
const BookingController = require('../controllers/booking.controller');

router.post('/', auth, bookingValidationRules(), validate, BookingController.createBooking);
router.get('/client', auth, BookingController.getClientBookings);
router.get('/performer', auth, BookingController.getPerformerBookings);
router.put('/:id/status', auth, BookingController.updateBookingStatus);
router.get('/:id', auth, BookingController.getBookingById);
router.put('/:id/payment', auth, BookingController.updatePaymentStatus);
router.get('/by-client/:id', BookingController.getClientBookings);
router.get('/price/:id',BookingController.detailsByID)

module.exports = router;
