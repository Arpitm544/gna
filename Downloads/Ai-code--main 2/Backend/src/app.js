require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const githubRoutes = require('./routes/github.routes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Test endpoint to check GitHub token
app.get('/test-token', (req, res) => {
  if (process.env.GITHUB_TOKEN) {
    res.json({ 
      status: 'success', 
      message: 'GitHub token is configured',
      tokenLength: process.env.GITHUB_TOKEN.length 
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'GitHub token is not configured' 
    });
  }
});

// GitHub routes
app.use('/api/github', githubRoutes);

module.exports = { app, server };