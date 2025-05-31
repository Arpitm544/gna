const Bookmark = require('../models/Bookmark');
const Project = require('../models/Project');

// Add a bookmark
const addBookmark = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user._id;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create bookmark
    const bookmark = new Bookmark({
      user: userId,
      project: projectId
    });

    await bookmark.save();
    
    // Populate project details
    await bookmark.populate('project');
    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Project is already bookmarked' });
    }
    res.status(500).json({ message: 'Error adding bookmark', error: error.message });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const bookmark = await Bookmark.findOneAndDelete({
      user: userId,
      project: projectId
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing bookmark', error: error.message });
  }
};

// Get user's bookmarks
const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const bookmarks = await Bookmark.find({ user: userId })
      .populate('project')
      .sort({ createdAt: -1 });

    res.json(bookmarks.map(b => b.project));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks', error: error.message });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getUserBookmarks
}; 