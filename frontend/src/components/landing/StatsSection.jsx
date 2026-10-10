import React from 'react';
import { Utensils, Building2, Users, Leaf, Clock, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const StatsSection = () => {
  const { summaryMetrics } = useData();

  const stats = [
    {
      label: 'Meals Rescued',
      value: summaryMetrics.totalMealsRescued.toLocaleString() + '+',
      subtitle: 'Nutritious portions served',
      icon: Utensils,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Active Donors',
      value: '120+',
      subtitle: 'Hotels, caterers, & messes',
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Partner NGOs',
      value: '14+',
      subtitle: 'Shelters and community kitchens',
      icon: Building2,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'CO₂ Avoided',
      value: '32,000 kg',
      subtitle: 'Greenhouse gas mitigated',
      icon: Leaf,
      color: 'text-teal-600 bg-teal-100',
    },
  ];

  return (
    <section className="bg-white py-12 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className={`p-3 rounded-2xl mb-3 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {stat.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
