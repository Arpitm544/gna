const mongoose = require('mongoose'); 

const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/practice"; 
mongoose.connect(mongoURL)
    .then(() => console.log("Connected to database."))
    .catch((err) => console.error("Database connection error:", err));

module.exports = mongoose;

