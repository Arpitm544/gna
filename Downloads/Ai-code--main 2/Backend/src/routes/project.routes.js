const express = require('express');
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all projects for the authenticated user
router.get('/', projectController.getUserProjects);

// Create a new project
router.post('/', projectController.createProject);

// Update a project
router.put('/:id', projectController.updateProject);

// Delete a project
router.delete('/:id', projectController.deleteProject);

module.exports = router; 