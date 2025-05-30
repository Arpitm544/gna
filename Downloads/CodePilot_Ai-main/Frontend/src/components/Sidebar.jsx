import React from 'react';
import { FaClock, FaBookmark } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-main">Code</span><span className="logo-accent">Pilot</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard"><FaClock /> My Code Reviews</Link>
          </li>
          <li className={location.pathname === '/bookmarks' ? 'active' : ''}>
            <Link to="/bookmarks"><FaBookmark /> Bookmarks</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
