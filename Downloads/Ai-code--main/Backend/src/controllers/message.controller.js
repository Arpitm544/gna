const Message = require('../models/Message');
const User = require('../models/User');

// Get messages for a specific room
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .populate('user', 'username')
      .sort({ timestamp: 1 })
      .limit(100); // Limit to last 100 messages
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Save a new message
const saveMessage = async (messageData) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: messageData.user });
    if (!user) {
      throw new Error('User not found');
    }

    const message = new Message({
      roomId: messageData.roomId,
      user: user._id,
      username: messageData.user,
      message: messageData.message,
      timestamp: new Date()
    });

    await message.save();
    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Get messages by roomId directly (no req/res), for WebSocket usage
const getMessagesByRoomId = async (roomId) => {
  try {
    const messages = await Message.find({ roomId })
      .populate('user', 'username')
      .sort({ timestamp: 1 })
      .limit(100);
    return messages;
  } catch (error) {
    console.error('Error fetching messages by roomId:', error);
    throw error;
  }
};

module.exports = {
  getMessages,
  saveMessage,
  getMessagesByRoomId
};