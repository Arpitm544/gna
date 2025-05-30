import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const CommentSection = ({ projectId, username }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${config.API_URL}/api/comments/${projectId}`);
        setComments(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.response?.data?.error || 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId]);

  const handleAdd = async () => {
    if (!text.trim() || !projectId) return;
    setLoading(true);
    try {
      const res = await axios.post(`${config.API_URL}/api/comments`, {
        projectId,
        user: username,
        text: text.trim()
      });
      setComments([res.data, ...comments]);
      setText('');
      setError(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${config.API_URL}/api/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err.response?.data?.error || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) return null;

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      <div>
        {comments.map((c, index) => (
          <div key={c._id || `comment-${index}`} className="comment">
            <b>{c.user}</b> <span>({new Date(c.createdAt).toLocaleString()})</span>
            <p>{c.text}</p>
            {c.user === username && (
              <button 
                onClick={() => handleDelete(c._id)}
                disabled={loading}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a comment..."
        disabled={loading}
      />
      <button 
        onClick={handleAdd}
        disabled={loading || !text.trim()}
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentSection;
