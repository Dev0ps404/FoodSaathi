const express = require('express');
const router = express.Router();
const { runSimulation } = require('../controllers/simulatorController');

router.post('/run', runSimulation);

module.exports = router;
