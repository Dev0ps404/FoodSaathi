const express = require('express');
const router = express.Router();
const { getSummaryAnalytics } = require('../controllers/analyticsController');

router.get('/summary', getSummaryAnalytics);

module.exports = router;
