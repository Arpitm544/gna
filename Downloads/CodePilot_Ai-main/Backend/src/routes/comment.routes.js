const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a project
router.get('/:projectId', async (req, res) => {
  const comments = await Comment.find({ project: req.params.projectId }).sort({ createdAt: 1 });
  res.json(comments);
});

// Add a comment
router.post('/', async (req, res) => {
  const { projectId, user, text } = req.body;
  const comment = new Comment({ project: projectId, user, text });
  await comment.save();
  res.json(comment);
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 