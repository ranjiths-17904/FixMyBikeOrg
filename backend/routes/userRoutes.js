const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { userId } = req.user;
    const { username, email, mobile, profile } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username/email/mobile is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already taken'
        });
      }
      user.email = email;
    }

    if (mobile && mobile !== user.mobile) {
      const existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already taken'
        });
      }
      user.mobile = mobile;
    }

    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// Get all users (owner only)
router.get('/', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// Toggle user status (owner only)
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent owner from deactivating themselves
    if (user.role === 'owner' && user._id.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling user status'
    });
  }
});

// Admin-only reset endpoint to wipe data and create main owner
router.post('/admin/reset', async (req, res) => {
  try {
    const token = req.headers['x-admin-reset'] || '';
    if ((process.env.ADMIN_RESET_SECRET || 'reset123') !== token) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await Booking.deleteMany({});
    await Notification.deleteMany({});
    await User.deleteMany({});
    await User.create({
      username: 'ownerfixmybike',
      email: 'owner@fixmybike.com',
      mobile: '9876543210',
      password: 'Owner01',
      role: 'owner'
    });

    res.json({ success: true, message: 'All data removed. Main owner recreated.' });
  } catch (error) {
    console.error('Admin reset error:', error);
    res.status(500).json({ success: false, message: 'Server error during reset' });
  }
});

module.exports = router;
