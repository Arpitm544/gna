const express = require('express');
const router = express.Router();
const { pushToGitHub } = require('../controllers/github.controller');
const auth = require('../middleware/auth');

router.post('/push', auth, pushToGitHub);

module.exports = router; 