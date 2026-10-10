const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  donorName: {
    type: String,
    required: true,
    default: 'Community Donor',
  },
  donorOrg: {
    type: String,
    default: '',
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Cooked Meals', 'Bakery', 'Produce', 'Dairy', 'Packaged Goods', 'Beverages', 'Other'],
    default: 'Cooked Meals',
  },
  mealCount: {
    type: Number,
    required: [true, 'Number of meal packets is required'],
    min: 1,
  },
  quantityKg: {
    type: Number,
    default: function() {
      return (this.mealCount * 0.45); // default approx 0.45kg per meal
    }
  },
  preparationTime: {
    type: Date,
    default: Date.now,
  },
  expiryTime: {
    type: Date,
    required: [true, 'Expiry / safe consumption deadline is required'],
  },
  dietaryType: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggitarian'],
    default: 'Vegetarian',
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  priorityReason: {
    type: String,
    default: 'Standard distribution timeframe based on food shelf-life',
  },
  status: {
    type: String,
    enum: ['Available', 'Matched', 'Assigned', 'Picked Up', 'Delivered', 'Cancelled'],
    default: 'Available',
  },
  pickupAddress: {
    type: String,
    required: [true, 'Pickup address is required'],
  },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  pickupInstructions: {
    type: String,
    default: 'Please collect from rear kitchen entrance or loading bay.',
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
  },
  matchedNGO: {
    id: String,
    name: String,
  },
  assignedVolunteer: {
    id: String,
    name: String,
    phone: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema);
