import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import config from '../config';
import './Chat.css';

const Chat = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem('username') || 'Anonymous';

  useEffect(() => {
    const newSocket = io(config.SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.emit('join-room', projectId);

    newSocket.on('message-history', (history) => {
      setMessages(history);
    });

    newSocket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    newSocket.on('error', (error) => {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      newSocket.emit('leave-room', projectId);
      newSocket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      roomId: projectId,
      user: username,
      message: message.trim()
    };

    socket.emit('send-message', messageData);
    setMessage('');
  };

  const getUserDisplayName = (user) => {
    if (typeof user === 'string') return user;
    if (user && user.username) return user.username;
    return 'Anonymous';
  };

  return (
    <div className="chat-container">
      {error && <div className="error-message">{error}</div>}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={msg._id || index} className={`message ${getUserDisplayName(msg.user) === username ? 'own-message' : ''}`}>
            <div className="message-header">
              <span className="message-user">{getUserDisplayName(msg.user)}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat; 