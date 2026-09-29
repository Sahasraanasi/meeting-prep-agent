const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_meeting_prep_agent_2026';
const JWT_EXPIRES_IN = '24h';

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Milestone A: Register
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken.'
      });
    }

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'user'
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id || user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message
    });
  }
};

// Milestone B & C: Login with Username/Email + Password + JWT
exports.login = async (req, res) => {
  try {
    const { identifier, username, email, password } = req.body;
    const loginIdentifier = (identifier || username || email || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username/email and password.'
      });
    }

    // Allow login using Username OR Email
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Verify bcrypt password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.'
      });
    }

    // Milestone C: Generate JWT token with user id
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
};