import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  Settings as SettingsIcon,
  User,
  Database,
  RotateCcw,
  Bell,
  Shield,
  CheckCircle2,
  AlertCircle,
  HardDrive,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, role, switchRole } = useAuth();
  const { isBackendConnected, resetDemoData, refreshFromBackend } = useData();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [org, setOrg] = useState(user?.organizationName || '');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast({ title: 'Profile Updated', message: 'Settings saved successfully.', type: 'success' });
  };

  const handleResetData = () => {
    resetDemoData();
    addToast({
      title: 'Demo Data Reset',
      message: 'All donations, NGOs, volunteers, and deliveries restored to initial seed state.',
      type: 'info',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs text-left">
      {/* Header */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System & Account Settings
        </h1>
        <p className="mt-1 text-slate-500 text-xs">
          Manage your organization profile, active role perspectives, database status, and demo data state.
        </p>
      </div>

      {/* Account Info Form */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-emerald-600" />
          <span>Profile Information</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name / Contact Lead</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Organization / Entity Name</label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Database & Architecture Observability */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-4 h-4 text-purple-600" />
          <span>Backend & Database Status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className={`p-2 rounded-xl ${isBackendConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-xs">
                {isBackendConnected ? 'MongoDB Server Connected' : 'Resilient In-Memory & LocalStorage Mode'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isBackendConnected
                  ? 'REST APIs actively persisting data to MongoDB on port 5000.'
                  : 'Operating in standalone demo mode with client-side reactive state & persistence.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-xs">JWT Authentication & Role Guard</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Protected Express middleware with bcrypt password hashing and role validation.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={refreshFromBackend}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
          >
            Check Backend Connectivity
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
