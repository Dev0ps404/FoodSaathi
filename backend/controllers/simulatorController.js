

const runSimulation = async (req, res) => {
  try {
    const surplusMeals = parseInt(req.body.surplusMeals, 10) || 1000;
    const ngoCount = parseInt(req.body.ngoCount, 10) || 10;
    const volunteerCount = parseInt(req.body.volunteerCount, 10) || 20;
    const donorLocations = parseInt(req.body.donorLocations, 10) || 5;
    const avgDistance = parseFloat(req.body.avgDistance) || 8.5; // km

    const categories = ['Cooked Meals', 'Bakery', 'Produce', 'Dairy', 'Packaged Goods'];
    const urgencyLevels = ['Critical (<3h)', 'High (3-6h)', 'Medium (6-12h)', 'Low (>12h)'];

    // 1. Generated Simulated Donor Batches
    const batches = [];
    const avgBatchSize = Math.max(30, Math.round(surplusMeals / (donorLocations * 2.5)));
    let remainingToGenerate = surplusMeals;
    let batchId = 1;

    while (remainingToGenerate > 0) {
      const size = Math.min(
        remainingToGenerate,
        Math.max(25, Math.round(avgBatchSize * (0.6 + Math.random() * 0.8)))
      );
      remainingToGenerate -= size;

      const donorIdx = (batchId % donorLocations) + 1;
      const category = categories[batchId % categories.length];
      const urgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];

      batches.push({
        id: `BATCH-${String(batchId).padStart(3, '0')}`,
        donor: `Donor Hub ${donorIdx} (Sector ${donorIdx * 4})`,
        meals: size,
        quantityKg: parseFloat((size * 0.45).toFixed(1)),
        category,
        urgency,
        shelfLifeHours: urgency.includes('Critical') ? 2.5 : urgency.includes('High') ? 5 : urgency.includes('Medium') ? 9 : 24,
      });
      batchId++;
    }

    // Sort batches by urgency (Critical first)
    batches.sort((a, b) => a.shelfLifeHours - b.shelfLifeHours);

    // 2. Generate Simulated NGO Profiles
    const simulatedNGOs = [];
    const baseDemandPerNGO = Math.round((surplusMeals * 1.1) / ngoCount);
    for (let i = 1; i <= ngoCount; i++) {
      const demand = Math.round(baseDemandPerNGO * (0.7 + Math.random() * 0.6));
      simulatedNGOs.push({
        id: `NGO-${String(i).padStart(2, '0')}`,
        name: `Community Shelter ${i} (${['North', 'South', 'East', 'West', 'Central'][i % 5]} Wing)`,
        totalCapacity: Math.round(demand * 1.3),
        allocatedMeals: 0,
        remainingDemand: demand,
        acceptedBatches: 0,
      });
    }

    // 3. Generate Simulated Volunteer Fleet
    const simulatedVolunteers = [];
    for (let v = 1; v <= volunteerCount; v++) {
      const vehicle = ['Motorbike (70 meals)', 'Car (150 meals)', 'Van (350 meals)', 'E-Scooter (50 meals)'][v % 4];
      const maxCap = vehicle.includes('Van') ? 350 : vehicle.includes('Car') ? 150 : vehicle.includes('Motorbike') ? 70 : 50;
      simulatedVolunteers.push({
        id: `VOL-${String(v).padStart(2, '0')}`,
        name: `Volunteer Driver #${v}`,
        vehicle,
        maxTripCapacity: maxCap,
        deliveriesDone: 0,
        mealsTransported: 0,
        totalKmTravelled: 0,
        isBusy: false,
      });
    }

    // 4. Run Matching & Allocation Algorithm
    let totalMealsAllocated = 0;
    let totalMealsUnmatched = 0;
    let totalDeliveries = 0;
    let totalDistanceCovered = 0;
    const allocationLedger = [];
    const unrescuedBatches = [];

    for (const batch of batches) {
      let batchMealsRemaining = batch.meals;

      // Find best NGO candidate with remaining demand
      const availableNGO = simulatedNGOs.find(n => n.remainingDemand > 0);

      // Find available volunteer with capacity
      const availableVolunteer = simulatedVolunteers.find(v => v.deliveriesDone < 4);

      if (availableNGO && availableVolunteer) {
        const deliverable = Math.min(batchMealsRemaining, availableNGO.remainingDemand);
        const tripDistance = parseFloat((avgDistance * (0.7 + Math.random() * 0.6)).toFixed(1));

        availableNGO.allocatedMeals += deliverable;
        availableNGO.remainingDemand -= deliverable;
        availableNGO.acceptedBatches += 1;

        availableVolunteer.deliveriesDone += 1;
        availableVolunteer.mealsTransported += deliverable;
        availableVolunteer.totalKmTravelled += tripDistance;

        totalMealsAllocated += deliverable;
        totalDeliveries += 1;
        totalDistanceCovered += tripDistance;
        batchMealsRemaining -= deliverable;

        allocationLedger.push({
          dispatchId: `DISPATCH-${String(totalDeliveries).padStart(3, '0')}`,
          batchId: batch.id,
          category: batch.category,
          donor: batch.donor,
          ngo: availableNGO.name,
          volunteer: `${availableVolunteer.name} (${availableVolunteer.vehicle})`,
          meals: deliverable,
          distanceKm: tripDistance,
          status: 'Successfully Dispatched',
          estimatedTransitMinutes: Math.round(tripDistance * 3.2 + 10),
        });
      }

      if (batchMealsRemaining > 0) {
        totalMealsUnmatched += batchMealsRemaining;
        unrescuedBatches.push({
          batchId: batch.id,
          donor: batch.donor,
          unmatchedMeals: batchMealsRemaining,
          reason: availableNGO ? 'Volunteer fleet capacity bottleneck' : 'NGO receiving demand saturated',
        });
      }
    }

    // 5. Impact & Comparative Metrics
    const efficiencyRate = parseFloat(((totalMealsAllocated / surplusMeals) * 100).toFixed(1));
    const co2AvoidedKg = parseFloat((totalMealsAllocated * 0.45 * 2.5).toFixed(1));
    const baselineWastageKg = parseFloat((surplusMeals * 0.45).toFixed(1));
    const actualWastageKg = parseFloat((totalMealsUnmatched * 0.45).toFixed(1));
    const activeVolunteersCount = simulatedVolunteers.filter(v => v.deliveriesDone > 0).length;
    const volunteerUtilizationRate = parseFloat(((activeVolunteersCount / volunteerCount) * 100).toFixed(1));

    res.json({
      success: true,
      simulationParams: {
        surplusMeals,
        ngoCount,
        volunteerCount,
        donorLocations,
        avgDistance,
      },
      summary: {
        totalMealsInput: surplusMeals,
        totalMealsAllocated,
        totalMealsUnmatched,
        efficiencyRate,
        totalDeliveries,
        totalDistanceKm: parseFloat(totalDistanceCovered.toFixed(1)),
        co2AvoidedKg,
        baselineWastageKg,
        actualWastageKg,
        activeVolunteersCount,
        volunteerUtilizationRate,
      },
      ngoBreakdown: simulatedNGOs.map(n => ({
        name: n.name,
        allocated: n.allocatedMeals,
        targetDemand: n.allocatedMeals + n.remainingDemand,
        fillRate: Math.round((n.allocatedMeals / (n.allocatedMeals + n.remainingDemand || 1)) * 100),
      })),
      volunteerUtilization: simulatedVolunteers.map(v => ({
        name: v.name,
        deliveries: v.deliveriesDone,
        mealsTransported: v.mealsTransported,
        distanceKm: parseFloat(v.totalKmTravelled.toFixed(1)),
      })),
      allocationLedger: allocationLedger.slice(0, 50),
      unrescuedBatches: unrescuedBatches.slice(0, 10),
      bottleneckAnalysis: [
        totalMealsUnmatched > 0
          ? `${totalMealsUnmatched} surplus meals remained unallocated due to peak delivery fleet constraints.`
          : 'Zero food waste achieved! 100% of food rescued across all local NGO centers.',
        volunteerUtilizationRate > 85
          ? 'Volunteer fleet reached maximum operational capacity (Over 85% utilization).'
          : 'Volunteer fleet handled dispatch comfortably with capacity to spare.',
        `Average transit distance estimated at ${avgDistance} km with ${totalDeliveries} total multi-hop routes.`,
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { runSimulation };
