import React from 'react';
import {
  Cpu,
  ShieldAlert,
  Bike,
  CopyCheck,
  TrendingUp,
  Navigation,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesSection = () => {
  const features = [
    {
      title: 'Smart Donor–NGO Matching',
      description: 'Calculates multi-dimensional compatibility using distance, dietary categories, and receiving capacity.',
      icon: Cpu,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Food Priority & Safety Triage',
      description: 'Categorizes donations into Critical, High, Medium, and Low priorities based on safe consumption deadlines.',
      icon: ShieldAlert,
      color: 'text-rose-700 bg-rose-100',
    },
    {
      title: 'Smart Volunteer Dispatch',
      description: 'Auto-scores available couriers based on distance, cargo capacity, active assignments, and rating.',
      icon: Bike,
      color: 'text-blue-700 bg-blue-100',
    },
    {
      title: 'Duplicate Donation Shield',
      description: 'Prevents redundant food posts by comparing donor profile, geo-coordinates, and meal timestamps.',
      icon: CopyCheck,
      color: 'text-amber-700 bg-amber-100',
    },
    {
      title: 'Food Demand Forecaster',
      description: 'Simulates seasonal and day-of-week demand patterns to help shelters prepare ahead of banquet surges.',
      icon: TrendingUp,
      color: 'text-purple-700 bg-purple-100',
    },
    {
      title: 'Route Optimizer (TSP Heuristic)',
      description: 'Sequences pickup and delivery stops to minimize transit distance and reduce CO2 emissions.',
      icon: Navigation,
      color: 'text-teal-700 bg-teal-100',
    },
    {
      title: 'Food Rescue Simulator',
      description: 'Interactive parametric engine simulating thousand-meal rescue operations with real-time analytics.',
      icon: Sparkles,
      color: 'text-amber-700 bg-amber-100',
      badge: 'WOW Feature',
    },
    {
      title: 'Carbon & Waste Analytics',
      description: 'Tracks kilograms of food diverted, CO2 greenhouse gases averted, and monetary community value.',
      icon: BarChart3,
      color: 'text-indigo-700 bg-indigo-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Powered by Heuristic Intelligence
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            AI-Driven Food Rescue Suite
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Designed specifically to eliminate bottlenecks in emergency food redistribution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl p-6 bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${feature.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {feature.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-amber-500 text-white shadow-sm shadow-amber-500/30">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Feature →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
