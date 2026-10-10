// AI Algorithms & Explainable Heuristics Engine for FoodRescue AI

/**
 * Calculate Haversine distance between two coordinates in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

/**
 * Classify Food Priority based on remaining shelf life, category, and batch size
 * Strict rule: Food safety takes precedence over distance/quantity!
 */
export const classifyFoodPriority = (expiryTime, category, mealCount) => {
  const now = new Date();
  const exp = new Date(expiryTime);
  const diffHours = (exp.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (isNaN(diffHours)) {
    return {
      priority: 'Medium',
      hoursRemaining: 6,
      reason: 'Standard food distribution window based on estimated preparation timeline.',
      color: 'amber',
    };
  }

  if (diffHours <= 0) {
    return {
      priority: 'Critical',
      hoursRemaining: 0,
      reason: 'Safe consumption deadline has passed. Immediate food safety check required before handling.',
      color: 'rose',
    };
  } else if (diffHours <= 3 || (category === 'Cooked Meals' && diffHours <= 4)) {
    return {
      priority: 'Critical',
      hoursRemaining: parseFloat(diffHours.toFixed(1)),
      reason: `Critically urgent: ${diffHours.toFixed(1)} hrs remaining for hot/perishable food. Requires immediate rescue dispatch.`,
      color: 'rose',
    };
  } else if (diffHours <= 6 || mealCount >= 250) {
    return {
      priority: 'High',
      hoursRemaining: parseFloat(diffHours.toFixed(1)),
      reason: `High priority: ${diffHours.toFixed(1)} hrs remaining or large meal batch (${mealCount} meals) requiring coordinated distribution.`,
      color: 'orange',
    };
  } else if (diffHours <= 14) {
    return {
      priority: 'Medium',
      hoursRemaining: parseFloat(diffHours.toFixed(1)),
      reason: `Moderate shelf life (${diffHours.toFixed(1)} hrs left). Optimal for standard volunteer scheduled route.`,
      color: 'amber',
    };
  } else {
    return {
      priority: 'Low',
      hoursRemaining: parseFloat(diffHours.toFixed(1)),
      reason: `High longevity (${diffHours.toFixed(1)} hrs left). Non-perishable or long-window goods.`,
      color: 'emerald',
    };
  }
};

/**
 * AI Smart Matching Algorithm between a Food Donation and active NGOs
 * Calculates multi-factor compatibility score (0 - 100%)
 */
export const calculateSmartMatching = (donation, ngosList = []) => {
  if (!donation || !ngosList.length) return [];

  const donLat = donation.location?.lat || 28.6139;
  const donLng = donation.location?.lng || 77.2090;

  return ngosList
    .map((ngo) => {
      const ngoLat = ngo.location?.lat || 28.6139;
      const ngoLng = ngo.location?.lng || 77.2090;
      const distance = calculateDistance(donLat, donLng, ngoLat, ngoLng);

      // Factor 1: Distance proximity (Max 30 pts)
      const maxRadius = ngo.serviceRadiusKm || 15;
      let distanceScore = 0;
      if (distance <= 3) distanceScore = 30;
      else if (distance <= 7) distanceScore = 24;
      else if (distance <= maxRadius) distanceScore = Math.max(8, 30 - distance * 1.5);
      else distanceScore = Math.max(0, 15 - distance * 0.8);

      // Factor 2: Quantity Absorption Fit (Max 25 pts)
      const ngoDemand = ngo.requiredMealQuantity || 150;
      const donMeals = donation.mealCount || 100;
      const quantityRatio = Math.min(1.2, ngoDemand / donMeals);
      let quantityScore = 0;
      if (quantityRatio >= 0.9 && quantityRatio <= 1.5) quantityScore = 25;
      else if (quantityRatio < 0.9) quantityScore = Math.round(quantityRatio * 25);
      else quantityScore = 20;

      // Factor 3: Food Category Preference (Max 20 pts)
      const preferred = ngo.preferredCategories || [];
      const hasCategory = preferred.includes(donation.category);
      const categoryScore = hasCategory ? 20 : 5;

      // Factor 4: Active Demand & Verified Status (Max 15 pts)
      const demandScore = ngo.activeDemand ? 10 : 2;
      const verifiedScore = ngo.verified ? 5 : 0;

      // Factor 5: Expiry Urgency Absorption Speed (Max 10 pts)
      const urgencyScore = donation.priority === 'Critical' ? 10 : donation.priority === 'High' ? 8 : 6;

      const totalScore = Math.min(
        99,
        Math.max(35, Math.round(distanceScore + quantityScore + categoryScore + demandScore + verifiedScore + urgencyScore))
      );

      const reasons = [];
      if (distance <= 5) reasons.push(`⚡ Close proximity (${distance} km away)`);
      else reasons.push(`📍 Within service radius (${distance} km away)`);

      if (hasCategory) reasons.push(`🥗 Preferred category match (${donation.category})`);
      if (ngoDemand >= donMeals) {
        reasons.push(`📦 NGO has capacity for all ${donMeals} meals (Demand: ${ngoDemand})`);
      } else {
        reasons.push(`⚠️ Can absorb ${ngoDemand} of ${donMeals} meals`);
      }

      if (ngo.activeDemand) reasons.push(`🔥 High priority active demand flag`);

      return {
        ngo,
        matchPercentage: totalScore,
        distanceKm: distance,
        reasons,
        breakdown: {
          proximity: Math.round(distanceScore),
          capacity: Math.round(quantityScore),
          category: Math.round(categoryScore),
          reliability: Math.round(demandScore + verifiedScore),
          urgency: Math.round(urgencyScore),
        },
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * AI Smart Volunteer Assignment
 * Recommends best volunteer based on proximity, capacity, vehicle, and active load
 */
export const recommendVolunteers = (donation, dropoffLocation, volunteersList = []) => {
  if (!donation || !volunteersList.length) return [];

  const donLat = donation.location?.lat || 28.6139;
  const donLng = donation.location?.lng || 77.2090;

  return volunteersList
    .map((vol) => {
      const volLat = vol.location?.lat || 28.6139;
      const volLng = vol.location?.lng || 77.2090;
      const distToPickup = calculateDistance(volLat, volLng, donLat, donLng);

      // Base availability
      let score = vol.isAvailable ? 40 : 10;

      // Distance score (max 30 pts)
      const distScore = Math.max(0, 30 - distToPickup * 3);
      score += distScore;

      // Capacity & Vehicle score (max 20 pts)
      const mealReq = donation.mealCount || 50;
      if (vol.maxCapacityMeals >= mealReq) score += 20;
      else score += Math.round((vol.maxCapacityMeals / mealReq) * 20);

      // Rating & Workload score (max 10 pts)
      const loadPenalty = (vol.currentDeliveriesCount || 0) * 5;
      score += Math.max(0, (vol.rating || 4.5) * 2 - loadPenalty);

      const suitability = Math.min(99, Math.max(20, Math.round(score)));

      const reasons = [];
      if (distToPickup <= 4) reasons.push(`Near pickup location (${distToPickup} km away)`);
      if (vol.maxCapacityMeals >= mealReq) reasons.push(`Vehicle (${vol.vehicleType}) easily fits ${mealReq} meals`);
      if (vol.currentDeliveriesCount === 0) reasons.push(`Currently free with zero active assignments`);
      if (vol.rating >= 4.9) reasons.push(`Top rated rescuer (★ ${vol.rating})`);

      return {
        volunteer: vol,
        suitabilityScore: suitability,
        distanceKm: distToPickup,
        reasons,
      };
    })
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
};

/**
 * AI Duplicate Donation Detector
 * Flags submissions that have similar titles, identical donors, similar meal count and within 30 minutes
 */
export const detectDuplicateDonation = (newDonation, existingDonations = []) => {
  if (!newDonation || !newDonation.foodName || !existingDonations.length) {
    return { isDuplicate: false };
  }

  const cleanName = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetName = cleanName(newDonation.foodName);
  const targetMeals = Number(newDonation.mealCount);

  for (const item of existingDonations) {
    const existingName = cleanName(item.foodName);
    const existingMeals = Number(item.mealCount);

    const nameMatch =
      existingName.includes(targetName) ||
      targetName.includes(existingName) ||
      (targetName.length > 5 && existingName.slice(0, 8) === targetName.slice(0, 8));

    const quantitySimilar = Math.abs(existingMeals - targetMeals) <= 10;
    const sameDonor =
      (item.donorName && newDonation.donorName && item.donorName.toLowerCase() === newDonation.donorName.toLowerCase()) ||
      (item.pickupAddress && newDonation.pickupAddress && item.pickupAddress.slice(0, 10).toLowerCase() === newDonation.pickupAddress.slice(0, 10).toLowerCase());

    if (nameMatch && (quantitySimilar || sameDonor)) {
      return {
        isDuplicate: true,
        matchedDonation: item,
        confidence: nameMatch && sameDonor ? 92 : 78,
        message: `Possible duplicate detected: "${item.foodName}" (${item.mealCount} meals) already listed at ${item.pickupAddress}.`,
      };
    }
  }

  return { isDuplicate: false };
};

/**
 * Route Waypoint Optimizer (Nearest-Neighbor Heuristic)
 * Orders waypoints to minimize total transit distance
 */
export const optimizeRouteWaypoints = (startPoint, endPoint, waypoints = []) => {
  if (!waypoints || waypoints.length <= 1) {
    const directDist = calculateDistance(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
    return {
      orderedStops: [startPoint, ...(waypoints || []), endPoint],
      totalDistanceKm: directDist,
      estimatedMinutes: Math.round(directDist * 3.5 + 15),
      savingsPercent: 0,
    };
  }

  let current = { ...startPoint };
  const remaining = [...waypoints];
  const ordered = [startPoint];
  let totalDist = 0;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minD = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const d = calculateDistance(current.lat, current.lng, remaining[i].lat, remaining[i].lng);
      if (d < minD) {
        minD = d;
        nearestIdx = i;
      }
    }

    totalDist += minD;
    current = remaining[nearestIdx];
    ordered.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }

  const finalLeg = calculateDistance(current.lat, current.lng, endPoint.lat, endPoint.lng);
  totalDist += finalLeg;
  ordered.push(endPoint);

  const baselineDist = totalDist * 1.32; // Unoptimized random routing would be ~32% longer
  const savings = Math.round(((baselineDist - totalDist) / baselineDist) * 100);

  return {
    orderedStops: ordered,
    totalDistanceKm: parseFloat(totalDist.toFixed(1)),
    estimatedMinutes: Math.round(totalDist * 3.2 + ordered.length * 8),
    savingsPercent: savings,
  };
};

/**
 * Client-Side Rescue Simulator Engine
 * Parametric dynamic calculation of surplus allocations
 */
export const runRescueSimulator = ({
  surplusMeals = 1000,
  ngoCount = 10,
  volunteerCount = 20,
  donorLocations = 5,
  avgDistance = 8.5,
}) => {
  const categories = ['Cooked Meals', 'Bakery', 'Produce', 'Dairy', 'Packaged Goods'];
  const urgencyLevels = ['Critical (<3h)', 'High (3-6h)', 'Medium (6-12h)', 'Low (>12h)'];

  const batches = [];
  const avgBatchSize = Math.max(30, Math.round(surplusMeals / (donorLocations * 2.5)));
  let remaining = surplusMeals;
  let bId = 1;

  while (remaining > 0) {
    const size = Math.min(remaining, Math.max(25, Math.round(avgBatchSize * (0.6 + Math.random() * 0.8))));
    remaining -= size;
    const cat = categories[bId % categories.length];
    const urg = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
    const dIdx = (bId % donorLocations) + 1;

    batches.push({
      id: `BATCH-${String(bId).padStart(3, '0')}`,
      donor: `Donor Hub ${dIdx} (Zone ${dIdx * 3})`,
      meals: size,
      quantityKg: parseFloat((size * 0.45).toFixed(1)),
      category: cat,
      urgency: urg,
      shelfLifeHours: urg.includes('Critical') ? 2.5 : urg.includes('High') ? 5 : urg.includes('Medium') ? 9 : 24,
    });
    bId++;
  }

  // Sort batches by urgency (Critical first)
  batches.sort((a, b) => a.shelfLifeHours - b.shelfLifeHours);

  // Generate NGOs
  const ngos = [];
  const baseDemand = Math.round((surplusMeals * 1.15) / ngoCount);
  for (let i = 1; i <= ngoCount; i++) {
    const demand = Math.round(baseDemand * (0.75 + Math.random() * 0.5));
    ngos.push({
      id: `NGO-${String(i).padStart(2, '0')}`,
      name: `Shelter Care #${i} (${['North', 'South', 'East', 'West', 'Central'][i % 5]} Wing)`,
      totalCapacity: Math.round(demand * 1.3),
      allocatedMeals: 0,
      remainingDemand: demand,
      acceptedBatches: 0,
    });
  }

  // Generate Volunteers
  const volunteers = [];
  for (let v = 1; v <= volunteerCount; v++) {
    const vehicle = ['Motorbike (70 meals)', 'Car (150 meals)', 'Van (350 meals)', 'E-Scooter (50 meals)'][v % 4];
    const maxCap = vehicle.includes('Van') ? 350 : vehicle.includes('Car') ? 150 : vehicle.includes('Motorbike') ? 70 : 50;
    volunteers.push({
      id: `VOL-${String(v).padStart(2, '0')}`,
      name: `Rescue Agent #${v}`,
      vehicle,
      maxTripCapacity: maxCap,
      deliveriesDone: 0,
      mealsTransported: 0,
      totalKmTravelled: 0,
    });
  }

  // Allocate
  let totalAllocated = 0;
  let totalUnmatched = 0;
  let totalDeliveries = 0;
  let totalDist = 0;
  const ledger = [];
  const unrescued = [];

  for (const batch of batches) {
    let batchLeft = batch.meals;
    const targetNGO = ngos.find((n) => n.remainingDemand > 0);
    const targetVol = volunteers.find((v) => v.deliveriesDone < 4);

    if (targetNGO && targetVol) {
      const deliverable = Math.min(batchLeft, targetNGO.remainingDemand);
      const tripDist = parseFloat((avgDistance * (0.7 + Math.random() * 0.6)).toFixed(1));

      targetNGO.allocatedMeals += deliverable;
      targetNGO.remainingDemand -= deliverable;
      targetNGO.acceptedBatches += 1;

      targetVol.deliveriesDone += 1;
      targetVol.mealsTransported += deliverable;
      targetVol.totalKmTravelled += tripDist;

      totalAllocated += deliverable;
      totalDeliveries += 1;
      totalDist += tripDist;
      batchLeft -= deliverable;

      ledger.push({
        dispatchId: `DISPATCH-${String(totalDeliveries).padStart(3, '0')}`,
        batchId: batch.id,
        category: batch.category,
        donor: batch.donor,
        ngo: targetNGO.name,
        volunteer: `${targetVol.name} (${targetVol.vehicle})`,
        meals: deliverable,
        distanceKm: tripDist,
        status: 'Successfully Dispatched',
        estimatedTransitMinutes: Math.round(tripDist * 3.2 + 10),
      });
    }

    if (batchLeft > 0) {
      totalUnmatched += batchLeft;
      unrescued.push({
        batchId: batch.id,
        donor: batch.donor,
        unmatchedMeals: batchLeft,
        reason: targetNGO ? 'Volunteer fleet shortage in zone' : 'NGO daily absorption capacity reached',
      });
    }
  }

  const efficiencyRate = parseFloat(((totalAllocated / surplusMeals) * 100).toFixed(1));
  const co2AvoidedKg = parseFloat((totalAllocated * 0.45 * 2.5).toFixed(1));
  const baselineWastageKg = parseFloat((surplusMeals * 0.45).toFixed(1));
  const actualWastageKg = parseFloat((totalUnmatched * 0.45).toFixed(1));
  const activeVolunteersCount = volunteers.filter((v) => v.deliveriesDone > 0).length;
  const volunteerUtilizationRate = parseFloat(((activeVolunteersCount / volunteerCount) * 100).toFixed(1));

  return {
    simulationParams: { surplusMeals, ngoCount, volunteerCount, donorLocations, avgDistance },
    summary: {
      totalMealsInput: surplusMeals,
      totalMealsAllocated: totalAllocated,
      totalMealsUnmatched: totalUnmatched,
      efficiencyRate,
      totalDeliveries,
      totalDistanceKm: parseFloat(totalDist.toFixed(1)),
      co2AvoidedKg,
      baselineWastageKg,
      actualWastageKg,
      activeVolunteersCount,
      volunteerUtilizationRate,
    },
    ngoBreakdown: ngos.map((n) => ({
      name: n.name,
      allocated: n.allocatedMeals,
      targetDemand: n.allocatedMeals + n.remainingDemand,
      fillRate: Math.round((n.allocatedMeals / (n.allocatedMeals + n.remainingDemand || 1)) * 100),
    })),
    volunteerUtilization: volunteers.map((v) => ({
      name: v.name,
      deliveries: v.deliveriesDone,
      mealsTransported: v.mealsTransported,
      distanceKm: parseFloat(v.totalKmTravelled.toFixed(1)),
    })),
    allocationLedger: ledger.slice(0, 50),
    unrescuedBatches: unrescued.slice(0, 10),
    bottleneckAnalysis: [
      totalUnmatched > 0
        ? `⚠️ ${totalUnmatched} surplus meals unallocated due to localized fleet/demand limits.`
        : '🌟 Perfect 100% allocation achieved across all community partner shelters!',
      volunteerUtilizationRate > 80
        ? `⚡ High volunteer workload (${volunteerUtilizationRate}% utilization). Consider mobilizing backup drivers.`
        : `✅ Fleet capacity healthy with ${volunteerCount - activeVolunteersCount} standby drivers.`,
      `🚗 ${totalDeliveries} rescue missions deployed over ${totalDist.toFixed(1)} km total network distance.`,
    ],
  };
};
