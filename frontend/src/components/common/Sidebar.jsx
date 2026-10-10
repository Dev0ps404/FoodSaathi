import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Building2,
  Bike,
  Truck,
  Sparkles,
  Cpu,
  MapPin,
  BarChart3,
  Settings,
  Flame,
  Globe,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { summaryMetrics, donations, deliveries } = useData();
  const { role } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Food Donations',
      path: '/donations',
      icon: UtensilsCrossed,
      badge: donations.filter((d) => d.status === 'Available').length,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Partner NGOs',
      path: '/ngos',
      icon: Building2,
      badge: null,
    },
    {
      name: 'Volunteers',
      path: '/volunteers',
      icon: Bike,
      badge: null,
    },
    {
      name: 'Active Deliveries',
      path: '/deliveries',
      icon: Truck,
      badge: deliveries.filter((d) => d.status === 'Assigned' || d.status === 'Accepted' || d.status === 'Picked Up').length,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'AI Matchmaker',
      path: '/ai-matching',
      icon: Cpu,
      badge: 'AI',
      badgeColor: 'bg-purple-100 text-purple-800 font-bold',
    },
    {
      name: 'Rescue Simulator',
      path: '/simulator',
      icon: Sparkles,
      badge: 'WOW',
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
      highlight: true,
    },
    {
      name: 'Interactive Map',
      path: '/map',
      icon: MapPin,
      badge: null,
    },
    {
      name: 'Impact Analytics',
      path: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside drawer for mobile */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-900">FoodRescue AI</span>
          </div>
          <button onClick={closeSidebar} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Rescue Metric Ticker in Sidebar */}
        <div className="p-4 border-b border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-3 border border-emerald-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                Live Impact
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 font-semibold text-emerald-800">
                Verified
              </span>
            </div>
            <div className="mt-1.5 text-xl font-extrabold text-slate-800">
              {summaryMetrics.totalMealsRescued.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500">Meals rescued from landfill</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : item.highlight
                      ? 'text-amber-700 bg-amber-50/70 hover:bg-amber-100 border border-amber-200/60'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-amber-600'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : item.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Public Landing Page</span>
          </Link>
          <div className="px-3 py-1 text-[10px] text-slate-400">
            FoodRescue AI v1.0 • College Hackathon
          </div>
        </div>
      </aside>
    </>
  );
};
