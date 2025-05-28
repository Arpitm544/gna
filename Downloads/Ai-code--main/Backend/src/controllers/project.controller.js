const Project = require('../models/Project');
const User = require('../models/User');

// Get all projects for a user
const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ user: userId }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectData = {
      ...req.body,
      user: userId
    };
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOneAndDelete({ _id: id, user: userId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

module.exports = {
  getUserProjects,
  createProject,
  updateProject,
  deleteProject
};