import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import CommentSection from './CommentSection';
import axios from 'axios';
import config from '../config';

const getBadgeColor = (score) => {
  if (score >= 80) return 'green';
  if (score >= 70) return 'gold';
  return 'orange';
};

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const isBookmarked = bookmarks.some(b => b._id === project._id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenEditor = () => {
    navigate('/code-review', { state: { project } });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.delete(`${config.API_URL}/api/projects/${project._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from bookmarks if bookmarked
      if (isBookmarked) {
        removeBookmark(project._id);
      }
      
      onDelete(project._id);
    } catch (err) {
      console.error('Error deleting project:', err);
      if (err.message === 'Authentication required') {
        setError('Please log in to delete projects');
      } else {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <span className="project-title">{project.name}</span>
        <span className="project-lang">{project.language}</span>
      </div>
      <div className="project-meta">
        <span className={`health-badge ${getBadgeColor(project.healthScore)}`}>{project.healthScore}</span>
        <span className="project-updated">Updated {project.updated}</span>
      </div>
      <div className="project-actions">
        <button 
          className="open-editor-btn" 
          onClick={handleOpenEditor}
          disabled={isDeleting}
        >
          Open Editor
        </button>
        <button
          className="bookmark-btn"
          onClick={() => isBookmarked ? removeBookmark(project._id) : addBookmark(project)}
          disabled={isDeleting}
          style={{ marginTop: '0.5rem' }}
        >
          {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        </button>
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ 
            marginTop: '0.5rem',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            opacity: isDeleting ? 0.7 : 1
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Project'}
        </button>
      </div>
      {error && (
        <div 
          className="error-message" 
          style={{ 
            color: '#ff4444', 
            marginTop: '0.5rem',
            padding: '8px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}
        >
          {error}
        </div>
      )}
      <CommentSection projectId={project._id} username={localStorage.getItem('username') || 'User'} />
    </div>
  );
};

export default ProjectCard;