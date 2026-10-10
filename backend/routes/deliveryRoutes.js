const express = require('express');
const router = express.Router();
const { getDeliveries, assignDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getDeliveries);
router.post('/assign', protect, assignDelivery);
router.put('/:id/status', protect, updateDeliveryStatus);

module.exports = router;
