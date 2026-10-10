import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { FreshnessTimer } from '../components/common/FreshnessTimer';
import { DonationFormModal } from '../components/donations/DonationFormModal';
import { MatchingModal } from '../components/ai/MatchingModal';
import { DuplicateWarningModal } from '../components/donations/DuplicateWarningModal';
import { DonationDetailModal } from '../components/donations/DonationDetailModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Utensils,
  Building2,
  Bike,
  Truck,
  AlertTriangle,
  Sparkles,
  PlusCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, role } = useAuth();
  const { summaryMetrics, donations, ngos, volunteers, deliveries } = useData();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDonationForMatch, setSelectedDonationForMatch] = useState(null);
  const [selectedDonationForDetail, setSelectedDonationForDetail] = useState(null);
  const [duplicateModalData, setDuplicateModalData] = useState(null);

  // Weekly Trend Chart Data
  const weeklyData = [
    { day: 'Mon', rescued: 3200, target: 2800 },
    { day: 'Tue', rescued: 3850, target: 3000 },
    { day: 'Wed', rescued: 4100, target: 3500 },
    { day: 'Thu', rescued: 3900, target: 3500 },
    { day: 'Fri', rescued: 4800, target: 4000 },
    { day: 'Sat', rescued: 5600, target: 4500 },
    { day: 'Sun', rescued: 5900, target: 4800 },
  ];

  // Category Distribution for Donut Chart
  const categoryData = [
    { name: 'Cooked Meals', value: 42, color: '#10b981' },
    { name: 'Bakery', value: 24, color: '#3b82f6' },
    { name: 'Produce', value: 18, color: '#8b5cf6' },
    { name: 'Dairy', value: 12, color: '#f59e0b' },
    { name: 'Packaged', value: 4, color: '#06b6d4' },
  ];

  // Urgent Critical Donations
  const urgentDonations = donations.filter(
    (d) => d.priority === 'Critical' && d.status === 'Available'
  );

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Rescuer'}!
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
              {role} View
            </span>
          </div>
          <p className="mt-1 text-slate-500 text-xs">
            {role === 'donor'
              ? 'List surplus food and monitor real-time AI matchmaking and courier pickups.'
              : role === 'ngo'
              ? 'Track incoming meal distributions and manage daily shelter food demands.'
              : role === 'volunteer'
              ? 'View assigned rescue dispatches and report delivery handoffs.'
              : 'Network oversight: real-time algorithmic food rescue operations across metro hubs.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Surplus</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Meals Rescued"
          value={summaryMetrics.totalMealsRescued.toLocaleString()}
          subtitle="Total community portions"
          icon={Utensils}
          trend="+18.4%"
          colorScheme="emerald"
        />
        <StatCard
          title="Available Food"
          value={summaryMetrics.availableDonationsCount}
          subtitle="Ready for pickup"
          icon={Layers}
          colorScheme="teal"
        />
        <StatCard
          title="Active NGOs"
          value={summaryMetrics.activeNGOsCount}
          subtitle="Receiving shelters"
          icon={Building2}
          colorScheme="purple"
        />
        <StatCard
          title="Volunteers"
          value={summaryMetrics.availableVolunteersCount}
          subtitle="Active on roads"
          icon={Bike}
          colorScheme="blue"
        />
        <StatCard
          title="Urgent Alerts"
          value={summaryMetrics.urgentDonationsCount}
          subtitle="Under 3h shelf life"
          icon={AlertTriangle}
          colorScheme="rose"
        />
        <StatCard
          title="Deliveries"
          value={summaryMetrics.activeDeliveriesCount}
          subtitle="En-route right now"
          icon={Truck}
          colorScheme="amber"
        />
      </div>

      {/* Critical Food Alerts Ticker Banner (If any urgent food exists) */}
      {urgentDonations.length > 0 && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <h3 className="font-bold text-sm text-rose-900">
                Critical Food Rescues Required ({urgentDonations.length})
              </h3>
            </div>
            <span className="text-[11px] text-rose-700 font-semibold">Immediate action recommended</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentDonations.map((item) => (
              <div
                key={item._id}
                className="rounded-xl bg-white p-3.5 border border-rose-200/80 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority="Critical" size="xs" />
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                      {item.foodName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>{item.mealCount} meals</span>
                    <span>•</span>
                    <span className="truncate">📍 {item.pickupAddress}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDonationForMatch(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex-shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Match Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Daily Food Rescue Volume (Last 7 Days)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Rescued Meals vs Daily Target Demand</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px]">
              +24% Weekly Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRescued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="rescued"
                  name="Meals Rescued"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRescued)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  name="Target Demand"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution (1 Column) */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900">Food Category Share</h3>
              <span className="text-[11px] text-slate-400">By Total Portions</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px]">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Activity Stream & Recent Active Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Food Donations (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Active Surplus Food Inventory</h3>
              <p className="text-[11px] text-slate-400">Recent listings awaiting dispatch or matching</p>
            </div>
            <a href="/donations" className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1">
              View All ({donations.length}) →
            </a>
          </div>

          <div className="space-y-3">
            {donations.slice(0, 4).map((donation) => (
              <div
                key={donation._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={donation.imageUrl}
                    alt={donation.foodName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={donation.priority} size="xs" />
                      <span className="font-bold text-slate-800 text-xs">{donation.foodName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span className="font-semibold text-emerald-700">{donation.mealCount} meals</span>
                      <span>•</span>
                      <span>{donation.donorName}</span>
                      <span>•</span>
                      <FreshnessTimer expiryTime={donation.expiryTime} compact={true} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <StatusBadge status={donation.status} />
                  {donation.status === 'Available' && (
                    <button
                      onClick={() => setSelectedDonationForMatch(donation)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Match</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedDonationForDetail(donation)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Dispatches / Deliveries (1 Col) */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Live Deliveries Stream</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              Active
            </span>
          </div>

          <div className="space-y-3">
            {deliveries.slice(0, 4).map((del) => (
              <div key={del._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">{del.foodName}</span>
                  <StatusBadge status={del.status} />
                </div>
                <div className="text-[11px] text-slate-500">
                  Courier: <strong>{del.volunteerName}</strong> ({del.mealCount} meals)
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>To: {del.ngoName}</span>
                  <span>{del.estimatedDistanceKm} km</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DonationFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDuplicateTriggered={(dupInfo) => {
          setIsCreateModalOpen(false);
          setDuplicateModalData(dupInfo);
        }}
      />

      <MatchingModal
        isOpen={!!selectedDonationForMatch}
        onClose={() => setSelectedDonationForMatch(null)}
        donation={selectedDonationForMatch}
      />

      <DonationDetailModal
        isOpen={!!selectedDonationForDetail}
        onClose={() => setSelectedDonationForDetail(null)}
        donation={selectedDonationForDetail}
        onOpenMatch={(d) => setSelectedDonationForMatch(d)}
      />

      <DuplicateWarningModal
        isOpen={!!duplicateModalData}
        onClose={() => setDuplicateModalData(null)}
        duplicateData={duplicateModalData}
        onConfirmAnyway={() => {
          duplicateModalData?.proceedSave();
          setDuplicateModalData(null);
        }}
      />
    </div>
  );
};
