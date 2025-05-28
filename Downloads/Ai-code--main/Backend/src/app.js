const express = require('express');
const http = require('http');
const socketIO = require('./socket/socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socketIO.init(server);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

module.exports = { app, server };