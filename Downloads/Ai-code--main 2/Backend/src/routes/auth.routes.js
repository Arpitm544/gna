const express = require('express');
const router = express.Router();
const { signup, login, profile, updateProfile } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user/profile', auth, profile);
router.put('/user/updateProfile', auth, updateProfile);

module.exports = router; 