import React from 'react';
import { AlertCircle, Clock, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const PriorityBadge = ({ priority, showIcon = true, size = 'sm' }) => {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  switch (priority) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-semibold dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50 ${sizeClasses}`}>
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
          <span>Critical Urgency</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-medium dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50 ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600" />}
          <span>High Priority</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-medium dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/50 ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-blue-600" />}
          <span>Medium Priority</span>
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50 ${sizeClasses}`}>
          {showIcon && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
          <span>Low Priority</span>
        </span>
      );
  }
};

export const StatusBadge = ({ status }) => {
  const configs = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
    Matched: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20',
    Assigned: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20',
    'Picked Up': 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
    Delivered: 'bg-teal-50 text-teal-800 border-teal-200 ring-1 ring-teal-500/20',
    Cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const style = configs[status] || configs.Available;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const roles = {
    donor: { label: 'Food Donor', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    ngo: { label: 'Partner NGO', bg: 'bg-purple-100 text-purple-800 border-purple-300' },
    volunteer: { label: 'Volunteer Rescuer', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
    admin: { label: 'Platform Admin', bg: 'bg-slate-800 text-white border-slate-700' },
  };

  const current = roles[role] || roles.donor;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg}`}>
      {current.label}
    </span>
  );
};

export const DietaryBadge = ({ type }) => {
  const isVeg = type === 'Vegetarian' || type === 'Vegan';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
        isVeg
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {type}
    </span>
  );
};
