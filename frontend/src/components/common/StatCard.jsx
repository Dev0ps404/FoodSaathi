import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'emerald',
  onClick,
}) => {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-200/60',
      iconBg: 'bg-emerald-100 text-emerald-700',
      glow: 'group-hover:border-emerald-400',
    },
    blue: {
      bg: 'from-blue-500/10 to-indigo-500/5',
      border: 'border-blue-200/60',
      iconBg: 'bg-blue-100 text-blue-700',
      glow: 'group-hover:border-blue-400',
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-200/60',
      iconBg: 'bg-amber-100 text-amber-700',
      glow: 'group-hover:border-amber-400',
    },
    rose: {
      bg: 'from-rose-500/10 to-red-500/5',
      border: 'border-rose-200/60',
      iconBg: 'bg-rose-100 text-rose-700',
      glow: 'group-hover:border-rose-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-fuchsia-500/5',
      border: 'border-purple-200/60',
      iconBg: 'bg-purple-100 text-purple-700',
      glow: 'group-hover:border-purple-400',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.emerald;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white p-5 border shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 ${scheme.border} ${scheme.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${scheme.bg} opacity-50 pointer-events-none`} />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-1 text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl shadow-inner transition-transform duration-300 group-hover:scale-110 ${scheme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="relative mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-100/80 text-xs">
          <span
            className={`inline-flex items-center font-semibold ${
              trendPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trend}
          </span>
          <span className="text-slate-400">vs last week</span>
        </div>
      )}
    </div>
  );
};
