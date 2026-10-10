import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  calculateSmartMatching,
  classifyFoodPriority,
  optimizeRouteWaypoints,
} from '../utils/aiAlgorithms';
import { PriorityBadge } from '../components/common/Badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  Cpu,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Navigation,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Layers,
  Building2,
  Sliders,
} from 'lucide-react';

export const AIMatchingPage = () => {
  const { donations, ngos, matchDonationWithNGO } = useData();
  const { addToast } = useToast();

  // Active Donation Selection for Matchmaker Tester
  const [selectedDonationId, setSelectedDonationId] = useState(
    donations[0]?._id || ''
  );

  // Food Priority Sandbox State
  const [sandboxCategory, setSandboxCategory] = useState('Cooked Meals');
  const [sandboxHours, setSandboxHours] = useState(2.5);
  const [sandboxPortions, setSandboxPortions] = useState(150);

  // Route Optimizer Sandbox Waypoints
  const [routeOptimizationResult, setRouteOptimizationResult] = useState(() => {
    return optimizeRouteWaypoints(
      { name: 'Start: Green Feast Caterers', lat: 28.6315, lng: 77.2167 },
      { name: 'End: Hope Food Shelter', lat: 28.6420, lng: 77.2140 },
      [
        { name: 'Stop 1: Grand Royale Pastry Kitchen', lat: 28.6289, lng: 77.2285 },
        { name: 'Stop 2: FarmFresh Khan Market', lat: 28.6002, lng: 77.2274 },
        { name: 'Stop 3: MilkyWay Parlour', lat: 28.5733, lng: 77.2310 },
      ]
    );
  });

  // Demand Forecast Data
  const forecastData = [
    { day: 'Mon', projectedSurplus: 3400, expectedDemand: 3800, risk: 'Low' },
    { day: 'Tue', projectedSurplus: 3700, expectedDemand: 3900, risk: 'Low' },
    { day: 'Wed', projectedSurplus: 4200, expectedDemand: 4300, risk: 'Medium' },
    { day: 'Thu', projectedSurplus: 4100, expectedDemand: 4200, risk: 'Low' },
    { day: 'Fri (Weekend Eve)', projectedSurplus: 5300, expectedDemand: 5100, risk: 'Surplus Surge' },
    { day: 'Sat (Weddings/Banquet)', projectedSurplus: 6800, expectedDemand: 6500, risk: 'Peak Emergency' },
    { day: 'Sun (Sunday Feasts)', projectedSurplus: 6200, expectedDemand: 6000, risk: 'High Surplus' },
  ];

  const currentDonation = donations.find((d) => d._id === selectedDonationId) || donations[0];
  const matches = currentDonation ? calculateSmartMatching(currentDonation, ngos) : [];
  const topMatches = matches.slice(0, 3);

  // Live Sandbox Priority calculation
  const sandboxExpiry = new Date(Date.now() + sandboxHours * 60 * 60 * 1000).toISOString();
  const sandboxPriority = classifyFoodPriority(sandboxExpiry, sandboxCategory, sandboxPortions);

  const handleApplyMatch = async (ngo) => {
    if (!currentDonation) return;
    await matchDonationWithNGO(currentDonation._id, ngo);
    addToast({
      title: 'Match Established! 🎯',
      message: `"${currentDonation.foodName}" successfully routed to ${ngo.organizationName}.`,
      type: 'success',
      triggerConfetti: true,
    });
  };

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Explainable Algorithmic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Food Rescue Command Center
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Transparent heuristic models optimizing food safety triage, multi-criteria shelter matching, route efficiency, and seasonal surplus forecasting.
          </p>
        </div>
      </div>

      {/* SECTION 1: Interactive Smart Matchmaker Tester */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Smart Donor–NGO Matchmaker Engine</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Evaluates proximity (30%), absorption capacity (25%), category compatibility (20%), and urgency (10%).
            </p>
          </div>

          {/* Select Target Donation */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Select Food Batch:</span>
            <select
              value={selectedDonationId}
              onChange={(e) => setSelectedDonationId(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-hidden max-w-xs truncate"
            >
              {donations.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.foodName} ({d.mealCount} meals)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Donation Overview */}
        {currentDonation && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentDonation.imageUrl}
                alt={currentDonation.foodName}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{currentDonation.foodName}</h4>
                  <PriorityBadge priority={currentDonation.priority} size="xs" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {currentDonation.mealCount} portions • Category: <strong>{currentDonation.category}</strong> • 📍 {currentDonation.pickupAddress}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
              <div className="font-bold text-slate-800">{currentDonation.status}</div>
            </div>
          </div>
        )}

        {/* Top 3 Scored Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topMatches.map((item, idx) => (
            <div
              key={item.ngo._id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                idx === 0
                  ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30 shadow-xs'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                    Rank #{idx + 1}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-600 leading-none">
                      {item.matchPercentage}%
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Match</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-xs leading-snug">
                  {item.ngo.organizationName}
                </h4>
                <div className="text-slate-500 text-[11px] mt-1 space-y-0.5">
                  <p>📍 {item.distanceKm} km away</p>
                  <p>Daily Demand: <strong>{item.ngo.requiredMealQuantity} meals</strong></p>
                </div>

                {/* Reasons list */}
                <div className="mt-3 space-y-1 pt-2 border-t border-slate-100">
                  {item.reasons.map((r, i) => (
                    <div key={i} className="text-[10px] text-slate-600 flex items-start gap-1">
                      <span>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleApplyMatch(item.ngo)}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
                >
                  <span>Dispatch to this Shelter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Food Priority & Safety Classifier Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Food Safety Priority Classifier Sandbox</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                Safety-First Rule
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Test how remaining safe consumption hours and batch size affect emergency classification.
            </p>

            {/* Interactive Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Food Category:</label>
                <select
                  value={sandboxCategory}
                  onChange={(e) => setSandboxCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-white text-slate-800 focus:border-rose-500 focus:outline-hidden"
                >
                  <option value="Cooked Meals">Cooked Meals (Perishable Buffet)</option>
                  <option value="Dairy">Dairy (Cold-chain required)</option>
                  <option value="Bakery">Bakery (Moderate stability)</option>
                  <option value="Produce">Produce & Vegetables</option>
                  <option value="Packaged Goods">Packaged Sealed Goods</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Hours Until Expiry:</span>
                  <span className="text-rose-600">{sandboxHours} hours</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={sandboxHours}
                  onChange={(e) => setSandboxHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Portion Size (Meals):</span>
                  <span className="text-slate-800">{sandboxPortions} portions</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={sandboxPortions}
                  onChange={(e) => setSandboxPortions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Real-time Output preview */}
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700">Calculated Priority Output:</span>
              <PriorityBadge priority={sandboxPriority.priority} size="sm" />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {sandboxPriority.reason}
            </p>
          </div>
        </div>

        {/* SECTION 3: Route Waypoint Optimizer Heuristic */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-600" />
                <span>Multi-Stop Route Optimizer (TSP Heuristic)</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                {routeOptimizationResult.savingsPercent}% Distance Saved
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Nearest-neighbor algorithm ordering multi-point collection routes for volunteer couriers.
            </p>

            <div className="space-y-2.5">
              {routeOptimizationResult.orderedStops.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    idx === 0
                      ? 'bg-emerald-600 text-white'
                      : idx === routeOptimizationResult.orderedStops.length - 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-slate-800 truncate">{stop.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100">
              <div className="text-base font-black text-teal-800">{routeOptimizationResult.totalDistanceKm} km</div>
              <div className="text-[10px] text-teal-600">Total Route Distance</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-base font-black text-blue-800">{routeOptimizationResult.estimatedMinutes} mins</div>
              <div className="text-[10px] text-blue-600">Estimated Mission Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Food Demand Forecast Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>AI Simulated Surplus & Demand Forecaster</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Historical simulated projections based on banquet calendars and weekend events.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-800 text-[10px] font-bold">
            Next 7-Day Horizon
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="projectedSurplus" name="Projected Surplus (Meals)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expectedDemand" name="Expected Shelter Demand (Meals)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
