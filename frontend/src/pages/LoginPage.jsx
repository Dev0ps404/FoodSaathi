import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Building2,
  Bike,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, loginAsDemo, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('donor@foodrescue.ai');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      addToast({
        title: 'Welcome to FoodRescue AI! 🌿',
        message: 'Successfully authenticated. Accessing live dashboard.',
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      addToast({ title: 'Authentication Notice', message: err.message, type: 'error' });
    }
  };

  const handleDemoClick = (roleKey) => {
    const user = loginAsDemo(roleKey);
    addToast({
      title: `Logged in as Demo ${roleKey.toUpperCase()}`,
      message: `Switched active session to ${user.name}.`,
      type: 'success',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-xs text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            <span>FoodRescue</span>
            <span className="text-emerald-600">AI</span>
          </div>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-slate-500">Access role-specific food surplus and rescue queues</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200/80 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="donor@foodrescue.ai"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* 1-Click Demo Accounts Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ⚡ 1-Click Hackathon Demo Logins:
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('donor')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-900 font-bold transition-all flex items-center gap-2"
              >
                <Utensils className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <div>Green Feast</div>
                  <div className="text-[10px] font-normal text-emerald-700">Donor</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('ngo')}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-purple-900 font-bold transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-purple-600" />
                <div className="text-left">
                  <div>Hope Shelter</div>
                  <div className="text-[10px] font-normal text-purple-700">NGO</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('volunteer')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-900 font-bold transition-all flex items-center gap-2"
              >
                <Bike className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <div>Alex Rivera</div>
                  <div className="text-[10px] font-normal text-blue-700">Volunteer</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="p-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <div className="text-left">
                  <div>Platform Admin</div>
                  <div className="text-[10px] font-normal text-slate-500">Full Access</div>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center text-slate-500 text-[11px]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
