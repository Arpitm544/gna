import React, { useState, useEffect } from 'react';
import { FaUser, FaKey } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(prev => ({
          ...prev,
          username: response.data.username
        }));
      } catch (error) {
        setMessage({
          text: 'Failed to fetch user data',
          type: 'error'
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validate passwords match if changing password
    if (user.newPassword && user.newPassword !== user.confirmPassword) {
      setMessage({
        text: 'New passwords do not match',
        type: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/user/updateProfile',
        {
          username: user.username,
          currentPassword: user.currentPassword,
          newPassword: user.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({
        text: 'Profile updated successfully',
        type: 'success'
      });

      // Clear password fields
      setUser(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Update localStorage username if changed
      if (response.data.username !== localStorage.getItem('username')) {
        localStorage.setItem('username', response.data.username);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile Settings</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaUser /> Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>

          <h2>Change Password</h2>
          <div className="form-group">
            <label>
              <FaKey /> Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={user.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password to change"
            />
          </div>

          <div className="form-group">
            <label>
              <FaKey /> New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={user.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>
              <FaKey /> Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>

          <button 
            type="submit" 
            className="update-button"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 