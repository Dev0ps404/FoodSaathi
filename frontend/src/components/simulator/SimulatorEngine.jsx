import React, { useState, useEffect } from 'react';
import { runRescueSimulator } from '../../utils/aiAlgorithms';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Utensils,
  Building2,
  Bike,
  Navigation,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Zap,
  Sliders,
  TrendingUp,
} from 'lucide-react';

const simulationPresets = [
  {
    name: 'Standard Daily Operations',
    surplusMeals: 1000,
    ngoCount: 10,
    volunteerCount: 20,
    donorLocations: 5,
    avgDistance: 8.5,
  },
  {
    name: 'Mega Banquet Surge (Wedding Feast)',
    surplusMeals: 3500,
    ngoCount: 18,
    volunteerCount: 35,
    donorLocations: 12,
    avgDistance: 12.0,
  },
  {
    name: 'Severe Courier Shortage (Stress Test)',
    surplusMeals: 2000,
    ngoCount: 15,
    volunteerCount: 6,
    donorLocations: 8,
    avgDistance: 15.0,
  },
  {
    name: 'Localized Urban Micro-Rescue',
    surplusMeals: 500,
    ngoCount: 5,
    volunteerCount: 12,
    donorLocations: 3,
    avgDistance: 4.2,
  },
];

export const SimulatorEngine = () => {
  const { addToast } = useToast();

  // Config parameters
  const [params, setParams] = useState({
    surplusMeals: 1000,
    ngoCount: 10,
    volunteerCount: 20,
    donorLocations: 5,
    avgDistance: 8.5,
  });

  // Simulation execution state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Run simulation on mount once with default config
  useEffect(() => {
    const initialRun = runRescueSimulator(params);
    setSimulationResults(initialRun);
  }, []);

  const stageLabels = [
    'Stage 1/5: Ingesting Donor Surplus & Generating Location Hubs...',
    'Stage 2/5: AI Priority Triage & Expiry Countdown Sorting...',
    'Stage 3/5: Matching Food Categories to NGO Demand Capacities...',
    'Stage 4/5: Dispatching Volunteer Couriers & Computing Transit Routes...',
    'Stage 5/5: Synthesizing Carbon Savings & Bottleneck Analytics...',
  ];

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setCurrentStage(0);

    // Multi-stage visual progression animation
    for (let i = 0; i < 5; i++) {
      setCurrentStage(i);
      await new Promise((r) => setTimeout(r, 350));
    }

    try {
      // Try backend simulator first, fallback to client engine
      let results;
      try {
        const res = await api.post('/simulator/run', params);
        if (res.data?.success) results = res.data;
      } catch (e) {
        // use client-side deterministic engine
      }

      if (!results) {
        results = runRescueSimulator(params);
      }

      setSimulationResults(results);
      setIsRunning(false);

      addToast({
        title: 'Simulation Complete! 🚀',
        message: `Allocated ${results.summary.totalMealsAllocated.toLocaleString()} of ${results.summary.totalMealsInput.toLocaleString()} meals with ${results.summary.efficiencyRate}% efficiency.`,
        type: 'success',
        triggerConfetti: true,
      });
    } catch (err) {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const defaultParams = {
      surplusMeals: 1000,
      ngoCount: 10,
      volunteerCount: 20,
      donorLocations: 5,
      avgDistance: 8.5,
    };
    setParams(defaultParams);
    const results = runRescueSimulator(defaultParams);
    setSimulationResults(results);
    addToast({ title: 'Simulator Reset', message: 'Parameters restored to defaults.', type: 'info' });
  };

  const applyPreset = (preset) => {
    const newParams = {
      surplusMeals: preset.surplusMeals,
      ngoCount: preset.ngoCount,
      volunteerCount: preset.volunteerCount,
      donorLocations: preset.donorLocations,
      avgDistance: preset.avgDistance,
    };
    setParams(newParams);
    const results = runRescueSimulator(newParams);
    setSimulationResults(results);
  };

  // Filter ledger
  const filteredLedger = simulationResults?.allocationLedger?.filter((item) => {
    if (!ledgerSearch) return true;
    const s = ledgerSearch.toLowerCase();
    return (
      item.dispatchId.toLowerCase().includes(s) ||
      item.donor.toLowerCase().includes(s) ||
      item.ngo.toLowerCase().includes(s) ||
      item.volunteer.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s)
    );
  }) || [];

  const summary = simulationResults?.summary;

  // Donut chart data for Meals Allocated vs Unmatched
  const pieData = summary
    ? [
        { name: 'Meals Rescued', value: summary.totalMealsAllocated, color: '#10b981' },
        { name: 'Meals Unmatched', value: summary.totalMealsUnmatched, color: '#ef4444' },
      ]
    : [];

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Flagship Title & Description */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Flagship Interactive AI Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Parametric Food Rescue Simulator
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Stress-test emergency food redistribution at scale. Configure surplus meal volumes, shelter capacities, volunteer fleet sizes, and geographical spread to simulate real-time algorithmic matching.
          </p>

          {/* Quick Scenario Presets */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Load Presets:
            </span>
            {simulationPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-800 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 text-[11px] font-medium transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel Grid (Configuration Sliders) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2 font-black text-sm text-slate-900">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Simulation Parameters</span>
          </div>
          <span className="text-[11px] text-slate-600">
            Dynamically recalculates all rescue routes & metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Surplus Meals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                Surplus Meals
              </label>
              <span className="font-black text-emerald-700 text-sm">{params.surplusMeals.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={params.surplusMeals}
              onChange={(e) => setParams({ ...params, surplusMeals: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>100</span>
              <span>2,500</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Number of NGOs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                Partner NGOs
              </label>
              <span className="font-black text-purple-700 text-sm">{params.ngoCount}</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={params.ngoCount}
              onChange={(e) => setParams({ ...params, ngoCount: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>2</span>
              <span>15</span>
              <span>30</span>
            </div>
          </div>

          {/* Volunteer Couriers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-blue-600" />
                Volunteers
              </label>
              <span className="font-black text-blue-700 text-sm">{params.volunteerCount}</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={params.volunteerCount}
              onChange={(e) => setParams({ ...params, volunteerCount: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>2</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Donor Hubs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Donor Hubs
              </label>
              <span className="font-black text-amber-700 text-sm">{params.donorLocations}</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={params.donorLocations}
              onChange={(e) => setParams({ ...params, donorLocations: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>1</span>
              <span>8</span>
              <span>15</span>
            </div>
          </div>

          {/* Average Radius (km) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                Avg Distance
              </label>
              <span className="font-black text-teal-700 text-sm">{params.avgDistance} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="0.5"
              value={params.avgDistance}
              onChange={(e) => setParams({ ...params, avgDistance: Number(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>2 km</span>
              <span>15 km</span>
              <span>30 km</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'Simulating Algorithm...' : 'Run Real-Time Simulation'}</span>
          </button>
        </div>

        {/* Animated Phase Progress bar */}
        {isRunning && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-800 text-xs">
                {stageLabels[currentStage]}
              </span>
              <span className="font-mono font-bold text-emerald-600">
                {((currentStage + 1) * 20)}%
              </span>
            </div>
            <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStage + 1) * 20}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Simulation Results Output Section */}
      {summary && (
        <div className="space-y-6 animate-fade-in">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Meals Rescued</span>
              <div className="text-xl font-black text-emerald-800 mt-1">
                {summary.totalMealsAllocated.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600">of {summary.totalMealsInput} input</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500">Unmatched Waste</span>
              <div className={`text-xl font-black mt-1 ${summary.totalMealsUnmatched > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {summary.totalMealsUnmatched.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">bottleneck meals</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <span className="text-[10px] font-bold uppercase text-teal-700">Efficiency Rate</span>
              <div className="text-xl font-black text-teal-800 mt-1">
                {summary.efficiencyRate}%
              </div>
              <span className="text-[10px] text-teal-600">allocation success</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold uppercase text-blue-700">Courier Missions</span>
              <div className="text-xl font-black text-blue-800 mt-1">
                {summary.totalDeliveries}
              </div>
              <span className="text-[10px] text-blue-600">{summary.volunteerUtilizationRate}% fleet active</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] font-bold uppercase text-purple-700">Network Distance</span>
              <div className="text-xl font-black text-purple-800 mt-1">
                {summary.totalDistanceKm} km
              </div>
              <span className="text-[10px] text-purple-600">total transit</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-700">CO₂ Avoided</span>
              <div className="text-xl font-black text-amber-800 mt-1">
                {summary.co2AvoidedKg.toLocaleString()} kg
              </div>
              <span className="text-[10px] text-amber-600">greenhouse gas</span>
            </div>
          </div>

          {/* Before & After Comparison Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="font-black text-sm text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Before vs. After Scenario Comparison</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="font-bold text-rose-800 text-xs flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Without FoodRescue AI (Baseline Scenario)</span>
                </div>
                <div className="space-y-1 text-slate-700 text-xs">
                  <p>• <strong>{summary.baselineWastageKg} kg</strong> of surplus food dumped in municipal landfill</p>
                  <p>• <strong>{summary.totalMealsInput} meals</strong> lost to spoilage</p>
                  <p>• <strong>0</strong> hungry individuals fed from event surplus</p>
                  <p>• Severe methane decomposition footprint</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="font-bold text-emerald-800 text-xs flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>With FoodRescue AI Redistribution</span>
                </div>
                <div className="space-y-1 text-slate-700 text-xs">
                  <p>• <strong>{summary.totalMealsAllocated} meals ({parseFloat((summary.totalMealsAllocated * 0.45).toFixed(1))} kg)</strong> immediately redistributed</p>
                  <p>• <strong>{summary.co2AvoidedKg} kg CO₂e</strong> carbon footprint averted</p>
                  <p>• <strong>{summary.totalDeliveries} optimized multi-drop routes</strong> completed</p>
                  <p>• <strong>{summary.efficiencyRate}% overall rescue efficiency</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row: NGO Allocation Chart & Fleet Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NGO Allocation Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-bold text-xs text-slate-800 mb-4 flex items-center justify-between">
                <span>NGO Shelter Capacity & Absorption</span>
                <span className="text-slate-400 font-normal">Meals Allocated vs Demand</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulationResults.ngoBreakdown.slice(0, 8)}>
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="allocated" name="Meals Rescued" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="targetDemand" name="Target Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Allocation Efficiency Donut & Bottlenecks */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="font-bold text-xs text-slate-800 mb-3">
                  Distribution Breakdown & AI Diagnostic
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Allocated:
                      </span>
                      <span className="font-black">{summary.totalMealsAllocated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-rose-700 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        Unmatched:
                      </span>
                      <span className="font-black">{summary.totalMealsUnmatched}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      Overall Efficiency: <strong>{summary.efficiencyRate}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Bullet list */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Bottleneck Diagnostics:</span>
                </div>
                {simulationResults.bottleneckAnalysis?.map((note, i) => (
                  <p key={i} className="text-[11px] text-slate-600 leading-relaxed">• {note}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Dispatch Ledger Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Simulated Dispatch Ledger ({simulationResults.allocationLedger?.length} Trips)</span>
                </h3>
                <p className="text-[11px] text-slate-400">Step-by-step route and courier dispatch sequence</p>
              </div>

              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search ledger by NGO, Donor, or Courier..."
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2.5">Dispatch ID</th>
                    <th className="px-3 py-2.5">Donor Location</th>
                    <th className="px-3 py-2.5">Target Shelter</th>
                    <th className="px-3 py-2.5">Courier & Vehicle</th>
                    <th className="px-3 py-2.5">Portions</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Distance & ETA</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLedger.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="px-3 py-2 font-mono font-bold text-emerald-700">{item.dispatchId}</td>
                      <td className="px-3 py-2 font-semibold text-slate-800">{item.donor}</td>
                      <td className="px-3 py-2 font-medium text-purple-700">{item.ngo}</td>
                      <td className="px-3 py-2 text-slate-600">{item.volunteer}</td>
                      <td className="px-3 py-2 font-bold text-slate-900">{item.meals} meals</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {item.distanceKm} km ({item.estimatedTransitMinutes} mins)
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Dispatched
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
