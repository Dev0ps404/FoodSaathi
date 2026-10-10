import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Bike,
  Star,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export const VolunteersPage = () => {
  const { volunteers, toggleVolunteerAvailability } = useData();
  const { role } = useAuth();
  const { addToast } = useToast();

  const handleToggle = async (volunteer) => {
    const newState = !volunteer.isAvailable;
    await toggleVolunteerAvailability(volunteer._id, newState);
    addToast({
      title: 'Status Updated',
      message: `${volunteer.fullName} is now ${newState ? 'Available for Missions' : 'Set to Offline / Busy'}.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Volunteer Rescue Fleet
          </h1>
          <p className="mt-1 text-slate-500 text-xs">
            Rapid response volunteer couriers transporting fresh food from donor banquet kitchens to local shelters.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs self-start sm:self-auto">
          <Bike className="w-4 h-4 text-blue-600" />
          <span>{volunteers.filter((v) => v.isAvailable).length} of {volunteers.length} Active On Duty</span>
        </div>
      </div>

      {/* Volunteer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {volunteers.map((vol) => (
          <div
            key={vol._id}
            className={`rounded-2xl bg-white border p-5 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all flex flex-col justify-between ${
              vol.isAvailable
                ? 'border-slate-200'
                : 'border-slate-200 opacity-80 bg-slate-50/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {vol.fullName.charAt(0)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      vol.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${vol.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {vol.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{vol.fullName}</h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{vol.rating}</span>
                <span className="text-slate-400 font-normal text-[11px]">
                  ({vol.completedDeliveriesCount} rescues done)
                </span>
              </div>

              {/* Stats Box */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle</span>
                  <div className="font-bold text-slate-800 text-[11px] truncate mt-0.5">
                    {vol.vehicleType}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Max Capacity</span>
                  <div className="font-bold text-blue-700 text-[11px] mt-0.5">
                    {vol.maxCapacityMeals} meals
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{vol.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{vol.email}</span>
                </div>
              </div>
            </div>

            {/* Availability Toggle Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                {vol.currentDeliveriesCount > 0 ? '1 Active Mission' : 'Idle'}
              </span>
              <button
                onClick={() => handleToggle(vol)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  vol.isAvailable
                    ? 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    : 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                }`}
              >
                {vol.isAvailable ? 'Set Busy' : 'Set Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
