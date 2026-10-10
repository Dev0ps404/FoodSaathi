const express = require('express');
const router = express.Router();
const {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationMatches,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDonations)
  .post(protect, createDonation);

router.route('/:id')
  .get(getDonationById)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

router.get('/:id/matches', getDonationMatches);

module.exports = router;
