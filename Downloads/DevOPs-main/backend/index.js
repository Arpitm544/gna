const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


require("dotenv").config();

// Import database connection
require('./db/connection');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./routes/user.router');
const performerRoutes = require('./routes/performer.router');
const bookingRoutes = require('./routes/booking.router');
const clientRoutes = require('./routes/client.router');
const paymentRouter=require('./routes/Payment.router')


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/performers', performerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/payment', paymentRouter);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`<html>
    <head>
        <title>404</title>
    </head>
    <body>
        <h1>PAGE NOT FOUND</h1>
    </body>
</html>`);
});

// After all route definitions
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const PORT = process.env.PORT || 8003;


app.listen(PORT, (err) => {
    if (err)
        console.log("err", err);
    console.log(`Server listening on ${PORT}`);

});

module.exports = app;
