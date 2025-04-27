const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /auth/login - Authenticate user
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  if (role === 'admin') {
    // Only allow the predefined admin user
    if (username !== 'Lokeshreddy' || password !== 'Lokesh@123') {
      return res.status(403).json({ success: false, message: 'Admin access denied' });
    }
  }

  try {
    const user = await User.findOne({ username, password, role });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // For demo, return a dummy token
    const token = 'dummy-token-' + user.username;
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /auth/register - Register new user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing registration data' });
  }

  if (role === 'admin') {
    return res.status(403).json({ success: false, message: 'Admin registration is not allowed' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
