require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (with graceful fallback if offline)
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FoodRescue AI',
    version: '1.0.0',
    databaseConnected: getDBStatus(),
    mode: getDBStatus() ? 'MongoDB Connected' : 'In-Memory / Demo Resilient Mode',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/simulator', simulatorRoutes);

// Root message
app.get('/', (req, res) => {
  res.send('🌿 FoodRescue AI Backend API is active and running.');
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 FoodRescue AI Server listening on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
