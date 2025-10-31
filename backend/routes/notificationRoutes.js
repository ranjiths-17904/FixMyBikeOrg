const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// Get user's notifications
router.get('/', async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    let query = { recipient: userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'username')
      .populate('booking', 'serviceName bikeModel')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
});

// Mark all notifications as read
router.patch('/read-all', async (req, res) => {
  try {
    const { userId } = req.user;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notifications'
    });
  }
});

// Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const { userId } = req.user;

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching unread count'
    });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const { recipient, type, title, message, booking } = req.body;
    const { userId: senderId } = req.user;

    // Validate ObjectId formats
    if (recipient && !recipient.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipient ID format'
      });
    }

    if (booking && !booking.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const notification = new Notification({
      recipient,
      sender: senderId,
      type,
      title,
      message,
      booking
    });

    await notification.save();
    
    res.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification'
    });
  }
});

module.exports = router;
