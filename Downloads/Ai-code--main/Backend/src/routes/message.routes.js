const express = require('express');
const { getMessages } = require('../controllers/message.controller');
const router = express.Router();

router.get('/:roomId', getMessages);

module.exports = router; 