const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserController = require('../controllers/user.controller');
const { userValidationRules, userUpdateValidationRules, validate } = require('../middleware/validators');

router.post('/signup', userValidationRules(), validate, UserController.signup);
router.post('/login', UserController.login); // Changed from signin to login
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, userUpdateValidationRules(), validate, UserController.updateProfile);

module.exports = router;
