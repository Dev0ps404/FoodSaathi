const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '+91 99887 76655',
  },
  vehicleType: {
    type: String,
    enum: ['Bicycle', 'Motorbike', 'Car', 'Van', 'Electric Scooter'],
    default: 'Motorbike',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  maxCapacityMeals: {
    type: Number,
    default: 100,
  },
  currentDeliveriesCount: {
    type: Number,
    default: 0,
  },
  totalRescuedMeals: {
    type: Number,
    default: 1200,
  },
  completedDeliveriesCount: {
    type: Number,
    default: 28,
  },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  rating: {
    type: Number,
    default: 4.9,
  },
  activeDeliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema);
