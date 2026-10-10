const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  registrationNumber: {
    type: String,
    default: 'NGO-DEL-2024-8891',
  },
  contactPerson: {
    type: String,
    default: 'Operations Director',
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '+91 98765 43210',
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  requiredMealQuantity: {
    type: Number,
    default: 150,
  },
  currentCapacity: {
    type: Number,
    default: 300,
  },
  activeDemand: {
    type: Boolean,
    default: true,
  },
  preferredCategories: {
    type: [String],
    default: ['Cooked Meals', 'Bakery', 'Produce', 'Packaged Goods'],
  },
  serviceRadiusKm: {
    type: Number,
    default: 15,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  operatingHours: {
    type: String,
    default: '8:00 AM - 10:00 PM',
  },
  totalMealsDistributed: {
    type: Number,
    default: 4500,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('NGOProfile', ngoProfileSchema);
