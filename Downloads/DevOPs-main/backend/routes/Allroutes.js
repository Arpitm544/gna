const paymentRouter = require('./Payment.router');
const userRouter = require('./user.router');
const express = require('express');

const allrouter = express.Router();

allrouter.use('/payment', paymentRouter);
allrouter.use('/user', userRouter);

module.exports = allrouter;