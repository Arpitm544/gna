const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment=require('../../db/models/Payment')
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in rupees

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
  }
};

// Optional: verify payment
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount } = req.body;

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (sign === razorpay_signature) {
    const newPayment=new Payment({
      orderId:razorpay_order_id,
      paymentId:razorpay_payment_id,
      signature:razorpay_signature,
      amount:amount,
      createdAt:new Date(),
      status:"Paid"

    })
    await newPayment.save();
    res.status(200).json({ message: "Payment verified" });
  } else {
    const newPayment=new Payment({
      orderId:razorpay_order_id,
      paymentId:razorpay_payment_id,
      signature:razorpay_signature,
      amount:amount,
      createdAt:new Date(),
      status:Failed
    })
    await newPayment.save();
    res.status(400).json({ message: "Invalid signature" });
  }
};

module.exports = { createOrder, verifyPayment };
