import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const GitHubPush = ({ code, projectName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');

  const handlePushToGitHub = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'Please log in to push to GitHub.' });
      return;
    }

    // Basic URL validation - ensure it looks like a GitHub URL
    if (!repoUrl || !repoUrl.includes('github.com')) {
      setMessage({ type: 'error', text: 'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)' });
      return;
    }

    setIsLoading(true);
    setMessage(null); // Clear previous messages

    try {
      // Make the API call to the backend
      const response = await axios.post(
        `${config.API_URL}/api/github/push`,
        {
          code,
          projectName,
          repoUrl,
          branch
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Handle successful push
      if (response.status === 200) {
        setMessage({ type: 'success', text: `Code successfully pushed to ${response.data.url || repoUrl}` });
      } else {
        // This part should ideally not be reached if backend sends appropriate status codes,
        // but as a fallback, handle non-200 statuses.
        setMessage({ type: 'error', text: response.data.message || 'An unexpected error occurred.' });
      }

    } catch (error) {
      console.error('GitHub push error:', error);
      // Handle errors from the backend
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred during push.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="github-push-container">
      <h3>Push to GitHub</h3>
      <div className="github-form">
        <input
          type="text"
          placeholder="GitHub Repository URL (e.g., https://github.com/username/repo)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="github-input"
        />
        <input
          type="text"
          placeholder="Branch name (default: main)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="github-input"
        />
        <button
          onClick={handlePushToGitHub}
          disabled={isLoading}
          className="github-push-button"
        >
          {isLoading ? 'Pushing...' : 'Push to GitHub'}
        </button>
      </div>
      {message && (
        <div className={`github-message ${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default GitHubPush; 