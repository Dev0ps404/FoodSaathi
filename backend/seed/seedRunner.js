require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const NGOProfile = require('../models/NGOProfile');
const VolunteerProfile = require('../models/VolunteerProfile');
const Delivery = require('../models/Delivery');
const { users, ngos, volunteers, donations, deliveries } = require('./seedData');

const seedDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodrescue_ai';
  console.log(`Connecting to ${mongoURI}...`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected. Clearing existing data...');

    await User.deleteMany({});
    await Donation.deleteMany({});
    await NGOProfile.deleteMany({});
    await VolunteerProfile.deleteMany({});
    await Delivery.deleteMany({});

    console.log('Inserting seed users...');
    await User.create(users);

    console.log('Inserting seed NGOs...');
    await NGOProfile.create(ngos);

    console.log('Inserting seed Volunteers...');
    await VolunteerProfile.create(volunteers);

    console.log('Inserting seed Donations...');
    await Donation.create(donations);

    console.log('Inserting seed Deliveries...');
    await Delivery.create(deliveries);

    console.log('🌱 Seed data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.log('Tip: Make sure local MongoDB server is running on port 27017');
    process.exit(1);
  }
};

seedDB();
