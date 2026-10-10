const VolunteerProfile = require('../models/VolunteerProfile');
const { getDBStatus } = require('../config/db');
const { volunteers: mockVolunteers } = require('../seed/seedData');

let memoryVolunteers = JSON.parse(JSON.stringify(mockVolunteers));

// @route   GET /api/volunteers
// @desc    Get all volunteers
// @access  Public
const getVolunteers = async (req, res) => {
  try {
    const { available } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (available !== undefined) query.isAvailable = available === 'true';
      const volunteers = await VolunteerProfile.find(query).sort({ rating: -1 });
      return res.json({ success: true, count: volunteers.length, data: volunteers });
    }

    let results = [...memoryVolunteers];
    if (available !== undefined) {
      const isAvail = available === 'true';
      results = results.filter(v => v.isAvailable === isAvail);
    }
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/volunteers/:id
// @desc    Get single volunteer
// @access  Public
const getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const volunteer = await VolunteerProfile.findById(id);
      if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
      return res.json({ success: true, data: volunteer });
    }
    const volunteer = memoryVolunteers.find(v => v._id === id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/volunteers/availability
// @desc    Toggle or update volunteer availability
// @access  Private
const updateAvailability = async (req, res) => {
  try {
    const { volunteerId, isAvailable } = req.body;

    if (getDBStatus()) {
      const volunteer = await VolunteerProfile.findByIdAndUpdate(
        volunteerId || req.user?._id,
        { isAvailable },
        { new: true }
      );
      if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
      return res.json({ success: true, data: volunteer });
    }

    const targetId = volunteerId || memoryVolunteers[0]._id;
    const index = memoryVolunteers.findIndex(v => v._id === targetId);
    if (index !== -1) {
      memoryVolunteers[index].isAvailable = isAvailable;
      return res.json({ success: true, data: memoryVolunteers[index] });
    }

    res.status(404).json({ success: false, message: 'Volunteer not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVolunteers, getVolunteerById, updateAvailability };
