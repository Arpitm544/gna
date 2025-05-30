const express = require('express');
const router = express.Router();
const { signup, login, profile } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user/profile', auth, profile);

module.exports = router; 