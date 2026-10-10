const express = require('express');
const router = express.Router();
const { getVolunteers, getVolunteerById, updateAvailability } = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getVolunteers);
router.put('/availability', protect, updateAvailability);
router.get('/:id', getVolunteerById);

module.exports = router;
