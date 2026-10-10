import React from 'react';
import { PlusCircle, Cpu, Bike, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Post Surplus in 60 Seconds',
      description: 'Hotels, caterers, or college messes list available food batches, quantity, shelf life deadline, and pickup instructions.',
      icon: PlusCircle,
      badge: 'Step 1: Donor',
      color: 'from-emerald-500 to-teal-600',
      highlights: ['Automatic freshness timer', 'AI duplicate detection', 'Smart dietary tagging'],
    },
    {
      step: '02',
      title: 'AI Matches Ideal Shelter',
      description: 'Our explainable algorithm evaluates travel distance, NGO capacity, category preference, and remaining shelf life.',
      icon: Cpu,
      badge: 'Step 2: AI Engine',
      color: 'from-purple-500 to-indigo-600',
      highlights: ['Proximity & capacity weighting', 'Food safety priority triage', 'Top-3 instant recommendations'],
    },
    {
      step: '03',
      title: 'Volunteer Express Delivery',
      description: 'Active nearby courier volunteers accept the mission, pick up insulated containers, and deliver directly to shelters.',
      icon: Bike,
      badge: 'Step 3: Courier',
      color: 'from-blue-500 to-cyan-600',
      highlights: ['Turn-by-turn route optimization', 'Live dispatch timeline', 'Real-time delivery verification'],
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Intelligent Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How FoodRescue AI Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            From banquet surplus to community plates in three high-speed, safety-verified steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-white p-7 border border-slate-200/80 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {step.badge}
                    </span>
                    <span className="text-3xl font-black text-slate-200 font-mono">
                      {step.step}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-500/10`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {step.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
