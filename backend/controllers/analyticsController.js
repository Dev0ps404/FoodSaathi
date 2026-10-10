// Analytics Controller for FoodRescue AI
const getSummaryAnalytics = async (req, res) => {
  try {
    const summary = {
      totalMealsRescued: 28450,
      activeDonationsCount: 8,
      activeNGOsCount: 14,
      registeredVolunteersCount: 42,
      activeDeliveriesCount: 6,
      wasteAvoidedKg: 12800,
      co2EmissionsSavedKg: 32000, // ~2.5 kg CO2e per kg food saved
      waterConservedLitres: 576000,
      economicValueSavedINR: 1422500,
      rescueSuccessRate: 94.8, // percent
      averageDeliveryTimeMins: 38,
      
      // Trends for Recharts (Last 7 days)
      weeklyTrend: [
        { day: 'Mon', rescued: 3200, demand: 3400, target: 3000 },
        { day: 'Tue', rescued: 3850, demand: 4000, target: 3200 },
        { day: 'Wed', rescued: 4100, demand: 4200, target: 3500 },
        { day: 'Thu', rescued: 3900, demand: 4100, target: 3500 },
        { day: 'Fri', rescued: 4800, demand: 5000, target: 4000 },
        { day: 'Sat', rescued: 5600, demand: 5800, target: 4500 },
        { day: 'Sun', rescued: 5900, demand: 6100, target: 4800 },
      ],

      // Category breakdown
      categoryDistribution: [
        { name: 'Cooked Meals', value: 42, color: '#10b981' },
        { name: 'Bakery', value: 22, color: '#3b82f6' },
        { name: 'Produce', value: 18, color: '#8b5cf6' },
        { name: 'Dairy', value: 12, color: '#f59e0b' },
        { name: 'Packaged Goods', value: 6, color: '#06b6d4' },
      ],

      // Priority distribution
      priorityDistribution: [
        { name: 'Critical (<3h)', count: 3, percentage: 38, color: '#ef4444' },
        { name: 'High (3-6h)', count: 3, percentage: 38, color: '#f97316' },
        { name: 'Medium (6-12h)', count: 1, percentage: 12, color: '#eab308' },
        { name: 'Low (>12h)', count: 1, percentage: 12, color: '#10b981' },
      ],

      // NGO Absorption Top 5
      ngoDistribution: [
        { name: 'Hope Food Shelter', meals: 18450, capacity: 20000, fillRate: 92 },
        { name: 'Annamrita Foundation', meals: 34200, capacity: 36000, fillRate: 95 },
        { name: 'Robin Hood Food Care', meals: 12900, capacity: 15000, fillRate: 86 },
        { name: 'Roti Bank Society', meals: 52100, capacity: 55000, fillRate: 94 },
        { name: 'Mother Teresa Relief', meals: 9800, capacity: 12000, fillRate: 81 },
      ],

      // AI Simulated Demand Prediction (Next 7 days forecast)
      demandForecast: [
        { day: 'Monday', projectedSurplus: 3400, expectedDemand: 3800, confidence: 94, risk: 'Low' },
        { day: 'Tuesday', projectedSurplus: 3700, expectedDemand: 3900, confidence: 91, risk: 'Low' },
        { day: 'Wednesday', projectedSurplus: 4200, expectedDemand: 4300, confidence: 89, risk: 'Medium' },
        { day: 'Thursday', projectedSurplus: 4100, expectedDemand: 4200, confidence: 92, risk: 'Low' },
        { day: 'Friday (Weekend Eve)', projectedSurplus: 5300, expectedDemand: 5100, confidence: 96, risk: 'High Surplus' },
        { day: 'Saturday (Events/Weddings)', projectedSurplus: 6800, expectedDemand: 6500, confidence: 95, risk: 'High Surplus' },
        { day: 'Sunday (Banquet Peaks)', projectedSurplus: 6200, expectedDemand: 6000, confidence: 93, risk: 'High Surplus' },
      ]
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSummaryAnalytics };
