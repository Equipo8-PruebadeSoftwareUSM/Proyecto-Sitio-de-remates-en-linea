const express = require('express');
const { createUser, login, UserType } = require('../services/userService');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();
const logger = require('../logger');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Only admins can create admin accounts
    if (userType === UserType.ADMIN) {
      return res.status(403).json({ message: 'Cannot create admin account through regular registration' });
    }

    const user = await createUser({ email, password, userType: UserType.USER });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    logger.error('Registration error', { error });
    if (error.message === 'Email already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { token, user } = await login(email, password);
    res.json({ token, user });
  } catch (error) {
    logger.error('Login error', { error });
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Create admin (protected route)
router.post('/create-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await createUser({ email, password, userType: UserType.ADMIN });
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    logger.error('Admin creation error', { error });
    if (error.message === 'Email already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// Get user profile (protected route)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;