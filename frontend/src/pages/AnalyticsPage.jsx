import React from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  Leaf,
  Droplets,
  Utensils,
  IndianRupee,
  TrendingUp,
  Download,
  ShieldCheck,
  Building2,
  Bike,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { summaryMetrics, ngos, volunteers, donations } = useData();
  const { addToast } = useToast();

  const monthlyTrend = [
    { month: 'Jan', meals: 18400, co2: 20700 },
    { month: 'Feb', meals: 21200, co2: 23850 },
    { month: 'Mar', meals: 24500, co2: 27560 },
    { month: 'Apr', meals: 23100, co2: 25980 },
    { month: 'May', meals: 26800, co2: 30150 },
    { month: 'Jun', meals: 28450, co2: 32000 },
  ];

  const ngoLeaderboard = ngos.map((ngo) => ({
    name: ngo.organizationName.split(' ')[0] + ' ' + (ngo.organizationName.split(' ')[1] || ''),
    meals: ngo.totalMealsDistributed || 12000,
  })).sort((a, b) => b.meals - a.meals);

  const categoryShare = [
    { name: 'Cooked Meals', value: 42, color: '#10b981' },
    { name: 'Bakery', value: 24, color: '#3b82f6' },
    { name: 'Produce', value: 18, color: '#8b5cf6' },
    { name: 'Dairy', value: 12, color: '#f59e0b' },
    { name: 'Packaged', value: 4, color: '#06b6d4' },
  ];

  const handleExport = () => {
    addToast({
      title: 'Report Downloaded 📊',
      message: 'FoodRescue_AI_Impact_Summary_2026.csv generated successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sustainability & Impact Analytics
          </h1>
          <p className="mt-1 text-slate-500 text-xs">
            Comprehensive audit of food waste diverted from landfills, CO₂ emissions averted, and community hunger relief.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Environmental Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-emerald-800">Total Meals Rescued</span>
            <div className="p-2 rounded-xl bg-emerald-200 text-emerald-800">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            {summaryMetrics.totalMealsRescued.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">~12,800 kg food saved</p>
        </div>

        <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-teal-800">CO₂e Diverted</span>
            <div className="p-2 rounded-xl bg-teal-200 text-teal-800">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-950 mt-2">
            {summaryMetrics.co2SavedKg.toLocaleString()} kg
          </div>
          <p className="text-[11px] text-teal-700 mt-1">Methane reduction factor 2.5x</p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-blue-800">Virtual Water Saved</span>
            <div className="p-2 rounded-xl bg-blue-200 text-blue-800">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-950 mt-2">
            5,121,000 L
          </div>
          <p className="text-[11px] text-blue-700 mt-1">Agricultural irrigation equivalent</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-800">Community Value</span>
            <div className="p-2 rounded-xl bg-amber-200 text-amber-800">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">
            ₹1,422,500
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Direct food cost offset</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trajectory */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monthly Rescue Trajectory (2026)</h3>
              <p className="text-[11px] text-slate-400">Total portions rescued vs CO₂ averted (kg)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="meals" name="Meals Rescued" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                <Area type="monotone" dataKey="co2" name="CO₂e Avoided (kg)" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Shelter Distribution Leaderboard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Shelter Distribution Leaderboard</h3>
              <p className="text-[11px] text-slate-400">Cumulative meals absorbed per partner NGO</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ngoLeaderboard} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                <Bar dataKey="meals" name="Meals Distributed" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
