const NGOProfile = require('../models/NGOProfile');
const { getDBStatus } = require('../config/db');
const { ngos: mockNGOs } = require('../seed/seedData');

let memoryNGOs = JSON.parse(JSON.stringify(mockNGOs));

// @route   GET /api/ngos
// @desc    Get all NGOs
// @access  Public
const getNGOs = async (req, res) => {
  try {
    if (getDBStatus()) {
      const ngos = await NGOProfile.find().sort({ totalMealsDistributed: -1 });
      return res.json({ success: true, count: ngos.length, data: ngos });
    }
    res.json({ success: true, count: memoryNGOs.length, data: memoryNGOs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/ngos/:id
// @desc    Get single NGO
// @access  Public
const getNGOById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const ngo = await NGOProfile.findById(id);
      if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });
      return res.json({ success: true, data: ngo });
    }
    const ngo = memoryNGOs.find(n => n._id === id);
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/ngos/requirements
// @desc    Update or submit food requirements for an NGO
// @access  Private
const updateRequirements = async (req, res) => {
  try {
    const { ngoId, requiredMealQuantity, preferredCategories, serviceRadiusKm, activeDemand } = req.body;

    if (getDBStatus()) {
      const updated = await NGOProfile.findByIdAndUpdate(
        ngoId || req.user?._id,
        {
          requiredMealQuantity: Number(requiredMealQuantity),
          preferredCategories,
          serviceRadiusKm: Number(serviceRadiusKm),
          activeDemand: activeDemand !== undefined ? activeDemand : true,
        },
        { new: true, upsert: true }
      );
      return res.json({ success: true, message: 'NGO requirements updated successfully', data: updated });
    }

    const targetId = ngoId || memoryNGOs[0]._id;
    const index = memoryNGOs.findIndex(n => n._id === targetId);
    if (index !== -1) {
      memoryNGOs[index] = {
        ...memoryNGOs[index],
        requiredMealQuantity: Number(requiredMealQuantity) || memoryNGOs[index].requiredMealQuantity,
        preferredCategories: preferredCategories || memoryNGOs[index].preferredCategories,
        serviceRadiusKm: Number(serviceRadiusKm) || memoryNGOs[index].serviceRadiusKm,
        activeDemand: activeDemand !== undefined ? activeDemand : memoryNGOs[index].activeDemand,
      };
      return res.json({ success: true, message: 'NGO requirements updated successfully', data: memoryNGOs[index] });
    }

    res.status(404).json({ success: false, message: 'NGO profile not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNGOs, getNGOById, updateRequirements };
