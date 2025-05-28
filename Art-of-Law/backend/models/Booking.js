// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a client.'],
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must be for an organizer.'],
  },
  startTime: {
    type: Date,
    required: [true, 'Booking must have a start time.'],
  },
  endTime: {
    type: Date,
    required: [true, 'Booking must have an end time.'],
  },
  serviceType: {
    type: String,
    required: [true, 'Please specify the type of service for the booking.'],
  },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'cancelled_by_user', 'cancelled_by_organizer', 'completed'],
    default: 'pending_payment',
  },
  notes: {
    type: String,
    trim: true,
  },
  paymentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.index({ organizer: 1, startTime: 1, client: 1 }, {
  unique: true,
  partialFilterExpression: { status: { $nin: ['cancelled_by_user', 'cancelled_by_organizer'] } }
});
bookingSchema.index({ organizer: 1, startTime: 1 }, {
  unique: true,
  partialFilterExpression: { status: { $in: ['confirmed', 'pending_payment'] } }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;