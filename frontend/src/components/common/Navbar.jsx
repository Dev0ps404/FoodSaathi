import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { RoleBadge } from './Badge';
import {
  Sparkles,
  PlusCircle,
  Menu,
  X,
  RefreshCw,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Database,
} from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { user, role, switchRole, logout, loginAsDemo } = useAuth();
  const { isBackendConnected, resetDemoData } = useData();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-slate-900 tracking-tight text-lg leading-tight">
              <span>FoodRescue</span>
              <span className="text-emerald-600">AI</span>
            </div>
            <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-600">
              Zero Food Waste Network
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Quick 1-Click Role Switcher Bar */}
      <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs">
        <span className="px-2 py-1 text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          Role:
        </span>
        <button
          onClick={() => switchRole('donor')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'donor'
              ? 'bg-emerald-600 text-white shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          🍲 Donor
        </button>
        <button
          onClick={() => switchRole('ngo')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'ngo'
              ? 'bg-purple-600 text-white shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          🏢 NGO
        </button>
        <button
          onClick={() => switchRole('volunteer')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'volunteer'
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          🛵 Volunteer
        </button>
        <button
          onClick={() => switchRole('admin')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            role === 'admin'
              ? 'bg-slate-800 text-white shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          ⚡ Admin
        </button>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Backend Status indicator */}
        <div
          title={isBackendConnected ? 'Backend API connected' : 'Client-side resilient demo state active'}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-50 border-slate-200 text-slate-600"
        >
          <Database className={`w-3.5 h-3.5 ${isBackendConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
          <span>{isBackendConnected ? 'Live MongoDB' : 'Demo Resilient State'}</span>
        </div>

        {/* Quick Donate CTA */}
        <Link
          to="/donations"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Donate Surplus</span>
        </Link>

        {/* Simulator CTA */}
        <Link
          to="/simulator"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span className="hidden sm:inline">Rescue</span> Simulator
        </Link>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                {user?.name || 'Guest User'}
              </div>
              <div className="text-[10px] text-slate-600 capitalize">{role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-slide-up"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="p-3 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
                <div className="mt-2">
                  <RoleBadge role={role} />
                </div>
              </div>

              <div className="p-1 space-y-1">
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Account & Settings
                </Link>
                <button
                  onClick={resetDemoData}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  Reset Seed Data
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
