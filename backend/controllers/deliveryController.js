const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');
const { getDBStatus } = require('../config/db');
const { deliveries: mockDeliveries } = require('../seed/seedData');

let memoryDeliveries = JSON.parse(JSON.stringify(mockDeliveries));

// @route   GET /api/deliveries
// @desc    Get all deliveries with optional status filter
// @access  Public
const getDeliveries = async (req, res) => {
  try {
    const { status, volunteerId } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (volunteerId) query.volunteerId = volunteerId;
      const deliveries = await Delivery.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: deliveries.length, data: deliveries });
    }

    let results = [...memoryDeliveries];
    if (status && status !== 'All') results = results.filter(d => d.status === status);
    if (volunteerId) results = results.filter(d => d.volunteerId === volunteerId);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/deliveries/assign
// @desc    Assign a volunteer to a donation rescue mission
// @access  Private
const assignDelivery = async (req, res) => {
  try {
    const {
      donationId,
      ngoId,
      volunteerId,
      foodName,
      mealCount,
      donorName,
      ngoName,
      volunteerName,
      pickupAddress,
      dropoffAddress,
      pickupLocation,
      dropoffLocation,
      priority,
      estimatedDistanceKm,
    } = req.body;

    const deliveryPayload = {
      donationId,
      ngoId,
      volunteerId: volunteerId || null,
      foodName: foodName || 'Rescued Meal Batch',
      mealCount: Number(mealCount) || 50,
      donorName: donorName || 'Verified Donor',
      ngoName: ngoName || 'Partner Food Shelter',
      volunteerName: volunteerName || 'Alex Rivera',
      pickupAddress: pickupAddress || 'Downtown Kitchen',
      dropoffAddress: dropoffAddress || 'Community Center',
      pickupLocation: pickupLocation || { lat: 28.6315, lng: 77.2167 },
      dropoffLocation: dropoffLocation || { lat: 28.6420, lng: 77.2140 },
      priority: priority || 'High',
      status: volunteerId ? 'Accepted' : 'Assigned',
      estimatedDistanceKm: Number(estimatedDistanceKm) || 4.2,
      assignedAt: new Date(),
    };

    if (getDBStatus()) {
      const delivery = await Delivery.create(deliveryPayload);
      if (donationId) {
        await Donation.findByIdAndUpdate(donationId, {
          status: 'Assigned',
          assignedVolunteer: { id: volunteerId, name: volunteerName },
        });
      }
      return res.status(201).json({ success: true, data: delivery });
    }

    const newDelivery = {
      ...deliveryPayload,
      _id: 'mem_del_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryDeliveries.unshift(newDelivery);

    res.status(201).json({ success: true, data: newDelivery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/deliveries/:id/status
// @desc    Update delivery status ('Accepted', 'Picked Up', 'Delivered', 'Cancelled')
// @access  Private
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, proofPhotoUrl } = req.body;

    const updates = { status, notes, proofPhotoUrl };
    if (status === 'Picked Up') updates.pickedUpAt = new Date();
    if (status === 'Delivered') updates.deliveredAt = new Date();

    if (getDBStatus()) {
      const delivery = await Delivery.findByIdAndUpdate(id, updates, { new: true });
      if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
      return res.json({ success: true, data: delivery });
    }

    const index = memoryDeliveries.findIndex(d => d._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Delivery not found' });

    memoryDeliveries[index] = { ...memoryDeliveries[index], ...updates, updatedAt: new Date() };
    res.json({ success: true, data: memoryDeliveries[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDeliveries, assignDelivery, updateDeliveryStatus };
