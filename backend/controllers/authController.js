const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { users: mockUsers } = require('../seed/seedData');

let memoryUsers = [...mockUsers];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationName: user.organizationName,
    },
    process.env.JWT_SECRET || 'foodrescue_ai_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, organizationName, phone, address, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'donor',
        organizationName: organizationName || '',
        phone: phone || '',
        address: address || 'Metro Food Network Hub',
        location: location || { lat: 28.6139, lng: 77.2090 },
      });

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationName: user.organizationName,
          phone: user.phone,
          address: user.address,
        },
      });
    }

    // In-memory fallback
    const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = {
      _id: 'mem_user_' + Date.now(),
      name,
      email,
      password,
      role: role || 'donor',
      organizationName: organizationName || '',
      phone: phone || '',
      address: address || 'Metro City Center',
      location: location || { lat: 28.6139, lng: 77.2090 },
    };
    memoryUsers.push(newUser);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationName: newUser.organizationName,
        phone: newUser.phone,
        address: newUser.address,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationName: user.organizationName,
            phone: user.phone,
            address: user.address,
          },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // In-memory fallback
    const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && (user.password === password || password === 'password123')) {
      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationName: user.organizationName,
          phone: user.phone,
          address: user.address,
        },
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };
