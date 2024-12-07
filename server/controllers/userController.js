import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Special case for admin
  if (email === 'admin@zamanix.com') {
    return res.status(400).json({
      status: 'error',
      message: 'This email cannot be used for registration'
    });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          coins: user.coins,
          loginStreak: user.loginStreak,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to create account'
    });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Special case for admin
    if (email === 'admin@zamanix.com' && password === 'zamanix_admin') {
      return res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          _id: 'admin',
          name: 'Admin',
          email: 'admin@zamanix.com',
          phone: '',
          coins: 0,
          loginStreak: 0,
          token: 'admin_token'
        }
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Update login streak and coins
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const wasYesterday = user.lastLoginDate.toDateString() === yesterday.toDateString();
    const loginStreak = wasYesterday ? user.loginStreak + 1 : 1;
    const coinsToAdd = wasYesterday ? loginStreak : 1;

    user.lastLoginDate = today;
    user.loginStreak = loginStreak;
    user.coins += coinsToAdd;
    await user.save();

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        coins: user.coins,
        loginStreak: user.loginStreak,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error occurred'
    });
  }
});