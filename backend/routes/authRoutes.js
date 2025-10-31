const express = require('express');
const { 
  registerUser, 
  loginUser, 
  sendOTP, 
  verifyOTPAndRegister, 
  resendOTP,
  sendForgotPasswordOTP,
  resetPasswordWithOTP
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// OTP-based registration routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPAndRegister);
router.post('/resend-otp', resendOTP);

// Forgot password routes
router.post('/forgot-password', sendForgotPasswordOTP);
router.post('/reset-password', resetPasswordWithOTP);

// Legacy registration route (keeping for backward compatibility)
router.post('/signup', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email, profile } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username/email is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: userResponse
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// Check availability (username/email)
router.post('/check-availability', async (req, res) => {
  try {
    const { field, value } = req.body;

    if (!field || !value) {
      return res.status(400).json({
        success: false,
        message: 'Field and value are required'
      });
    }

    if (!['username', 'email'].includes(field)) {
      return res.status(400).json({
        success: false,
        message: 'Field must be either username or email'
      });
    }

    const existingUser = await User.findOne({ [field]: value });
    const available = !existingUser;

    res.json({
      success: true,
      available,
      message: available ? `${field} is available` : `${field} is already taken`
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during availability check'
    });
  }
});

module.exports = router;
