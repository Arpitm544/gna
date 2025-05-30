const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, getUserBookmarks } = require('../controllers/bookmark.controller');
const auth = require('../middleware/auth');

// Debug middleware
router.use((req, res, next) => {
  console.log('Bookmark route accessed:', req.method, req.path);
  next();
});

// All routes require authentication
router.use(auth);

// Get user's bookmarks
router.get('/', getUserBookmarks);

// Add a bookmark
router.post('/', addBookmark);

// Remove a bookmark
router.delete('/:projectId', removeBookmark);

module.exports = router; 