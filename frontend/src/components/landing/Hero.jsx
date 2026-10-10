import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Utensils, MapPin, Zap, Play } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-400/15 via-teal-300/20 to-emerald-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI-POWERED REAL-TIME FOOD REDISTRIBUTION</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Rescue Food. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Reduce Waste.
              </span> <br />
              Feed Communities.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              FoodRescue AI seamlessly bridges restaurants, banquet halls, and food donors with verified local NGOs and volunteer rescue couriers. Powered by smart urgency triage, shelf-life prediction, and automated route dispatch.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/donations"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 transition-all"
              >
                <Utensils className="w-4 h-4" />
                <span>Donate Surplus Food</span>
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                to="/simulator"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Run Rescue Simulator</span>
              </Link>
            </div>

            {/* Value Props Checklist */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FSSAI & Food Safety Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Under 45-Min Rescue Turnaround</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-purple-500" />
                <span>100% Free for Non-Profits</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual App Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-white/90 p-5 shadow-2xl border border-slate-200/80 backdrop-blur-md">
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-bold text-slate-700">AI Dispatch Engine</span>
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Live Stream
                </span>
              </div>

              {/* Sample Simulated Live Rescue Activity */}
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority="Critical" size="xs" />
                        <span className="text-[11px] text-slate-500">Connaught Place</span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-800">Royal Biryani Feast (120 Packets)</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        98% Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>Target: <strong>Hope Food Shelter</strong></span>
                    <span className="text-emerald-700 font-semibold">Courier Assigned (2.1 km)</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority="High" size="xs" />
                        <span className="text-[11px] text-slate-500">Barakhamba Road</span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-800">Fresh Artisan Breads & Muffins (85 Meals)</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        94% Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>Target: <strong>Annamrita Care</strong></span>
                    <span className="text-amber-600 font-semibold">Ready for Pickup</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick KPI */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-center pt-3 border-t border-slate-100">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-base font-extrabold text-emerald-800">28,450+</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Meals Delivered</div>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-base font-extrabold text-blue-800">38 mins</div>
                  <div className="text-[10px] text-blue-600 font-medium">Avg Delivery Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
