const express = require('express');
const router = express.Router();
const { getNGOs, getNGOById, updateRequirements } = require('../controllers/ngoController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getNGOs);
router.post('/requirements', protect, updateRequirements);
router.get('/:id', getNGOById);

module.exports = router;
