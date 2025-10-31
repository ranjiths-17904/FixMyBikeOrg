const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Service = require('../models/Service');
const NotificationService = require('../services/notificationService');

const router = express.Router();

// Get all bookings (for owner) or user's bookings (for customer)
router.get('/', async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { status, location, date } = req.query;

    let query = {};

    // If customer, only show their bookings
    if (role === 'customer') {
      query.customer = userId;
    }

    // Apply filters
    if (status) {
      query.status = status;
    }
    if (location) {
      query.location = location;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'username email mobile')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// Analytics endpoints (place before dynamic :id routes)
router.get('/analytics', async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { timeFilter = 'month' } = req.query;

    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate date range based on timeFilter
    const now = new Date();
    let startDate, endDate;
    
    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = now;
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
    }

    // Get bookings in date range
    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('customer', 'username email');

    // Calculate analytics
    const total = bookings.length;
    const thisMonth = bookings.filter(b => 
      b.createdAt.getMonth() === now.getMonth() && 
      b.createdAt.getFullYear() === now.getFullYear()
    ).length;
    
    const lastMonth = bookings.filter(b => {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return b.createdAt.getMonth() === lastMonthDate.getMonth() && 
             b.createdAt.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    // Service breakdown
    const serviceBreakdown = {
      washPolish: bookings.filter(b => b.service === 'wash-polish').length,
      engineService: bookings.filter(b => b.service === 'engine-service').length,
      generalService: bookings.filter(b => b.service === 'general-service').length,
      majorRepairs: bookings.filter(b => b.service === 'major-repairs').length,
      breakdown: bookings.filter(b => b.service === 'breakdown').length,
      oilChange: bookings.filter(b => b.service === 'oil-change').length,
      brakeService: bookings.filter(b => b.service === 'brake-service').length,
      tireService: bookings.filter(b => b.service === 'tire-service').length,
      electrical: bookings.filter(b => b.service === 'electrical').length,
      chainService: bookings.filter(b => b.service === 'chain-service').length
    };

    // Location breakdown
    const locationBreakdown = {
      shop: bookings.filter(b => b.location === 'shop').length,
      home: bookings.filter(b => b.location === 'home').length
    };

    // Top services by revenue
    const serviceRevenue = {};
    bookings.forEach(booking => {
      if (!serviceRevenue[booking.service]) {
        serviceRevenue[booking.service] = { count: 0, revenue: 0 };
      }
      serviceRevenue[booking.service].count++;
      serviceRevenue[booking.service].revenue += booking.actualCost || booking.cost || 0;
    });

    const topServices = Object.entries(serviceRevenue)
      .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent bookings
    const recentBookings = bookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(booking => ({
        id: booking._id,
        customerName: booking.customer?.username || 'Unknown',
        service: booking.service,
        date: booking.date,
        status: booking.status,
        amount: booking.actualCost || booking.cost || 0
      }));

    res.json({
      success: true,
      total,
      thisMonth,
      lastMonth,
      growth,
      serviceBreakdown,
      locationBreakdown,
      topServices,
      recentBookings
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// Revenue analytics endpoint
router.get('/revenue', async (req, res) => {
  try {
    const { role } = req.user;
    const { timeFilter = 'month' } = req.query;

    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate, endDate;
    
    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = now;
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
    }

    // Get completed bookings in date range
    const bookings = await Booking.find({
      status: 'completed',
      updatedAt: { $gte: startDate, $lte: endDate }
    });

    const total = bookings.reduce((sum, booking) => sum + (booking.actualCost || booking.cost || 0), 0);
    const thisMonth = bookings.filter(b => 
      b.updatedAt.getMonth() === now.getMonth() && 
      b.updatedAt.getFullYear() === now.getFullYear()
    ).reduce((sum, booking) => sum + (booking.actualCost || booking.cost || 0), 0);
    
    const lastMonth = bookings.filter(b => {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return b.updatedAt.getMonth() === lastMonthDate.getMonth() && 
             b.updatedAt.getFullYear() === lastMonthDate.getFullYear();
    }).reduce((sum, booking) => sum + (booking.actualCost || booking.cost || 0), 0);

    const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    res.json({
      success: true,
      total,
      thisMonth,
      lastMonth,
      growth
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching revenue analytics'
    });
  }
});

// Get dashboard stats (owner only) - place before dynamic :id routes
router.get('/stats/dashboard', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can access dashboard stats'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Booking.aggregate([
      {
        $facet: {
          totalBookings: [{ $count: 'count' }],
          pendingBookings: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          confirmedBookings: [{ $match: { status: 'confirmed' } }, { $count: 'count' }],
          completedBookings: [{ $match: { status: 'completed' } }, { $count: 'count' }],
          cancelledBookings: [{ $match: { status: 'cancelled' } }, { $count: 'count' }],
          rejectedBookings: [{ $match: { status: 'rejected' } }, { $count: 'count' }],
          todayBookings: [{ $match: { date: { $gte: today, $lt: tomorrow } } }, { $count: 'count' }],
          totalRevenue: [
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: { $ifNull: ['$actualCost', '$cost', 0] } } } }
          ],
          todayRevenue: [
            { $match: { status: 'completed', updatedAt: { $gte: today, $lt: tomorrow } } },
            { $group: { _id: null, total: { $sum: { $ifNull: ['$actualCost', '$cost', 0] } } } }
          ],
          shopServices: [{ $match: { location: 'shop' } }, { $count: 'count' }],
          homeServices: [{ $match: { location: 'home' } }, { $count: 'count' }]
        }
      }
    ]);

    const result = {
      totalBookings: stats[0].totalBookings[0]?.count || 0,
      pendingBookings: stats[0].pendingBookings[0]?.count || 0,
      confirmedBookings: stats[0].confirmedBookings[0]?.count || 0,
      completedBookings: stats[0].completedBookings[0]?.count || 0,
      cancelledBookings: stats[0].cancelledBookings[0]?.count || 0,
      rejectedBookings: stats[0].rejectedBookings[0]?.count || 0,
      todayBookings: stats[0].todayBookings[0]?.count || 0,
      totalRevenue: stats[0].totalRevenue[0]?.total || 0,
      todayRevenue: stats[0].todayRevenue[0]?.total || 0,
      shopServices: stats[0].shopServices[0]?.count || 0,
      homeServices: stats[0].homeServices[0]?.count || 0
    };

    res.json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
});

// Create new booking (customer only)
router.post('/', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can create bookings'
      });
    }

    const {
      service,
      serviceName,
      date,
      time,
      location,
      bikeModel,
      bikeNumber,
      description,
      urgency,
      cost
    } = req.body;

    // Validation
    if (!service || !serviceName || !date || !time || !location || !bikeModel || !bikeNumber || !cost) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if date is in the future
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }
    // Allow same-day booking if urgency is high
    const isSameDay = bookingDate.getTime() === today.getTime();
    if (isSameDay && urgency !== 'high') {
      return res.status(400).json({ success: false, message: 'Same-day booking allowed only when urgency is high' });
    }

    const booking = new Booking({
      customer: req.user.userId,
      service,
      serviceName,
      date: bookingDate,
      time,
      location,
      bikeModel,
      bikeNumber,
      description,
      urgency,
      cost
    });

    await booking.save();

    // Find owner to send notification
    try {
      const owner = await User.findOne({ role: 'owner' });
      
      if (owner) {
        // Create notification for owner
        const notification = new Notification({
          recipient: owner._id,
          sender: req.user.userId,
          type: 'booking_created',
          title: 'New Booking Request',
          message: `New booking request for ${serviceName} from ${req.user.username}`,
          booking: booking._id
        });
        await notification.save();
      }
    } catch (notificationError) {
      console.error('Notification creation error:', notificationError);
      // Don't fail the booking if notification fails
    }

    try {
      const populatedBooking = await Booking.findById(booking._id)
        .populate('customer', 'username email mobile');

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking: populatedBooking
      });
    } catch (populateError) {
      console.error('Error populating booking:', populateError);
      // Return the booking without population if population fails
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking: booking
      });
    }

  } catch (error) {
    console.error('Create booking error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate booking found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      details: error.message
    });
  }
});

// Update booking status (owner only)
router.put('/:id/status', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can update booking status'
      });
    }

    const { id } = req.params;
    const { status, actualCost } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (actualCost) {
      booking.actualCost = actualCost;
    }

    // If marking as completed or delivered, set time
    if (status === 'service-done') {
      booking.receipt = booking.receipt || {};
      booking.receipt.serviceCompletedAt = new Date();
    }
    if (status === 'pickup-notification') {
      booking.receipt = booking.receipt || {};
      booking.receipt.pickupNotifiedAt = new Date();
    }
    if (status === 'picked-by-customer') {
      booking.receipt = booking.receipt || {};
      booking.receipt.pickedAt = new Date();
    }
    if (status === 'completed') {
      booking.receipt = booking.receipt || {};
      booking.receipt.completedAt = new Date();
    }
    if (status === 'delivered') {
      booking.receipt = booking.receipt || {};
      booking.receipt.deliveredAt = new Date();
    }

    await booking.save();

    // Create notification for customer (more specific types for certain statuses)
    let notificationType = 'status_update';
    let notificationTitle = 'Booking Status Updated';
    let notificationMessage = `Your booking for ${booking.serviceName} has been ${status}`;
    
    if (status === 'service-done') {
      notificationType = 'booking_completed';
      notificationTitle = '✅ Service Completed';
      notificationMessage = `Your ${booking.serviceName} service has been completed successfully! We'll notify you when it's ready for pickup.`;
    }
    if (status === 'pickup-notification') {
      notificationType = 'booking_completed';
      notificationTitle = '🚚 Ready for Pickup';
      notificationMessage = `Your ${booking.serviceName} service is ready for pickup! Please collect your bike from our service center.`;
    }
    if (status === 'picked-by-customer') {
      notificationType = 'booking_completed';
      notificationTitle = '🎉 Bike Collected';
      notificationMessage = `Thank you for collecting your bike! Your ${booking.serviceName} service is now complete.`;
    }
    if (status === 'completed') {
      notificationType = 'booking_completed';
      notificationTitle = 'Service Completed';
      notificationMessage = `Your ${booking.serviceName} service has been completed. Please arrange pickup or delivery.`;
    }
    if (status === 'delivered') {
      notificationType = 'booking_completed';
      notificationTitle = 'Bike Delivered / Ready for Pickup';
      notificationMessage = `Your ${booking.serviceName} service is delivered. Thank you!`;
    }

    const notification = new Notification({
      recipient: booking.customer,
      sender: req.user.userId,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      booking: booking._id
    });
    await notification.save();

    const updatedBooking = await Booking.findById(id)
      .populate('customer', 'username email mobile');

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
});

// Update booking receipt and payment (owner only)
router.put('/:id/receipt', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can update receipts'
      });
    }

    const { id } = req.params;
    const { workDone, partsReplaced, additionalNotes, mechanicNotes, actualCost, paymentMode, paymentReference, deliveryMethod } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.receipt = {
      workDone: workDone || [],
      partsReplaced: partsReplaced || [],
      additionalNotes: additionalNotes || '',
      mechanicNotes: mechanicNotes || '',
      completedAt: new Date()
    };

    if (actualCost) booking.actualCost = actualCost;
    if (paymentMode) booking.paymentMode = paymentMode;
    if (paymentReference) booking.paymentReference = paymentReference;
    if (deliveryMethod) booking.deliveryMethod = deliveryMethod;
    booking.paymentStatus = 'paid';
    booking.status = 'completed';

    await booking.save();

    // Create notification for customer about completed service
    const notification = new Notification({
      recipient: booking.customer,
      sender: req.user.userId,
      type: 'booking_completed',
      title: 'Service Completed',
      message: `Your ${booking.serviceName} service has been completed. Check your receipt for details.`,
      booking: booking._id
    });
    await notification.save();

    // Create a Service record snapshot
    await Service.create({
      booking: booking._id,
      customer: booking.customer,
      service: booking.service,
      serviceName: booking.serviceName,
      date: booking.date,
      time: booking.time,
      location: booking.location,
      bikeModel: booking.bikeModel,
      bikeNumber: booking.bikeNumber,
      description: booking.description,
      costQuoted: booking.cost,
      costActual: booking.actualCost ?? booking.cost,
      paymentMode: booking.paymentMode,
      paymentStatus: booking.paymentStatus,
      paymentReference: booking.paymentReference,
      receipt: booking.receipt
    });

    const updatedBooking = await Booking.findById(id)
      .populate('customer', 'username email mobile');

    res.json({
      success: true,
      message: 'Receipt updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating receipt'
    });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const booking = await Booking.findById(id)
      .populate('customer', 'username email mobile');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    if (role === 'customer' && booking.customer._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// Cancel booking (customer only)
router.put('/:id/cancel', async (req, res) => {
  try {
    const { role, userId } = req.user;
    
    if (role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can cancel bookings'
      });
    }

    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to the user
    if (booking.customer.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled in current status'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('customer', 'username email mobile');

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
});

// Delete booking (owner can delete any; customer can delete if pending/cancelled)
router.delete('/:id', async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (role === 'customer') {
      if (booking.customer.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (!['pending', 'cancelled', 'rejected', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({ success: false, message: 'Cannot delete booking in current status' });
      }
    }

    // Create notification for deletion
    const notification = new Notification({
      recipient: booking.customer,
      sender: userId,
      type: 'booking_cancelled',
      title: 'Booking Deleted',
      message: `Your ${booking.serviceName} booking has been deleted.`,
      booking: booking._id
    });
    
    await notification.save();
    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting booking' });
  }
});

// Update booking status (owner only)
router.put('/:id/status', async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { id } = req.params;
    const { status, reason } = req.body;

    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can update booking status'
      });
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'rejected'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      rejected: [],
      cancelled: []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }

    booking.status = status;
    if (reason) {
      booking.rejectionReason = reason;
    }
    if (req.body.actualCost) {
      booking.actualCost = req.body.actualCost;
    }
    await booking.save();

    // Send notification using the service
    await NotificationService.sendBookingStatusNotification(id, status, reason);

    const updatedBooking = await Booking.findById(id)
      .populate('customer', 'username email mobile');

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
});

// Send receipt to customer (owner only)
router.post('/:id/send-receipt', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can send receipts'
      });
    }

    const { id } = req.params;
    const { workDone, partsReplaced, additionalNotes, mechanicNotes, actualCost } = req.body;

    const booking = await Booking.findById(id).populate('customer', 'username email mobile');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update receipt details
    booking.receipt = {
      workDone: workDone || [],
      partsReplaced: partsReplaced || [],
      additionalNotes: additionalNotes || '',
      mechanicNotes: mechanicNotes || '',
      receiptSentAt: new Date()
    };

    if (actualCost) {
      booking.actualCost = actualCost;
    }

    await booking.save();

    // Create notification for customer about receipt
    const notification = new Notification({
      recipient: booking.customer._id,
      sender: req.user.userId,
      type: 'booking_completed',
      title: '📄 Service Receipt',
      message: `Your service receipt for ${booking.serviceName} has been generated. Total amount: ₹${actualCost || booking.cost}`,
      booking: booking._id
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Receipt sent successfully',
      booking: booking
    });

  } catch (error) {
    console.error('Send receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending receipt'
    });
  }
});

module.exports = router;
