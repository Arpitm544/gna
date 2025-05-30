const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a project
router.get('/:projectId', async (req, res) => {
  try {
    if (!req.params.projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const comments = await Comment.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/', async (req, res) => {
  try {
    const { projectId, user, text } = req.body;
    
    if (!projectId || !user || !text) {
      return res.status(400).json({ error: 'Project ID, user, and text are required' });
    }

    const comment = new Comment({
      project: projectId,
      user,
      text: text.trim()
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Comment ID is required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router; 