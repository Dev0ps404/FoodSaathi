const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGOProfile',
    required: true,
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VolunteerProfile',
  },
  foodName: {
    type: String,
    required: true,
  },
  mealCount: {
    type: Number,
    required: true,
  },
  donorName: {
    type: String,
    required: true,
  },
  ngoName: {
    type: String,
    required: true,
  },
  volunteerName: {
    type: String,
    default: 'Unassigned',
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  dropoffAddress: {
    type: String,
    required: true,
  },
  pickupLocation: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  dropoffLocation: {
    lat: { type: Number, default: 28.6250 },
    lng: { type: Number, default: 77.2180 },
  },
  status: {
    type: String,
    enum: ['Assigned', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled'],
    default: 'Assigned',
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  estimatedDistanceKm: {
    type: Number,
    default: 4.5,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  pickedUpAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
  proofPhotoUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Delivery', deliverySchema);
