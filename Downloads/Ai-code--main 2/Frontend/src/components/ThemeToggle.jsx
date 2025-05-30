import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-switch-container" onClick={toggleTheme}>
      <div className={`theme-switch ${isDarkMode ? 'dark' : 'light'}`}>
        <span className="slider"></span>
      </div>
      <span className="light-icon">☀️</span>
      <span className="dark-icon">🌙</span>
    </div>
  );
};

export default ThemeToggle; 