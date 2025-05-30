const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/Payment/paymentcontroller');
const router = express.Router();

// Create a new Razorpay order
router.post('/createOrder', createOrder);
// Verify Razorpay payment
router.post('/verifyPayment', verifyPayment);

module.exports = router;