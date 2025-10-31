const Notification = require('../models/Notification');
const Booking = require('../models/Booking');
const User = require('../models/User');

class NotificationService {
  // Send reminder notification for tomorrow bookings
  static async sendTomorrowReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Find all bookings for tomorrow
      const tomorrowBookings = await Booking.find({
        date: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        status: { $in: ['confirmed', 'pending'] }
      }).populate('customer', 'username email');

      for (const booking of tomorrowBookings) {
        // Check if reminder already sent
        const existingReminder = await Notification.findOne({
          recipient: booking.customer._id,
          booking: booking._id,
          type: 'tomorrow_reminder'
        });

        if (!existingReminder) {
          // Send reminder to customer
          const customerNotification = new Notification({
            recipient: booking.customer._id,
            sender: booking.customer._id, // System notification
            type: 'tomorrow_reminder',
            title: 'Tomorrow\'s Service Reminder',
            message: `Reminder: Your ${booking.service} service for ${booking.bikeModel} is scheduled for tomorrow at ${booking.time}. Please be ready!`,
            booking: booking._id,
            priority: 'high'
          });

          await customerNotification.save();

          // Find owner and send notification
          const owner = await User.findOne({ role: 'owner' });
          if (owner) {
            const ownerNotification = new Notification({
              recipient: owner._id,
              sender: booking.customer._id,
              type: 'tomorrow_reminder',
              title: 'Tomorrow\'s Service Reminder',
              message: `Reminder: ${booking.customer.username} has a ${booking.service} service scheduled for tomorrow at ${booking.time}.`,
              booking: booking._id,
              priority: 'high'
            });
            await ownerNotification.save();
          }
        }
      }

      console.log(`Sent ${tomorrowBookings.length} tomorrow reminders`);
    } catch (error) {
      console.error('Error sending tomorrow reminders:', error);
    }
  }

  // Send 4-hour advance reminder
  static async sendFourHourReminders() {
    try {
      const now = new Date();
      const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      
      // Find bookings in the next 4 hours
      const upcomingBookings = await Booking.find({
        date: {
          $gte: now,
          $lte: fourHoursFromNow
        },
        status: { $in: ['confirmed', 'pending'] }
      }).populate('customer', 'username email');

      for (const booking of upcomingBookings) {
        // Check if 4-hour reminder already sent
        const existingReminder = await Notification.findOne({
          recipient: booking.customer._id,
          booking: booking._id,
          type: 'four_hour_reminder'
        });

        if (!existingReminder) {
          // Send urgent reminder to customer
          const customerNotification = new Notification({
            recipient: booking.customer._id,
            sender: booking.customer._id,
            type: 'four_hour_reminder',
            title: '🚨 URGENT: Service in 4 Hours',
            message: `URGENT: Your ${booking.service} service for ${booking.bikeModel} is scheduled in 4 hours at ${booking.time}. Please ensure you're available!`,
            booking: booking._id,
            priority: 'urgent'
          });

          await customerNotification.save();

          // Find owner and send notification
          const owner = await User.findOne({ role: 'owner' });
          if (owner) {
            const ownerNotification = new Notification({
              recipient: owner._id,
              sender: booking.customer._id,
              type: 'four_hour_reminder',
              title: '🚨 URGENT: Service in 4 Hours',
              message: `URGENT: ${booking.customer.username} has a ${booking.service} service scheduled in 4 hours at ${booking.time}.`,
              booking: booking._id,
              priority: 'urgent'
            });
            await ownerNotification.save();
          }
        }
      }

      console.log(`Sent ${upcomingBookings.length} 4-hour reminders`);
    } catch (error) {
      console.error('Error sending 4-hour reminders:', error);
    }
  }

  // Send booking status notifications
  static async sendBookingStatusNotification(bookingId, status, reason = '') {
    try {
      const booking = await Booking.findById(bookingId).populate('customer', 'username email');
      if (!booking) return;

      // Find owner
      const owner = await User.findOne({ role: 'owner' });
      if (!owner) return;

      let notificationData = {
        recipient: booking.customer._id,
        sender: owner._id,
        booking: booking._id,
        priority: 'medium'
      };

      switch (status) {
        case 'confirmed':
          notificationData.type = 'booking_confirmed';
          notificationData.title = '✅ Booking Confirmed';
          notificationData.message = `Your ${booking.service} booking for ${booking.bikeModel} has been confirmed for ${booking.date} at ${booking.time}.`;
          break;
        case 'delivered':
          notificationData.type = 'booking_completed';
          notificationData.title = '✅ Bike Ready for Pickup';
          notificationData.message = `Your ${booking.service} service is completed and marked delivered. Please pick up your bike.`;
          break;
        case 'rejected':
          notificationData.type = 'booking_rejected';
          notificationData.title = '❌ Booking Rejected';
          notificationData.message = `Your ${booking.service} booking has been rejected. Reason: ${reason || 'No reason provided'}`;
          break;
        case 'completed':
          notificationData.type = 'booking_completed';
          notificationData.title = '🎉 Service Completed';
          notificationData.message = `Your ${booking.service} service has been completed successfully. Thank you for choosing our service!`;
          break;
        case 'cancelled':
          notificationData.type = 'booking_cancelled';
          notificationData.title = '🚫 Booking Cancelled';
          notificationData.message = `Your ${booking.service} booking has been cancelled.`;
          break;
      }

      const notification = new Notification(notificationData);
      await notification.save();

      console.log(`Sent ${status} notification for booking ${bookingId}`);
    } catch (error) {
      console.error('Error sending booking status notification:', error);
    }
  }

  // Clean up old notifications (older than 30 days)
  static async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

module.exports = NotificationService;
