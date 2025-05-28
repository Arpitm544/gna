require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Server class from socket.io
const { saveMessage, getMessagesByRoomId } = require('./src/controllers/message.controller'); // Import message controller functions

const app = express();
const server = http.createServer(app); // Create HTTP server from Express app
const io = new Server(server, { // Initialize Socket.IO server
  cors: { // Configure Socket.IO CORS separately
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// CORS configuration for Express
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true, // Ensure credentials is true for session/cookie based auth if used
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// Welcome message route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Backend API is successfully deployed and running!',
    status: 'active'
  });
});

// Routes
app.use('/ai', require('./src/routes/ai.routes'));
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/projects', require('./src/routes/project.routes'));
app.use('/api/comments', require('./src/routes/comment.routes'));
app.use('/api/messages', require('./src/routes/message.routes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room (project chat)
  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    try {
      const messages = await getMessagesByRoomId(roomId);
      socket.emit('message-history', messages);
    } catch (error) {
      console.error(`Error fetching message history for room ${roomId}:`, error);
      // Optionally emit an error event to the client
    }
  });

  // Handle new messages
  socket.on('send-message', async (messageData) => {
    console.log(`Message received in room ${messageData.roomId}: ${messageData.message}`);
    try {
      const savedMessage = await saveMessage(messageData);
      // Emit the message to all clients in the room
      io.to(messageData.roomId).emit('receive-message', savedMessage);
    } catch (error) {
      console.error(`Error saving or sending message for room ${messageData.roomId}:`, error);
      // Optionally emit an error event back to the client
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // No need to leave rooms explicitly, socket.io handles this on disconnect
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({ 
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB with improved error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // Log URI without credentials
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    // Don't exit the process in production
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
};

// Initialize database connection
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack
  });
  // Don't exit the process in production
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Start the server (now using the http server)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the HTTP server for Vercel (if needed)
module.exports = server;