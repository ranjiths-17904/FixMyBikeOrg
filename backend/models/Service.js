const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  serviceName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, enum: ['shop', 'home'], required: true },
  bikeModel: { type: String, required: true },
  bikeNumber: { type: String, required: true },
  description: { type: String, default: '' },
  costQuoted: { type: Number, required: true },
  costActual: { type: Number, default: null },
  paymentMode: { type: String, enum: ['cash', 'online'], default: null },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentReference: { type: String, default: '' },
  receipt: {
    workDone: [String],
    partsReplaced: [String],
    additionalNotes: String,
    mechanicNotes: String,
    completedAt: Date
  }
}, { timestamps: true });

serviceSchema.index({ date: -1 });
serviceSchema.index({ customer: 1, date: -1 });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;


