const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpService = require('../services/otpService');

const JWT_SECRET = process.env.JWT_SECRET || 'fixmybike-super-secret-jwt-key-2024-production-ready';

// Register Controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role = 'customer' } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { emailOrUser, password } = req.body;

    // Validation
    if (!emailOrUser || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/username and password are required'
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUser }, { username: emailOrUser }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Send OTP for registration
const sendOTP = async (req, res) => {
  try {
    const { email, username, phone } = req.body;

    // Validation
    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email and username are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Generate OTP
    const otp = otpService.generateOTP();
    const expiresAt = otpService.getOTPExpiration();

    // Store OTP in memory or use a simple approach
    // For now, we'll use a simple approach by storing in a Map
    if (!global.otpStore) {
      global.otpStore = new Map();
    }

    // Store OTP with expiration
    const otpKey = `${email}-${username}`;
    global.otpStore.set(otpKey, {
      otp,
      expiresAt,
      email,
      username,
      phone: phone || null
    });
    
    // Debug logging
    console.log('OTP stored:', { otpKey, otp, expiresAt, phone });
    console.log('Current OTP store size:', global.otpStore.size);
    console.log('Environment:', process.env.NODE_ENV);

    // Send OTP via email
    const emailSent = await otpService.sendEmailOTP(email, otp, username);

    if (!emailSent?.ok) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      tempUserId: `${email}-${username}`, // Use a simple identifier
      previewUrl: emailSent.previewUrl
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending verification code'
    });
  }
};

// Verify OTP and complete registration
const verifyOTPAndRegister = async (req, res) => {
  try {
    const { tempUserId, otp, password } = req.body;

    // Validation
    if (!tempUserId || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Get OTP from memory store
    if (!global.otpStore) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification request'
      });
    }

    const otpData = global.otpStore.get(tempUserId);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification request'
      });
    }

    // Verify OTP with debug logging
    console.log('OTP Verification Debug:', {
      storedOTP: otpData.otp,
      providedOTP: otp,
      storedExpiration: otpData.expiresAt,
      currentTime: new Date(),
      isExpired: new Date() > new Date(otpData.expiresAt)
    });
    
    const isOTPValid = otpService.verifyOTP(
      otpData.otp,
      otpData.expiresAt,
      otp
    );

    if (!isOTPValid) {
      console.log('OTP verification failed');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
    
    console.log('OTP verification successful');

    // Create new user with verified email
    // Prevent duplicate accounts if verification retried
    const existingUser = await User.findOne({ email: otpData.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newUser = new User({
      username: otpData.username,
      email: otpData.email,
      mobile: otpData.phone, // Include phone number
      password: password,
      emailVerified: true,
      role: 'customer'
    });

    await newUser.save();

    // Remove OTP from memory
    global.otpStore.delete(tempUserId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    console.error('Request body:', req.body);
    console.error('OTP store state:', global.otpStore ? Array.from(global.otpStore.entries()) : 'No OTP store');
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { tempUserId } = req.body;

    if (!tempUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get OTP data from memory store
    if (!global.otpStore) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification request'
      });
    }

    const otpData = global.otpStore.get(tempUserId);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification request'
      });
    }

    // Generate new OTP
    const otp = otpService.generateOTP();
    const expiresAt = otpService.getOTPExpiration();

    // Update OTP in memory store
    global.otpStore.set(tempUserId, {
      ...otpData,
      otp,
      expiresAt
    });

    // Send new OTP via email
    const emailSent = await otpService.sendEmailOTP(otpData.email, otp, otpData.username);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.json({
      success: true,
        message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending verification code'
    });
  }
};

// Send forgot password OTP
const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    // Generate OTP
    const otp = otpService.generateOTP();
    const expiresAt = otpService.getOTPExpiration();

    // Update user with OTP
    user.emailOtp = {
      code: otp,
      expiresAt: expiresAt
    };

    await user.save();

    // Send OTP via email
    const emailSent = await otpService.sendEmailOTP(email, otp, user.username);

    if (!emailSent?.ok) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'Password reset code sent to your email',
      userId: user._id,
      previewUrl: emailSent.previewUrl
    });

  } catch (error) {
    console.error('Send forgot password OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending verification code'
    });
  }
};

// Reset password with OTP
const resetPasswordWithOTP = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify OTP
    const isOTPValid = otpService.verifyOTP(
      user.emailOtp.code,
      user.emailOtp.expiresAt,
      otp
    );

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.emailOtp = { code: null, expiresAt: null };

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully!'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  sendOTP, 
  verifyOTPAndRegister, 
  resendOTP,
  sendForgotPasswordOTP,
  resetPasswordWithOTP
};
