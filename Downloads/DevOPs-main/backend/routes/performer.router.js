const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PerformerController = require('../controllers/performer.controller');

router.get('/me', auth, PerformerController.getOwnProfile);
router.post('/profile/:userId', auth, PerformerController.createProfile);
router.put('/profile', auth, PerformerController.updateProfile);

// General routes
router.get('/', PerformerController.getAllPerformers);
router.get('/category/:category', PerformerController.getPerformersByCategory);
router.get('/:id', PerformerController.getPerformerById);

module.exports = router;
