import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaUserCircle, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ search, setSearch, onNewProject }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="topbar">
      <div className="topbar-left"></div>
      <div className="topbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="new-project-btn" onClick={onNewProject}>
          <FaPlus /> New Project
        </button>
        <div className="user-profile" ref={dropdownRef}>
          <span className="user-greeting" style={{ marginLeft: '1.5rem' }}>Hi, {username}</span>
          <FaUserCircle 
            className="user-avatar" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer' }}
          />
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={handleUpdateProfile}>
                <FaUserEdit /> Update Profile
              </button>
              <button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;