import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/api/bookmarks');
      setBookmarks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (project) => {
    try {
      await axiosInstance.post('/api/bookmarks', { projectId: project._id });
      // Refresh bookmarks after adding
      await fetchBookmarks();
    } catch (err) {
      console.error('Error adding bookmark:', err);
      throw err;
    }
  };

  const removeBookmark = async (projectId) => {
    try {
      await axiosInstance.delete(`/api/bookmarks/${projectId}`);
      // Refresh bookmarks after removing
      await fetchBookmarks();
    } catch (err) {
      console.error('Error removing bookmark:', err);
      throw err;
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, loading, error, addBookmark, removeBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext); 