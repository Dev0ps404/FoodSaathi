import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  UserPlus,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  MapPin,
  Utensils,
  Bike,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    organizationName: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      addToast({
        title: 'Account Registered! 🎉',
        message: `Welcome to FoodRescue AI as a ${formData.role.toUpperCase()}.`,
        type: 'success',
        triggerConfetti: true,
      });
      navigate('/dashboard');
    } catch (err) {
      addToast({ title: 'Registration Notice', message: err.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 text-xs text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            <span>FoodRescue</span>
            <span className="text-emerald-600">AI</span>
          </div>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Create your FoodRescue AI Account</h2>
        <p className="mt-1 text-slate-500">Join our network of food donors, partner shelters, and rescue couriers</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-7 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200/80 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Role Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Select Your Role *</label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('donor')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    formData.role === 'donor'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold">Food Donor</div>
                    <div className="text-[10px] text-slate-400">Hotel / Mess / Caterer</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('ngo')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    formData.role === 'ngo'
                      ? 'border-purple-500 bg-purple-50/80 text-purple-900 ring-2 ring-purple-500/20 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-xs font-bold">Partner NGO</div>
                    <div className="text-[10px] text-slate-400">Food Bank / Shelter</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('volunteer')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    formData.role === 'volunteer'
                      ? 'border-blue-500 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bike className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs font-bold">Volunteer</div>
                    <div className="text-[10px] text-slate-400">Courier / Driver</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Row 1: Name & Org */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organization / Group Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g. Royal Banquet Hall"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="contact@organization.org"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Phone & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operating Location / Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Connaught Place, New Delhi"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Complete Registration & Access Dashboard'}</span>
            </button>
          </form>

          <div className="text-center text-slate-500 text-[11px] pt-3 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
