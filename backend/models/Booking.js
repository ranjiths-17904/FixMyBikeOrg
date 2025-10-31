const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: true,
    enum: ['wash-polish', 'engine-service', 'general-service', 'major-repairs', 'breakdown', 'oil-change', 'brake-service', 'tire-service', 'electrical', 'chain-service']
  },
  serviceName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    enum: ['shop', 'home']
  },
  bikeModel: {
    type: String,
    required: true
  },
  bikeNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'in-progress', 'service-done', 'pickup-notification', 'picked-by-customer', 'completed', 'delivered', 'cancelled', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  cost: {
    type: Number,
    required: true
  },
  actualCost: {
    type: Number,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'online'],
    default: null
  },
  paymentReference: {
    type: String,
    default: ''
  },
  deliveryMethod: {
    type: String,
    enum: ['drop', 'pickup', null],
    default: null
  },
  receipt: {
    workDone: [String],
    partsReplaced: [String],
    additionalNotes: String,
    mechanicNotes: String,
    completedAt: Date,
    deliveredAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ customer: 1, date: -1 });
bookingSchema.index({ status: 1, date: 1 });
bookingSchema.index({ location: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
