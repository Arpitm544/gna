const socketIO = require('socket.io');
const { getMessagesByRoomId, saveMessage } = require('../controllers/message.controller');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('User connected');

      socket.on('join-room', async (roomId) => {
        socket.join(roomId);
        try {
          const messages = await getMessagesByRoomId(roomId);
          socket.emit('message-history', messages);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      });

      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
      });

      socket.on('send-message', async (data) => {
        try {
          const saved = await saveMessage({
            roomId: data.roomId,
            user: data.user,
            message: data.message,
            timestamp: new Date(),
          });
          io.to(data.roomId).emit('receive-message', saved);
        } catch (err) {
          console.error('Error handling message:', err);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
  },
};