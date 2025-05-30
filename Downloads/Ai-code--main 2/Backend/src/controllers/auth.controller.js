const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const signup = async (req, res) => {
  try {
    console.log('Signup attempt: starting', { 
      username: req.body.username,
      email: req.body.email,
      hasPassword: !!req.body.password 
    });

    const { username, email, password } = req.body;
   

    // Input validation
    if (!username || !email || !password) {
      console.log('Signup validation failed: missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    console.log('Signup attempt: input validation passed');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Signup validation failed: invalid email format');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }
    console.log('Signup attempt: email format validation passed');

    // Password length validation
    if (password.length < 6) {
      console.log('Signup validation failed: password too short');
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
    console.log('Signup attempt: password length validation passed');


    // Check for existing user
    console.log('Checking for existing user:', { email, username });
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', { 
        email: existingUser.email === email,
        username: existingUser.username === username 
      });
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    console.log('Signup attempt: existing user check passed');

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    console.log('Signup attempt: JWT_SECRET check passed');

    // Create new user
    console.log('Creating new user:', { username, email });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Signup attempt: password hashed');
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });
    console.log('Signup attempt: user model created');

    try {
      await user.save();
      console.log('User saved successfully:', { username, email });
    } catch (saveError) {
      console.error('Error saving user:', {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        stack: saveError.stack
      });
      throw saveError;
    }
    console.log('Signup attempt: user saved to DB');

    // Generate token
    console.log('Generating token for new user:', { username, email });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Signup attempt: token generated');

    // Send response
    console.log('Signup successful: sending response', { username, email });
    res.status(201).json({ 
      success: true,
      token, 
      userId: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Signup error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      message: 'Error creating user', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login attempt: starting', { email: req.body.email });
    
    const { email, password } = req.body;
    console.log('Login attempt: extracted body');

    // Input validation
    if (!email || !password) {
      console.log('Login validation failed: missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    console.log('Login attempt: input validation passed');

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    console.log('Login attempt: JWT_SECRET check passed');

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB is not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({
        success: false,
        message: 'Database connection error'
      });
    }
    console.log('Login attempt: MongoDB connection check passed');

    // Find user
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    console.log('Login attempt: user found');

    // Verify password
    console.log('Verifying password for user:', email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    console.log('Login attempt: password verified');

    // Generate token
    console.log('Generating token for user:', email);
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Login attempt: token generated');

    // Send response
    console.log('Login successful: sending response for user:', email);
    res.json({ 
      success: true,
      token, 
      userId: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      message: 'Error logging in', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

const profile = async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user._id);
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.log('User not found:', req.user._id);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({ 
      success: true,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user profile', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('Update profile attempt:', { userId: req.user._id });
    
    const { username, currentPassword, newPassword } = req.body;

    // Validate that at least one field is being updated
    if (!username && !currentPassword && !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log('User not found:', req.user._id);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Only check username if it's being updated
    if (username && username !== user.username) {
      console.log('Checking username availability:', username);
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log('Username already taken:', username);
        return res.status(400).json({ 
          success: false,
          message: 'Username is already taken' 
        });
      }
      user.username = username;
    }

    // Only handle password update if both current and new passwords are provided
    if (currentPassword && newPassword) {
      console.log('Password change requested');
      
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log('Current password verification failed');
        return res.status(400).json({ 
          success: false,
          message: 'Current password is incorrect' 
        });
      }

      // Password length validation
      if (newPassword.length < 6) {
        console.log('New password too short:', newPassword.length);
        return res.status(400).json({ 
          success: false,
          message: 'Password must be at least 6 characters long' 
        });
      }

      // Hash new password
      console.log('Hashing new password');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    } else if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required to change password'
      });
    }
    
    await user.save();
    console.log('Profile updated successfully');

    res.json({ 
      success: true,
      username: user.username 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  signup,
  login,
  profile,
  updateProfile
};