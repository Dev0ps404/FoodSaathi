const Donation = require('../models/Donation');
const { getDBStatus } = require('../config/db');
const { donations: mockDonations, ngos: mockNGOs } = require('../seed/seedData');

let memoryDonations = JSON.parse(JSON.stringify(mockDonations));

// Helper: AI Food Priority Classifier
const classifyPriority = (expiryTime, category, mealCount) => {
  const now = new Date();
  const exp = new Date(expiryTime);
  const hoursLeft = (exp.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 0) {
    return {
      priority: 'Critical',
      reason: 'Expired or immediate consumption window elapsed. Requires urgent inspection.',
    };
  } else if (hoursLeft <= 3 || (category === 'Cooked Meals' && hoursLeft <= 4)) {
    return {
      priority: 'Critical',
      reason: `Safe consumption window is critically short (${hoursLeft.toFixed(1)} hrs). Immediate pickup required.`,
    };
  } else if (hoursLeft <= 6 || mealCount > 200) {
    return {
      priority: 'High',
      reason: `High urgency (${hoursLeft.toFixed(1)} hrs left) or large batch size (${mealCount} meals).`,
    };
  } else if (hoursLeft <= 14) {
    return {
      priority: 'Medium',
      reason: `Moderate shelf life (${hoursLeft.toFixed(1)} hrs left). Normal dispatch queue.`,
    };
  } else {
    return {
      priority: 'Low',
      reason: `High longevity (${hoursLeft.toFixed(1)} hrs left). Long-window delivery.`,
    };
  }
};

// Helper: Haversine distance in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

// @route   GET /api/donations
// @desc    Get all donations with optional filters
// @access  Public
const getDonations = async (req, res) => {
  try {
    const { category, priority, status, search } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (priority && priority !== 'All') query.priority = priority;
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { foodName: { $regex: search, $options: 'i' } },
          { donorName: { $regex: search, $options: 'i' } },
          { pickupAddress: { $regex: search, $options: 'i' } },
        ];
      }

      const donations = await Donation.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: donations.length, data: donations });
    }

    // In-memory fallback
    let results = [...memoryDonations];
    if (category && category !== 'All') results = results.filter(d => d.category === category);
    if (priority && priority !== 'All') results = results.filter(d => d.priority === priority);
    if (status && status !== 'All') results = results.filter(d => d.status === status);
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(d =>
        d.foodName.toLowerCase().includes(s) ||
        d.donorName.toLowerCase().includes(s) ||
        d.pickupAddress.toLowerCase().includes(s)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/donations/:id
// @desc    Get single donation
// @access  Public
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const donation = await Donation.findById(id);
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation not found' });
      }
      return res.json({ success: true, data: donation });
    }

    const donation = memoryDonations.find(d => d._id === id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/donations
// @desc    Create new donation (with AI priority & duplicate check)
// @access  Private
const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      category,
      mealCount,
      quantityKg,
      preparationTime,
      expiryTime,
      dietaryType,
      pickupAddress,
      location,
      pickupInstructions,
      imageUrl,
      donorName,
      donorOrg,
    } = req.body;

    if (!foodName || !mealCount || !expiryTime || !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food name, meal count, expiry time, and pickup address',
      });
    }

    // AI Priority Classification
    const { priority, reason: priorityReason } = classifyPriority(expiryTime, category, mealCount);

    const donationData = {
      donorId: req.user?._id || 'demo-donor-id',
      donorName: donorName || req.user?.name || 'Community Donor',
      donorOrg: donorOrg || req.user?.organizationName || 'Generous Kitchens',
      foodName,
      category: category || 'Cooked Meals',
      mealCount: Number(mealCount),
      quantityKg: Number(quantityKg) || Number(mealCount) * 0.45,
      preparationTime: preparationTime ? new Date(preparationTime) : new Date(),
      expiryTime: new Date(expiryTime),
      dietaryType: dietaryType || 'Vegetarian',
      priority,
      priorityReason,
      status: 'Available',
      pickupAddress,
      location: location || { lat: 28.6139 + (Math.random() - 0.5) * 0.08, lng: 77.2090 + (Math.random() - 0.5) * 0.08 },
      pickupInstructions: pickupInstructions || 'Contact supervisor upon arrival at loading area.',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
    };

    if (getDBStatus()) {
      const donation = await Donation.create(donationData);
      return res.status(201).json({ success: true, data: donation });
    }

    // In-memory fallback
    const newDonation = {
      ...donationData,
      _id: 'mem_don_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryDonations.unshift(newDonation);

    res.status(201).json({ success: true, data: newDonation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/donations/:id
// @desc    Update donation
// @access  Private
const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.expiryTime) {
      const { priority, reason } = classifyPriority(req.body.expiryTime, req.body.category, req.body.mealCount);
      req.body.priority = priority;
      req.body.priorityReason = reason;
    }

    if (getDBStatus()) {
      const donation = await Donation.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
      return res.json({ success: true, data: donation });
    }

    const index = memoryDonations.findIndex(d => d._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Donation not found' });

    memoryDonations[index] = { ...memoryDonations[index], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: memoryDonations[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/donations/:id
// @desc    Delete donation
// @access  Private
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const donation = await Donation.findByIdAndDelete(id);
      if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
      return res.json({ success: true, message: 'Donation removed successfully' });
    }

    const index = memoryDonations.findIndex(d => d._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Donation not found' });

    memoryDonations.splice(index, 1);
    res.json({ success: true, message: 'Donation removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/donations/:id/matches
// @desc    Get top 3 AI-matched NGOs for a donation
// @access  Public
const getDonationMatches = async (req, res) => {
  try {
    const { id } = req.params;
    let donation;

    if (getDBStatus()) {
      donation = await Donation.findById(id);
    } else {
      donation = memoryDonations.find(d => d._id === id);
    }

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Run AI Smart Matching Heuristic against active NGOs
    const scoredNGOs = mockNGOs.map(ngo => {
      const dist = calculateDistance(
        donation.location.lat,
        donation.location.lng,
        ngo.location.lat,
        ngo.location.lng
      );

      // Distance Score (max 30 pts, drops as distance increases beyond 15km)
      const distanceScore = Math.max(0, 30 - (dist * 1.5));

      // Quantity / Capacity match (max 25 pts)
      const quantityRatio = Math.min(1, ngo.requiredMealQuantity / donation.mealCount);
      const quantityScore = quantityRatio * 25;

      // Category compatibility (max 20 pts)
      const categoryMatch = ngo.preferredCategories.includes(donation.category);
      const categoryScore = categoryMatch ? 20 : 5;

      // Urgency & Operating Status (max 15 pts)
      const urgencyBonus = ngo.activeDemand ? 15 : 0;

      // Total Score out of 100
      const totalScore = Math.min(99, Math.round(distanceScore + quantityScore + categoryScore + urgencyBonus));

      const reasons = [];
      if (dist <= 5) reasons.push(`Very close proximity (${dist} km away)`);
      else reasons.push(`Within service radius (${dist} km away)`);

      if (categoryMatch) reasons.push(`Preferred food category match (${donation.category})`);
      if (ngo.requiredMealQuantity >= donation.mealCount) {
        reasons.push(`Can comfortably absorb ${donation.mealCount} meals (Demand: ${ngo.requiredMealQuantity})`);
      } else {
        reasons.push(`Partial absorption capability (${ngo.requiredMealQuantity} of ${donation.mealCount} meals)`);
      }

      return {
        ngo,
        matchPercentage: totalScore,
        distanceKm: dist,
        reasons,
      };
    });

    // Sort descending and take top 3
    scoredNGOs.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topMatches = scoredNGOs.slice(0, 3);

    res.json({
      success: true,
      donationId: id,
      matches: topMatches,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationMatches,
};
