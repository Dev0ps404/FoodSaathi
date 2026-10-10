import React, { useState } from 'react';
import { Leaf, Droplets, Utensils, IndianRupee, Sparkles } from 'lucide-react';

export const ImpactSection = () => {
  const [mealInput, setMealInput] = useState(1500);

  // Computed environmental impact constants
  const co2PerMeal = 0.45 * 2.5; // ~1.125 kg CO2e per meal
  const waterPerMeal = 180; // ~180 litres of virtual water per meal
  const moneyPerMeal = 50; // ~INR 50 per meal

  const calculatedCO2 = Math.round(mealInput * co2PerMeal);
  const calculatedWater = Math.round(mealInput * waterPerMeal);
  const calculatedRupees = (mealInput * moneyPerMeal).toLocaleString();

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            Interactive Impact Estimator
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Transforming Surplus into Sustainable Impact
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Every meal rescued directly combats urban hunger while cutting methane emissions in landfills.
          </p>
        </div>

        {/* Interactive Impact Calculator Box */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-800/80 border border-slate-700/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Select Quantity of Surplus Meals
            </label>
            <div className="text-4xl font-black text-white mt-1">
              {mealInput.toLocaleString()} <span className="text-emerald-400 text-2xl font-bold">Meals</span>
            </div>

            <div className="mt-6 max-w-md mx-auto">
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={mealInput}
                onChange={(e) => setMealInput(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>100 meals</span>
                <span>5,000 meals</span>
                <span>10,000 meals</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-700/60">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{calculatedCO2.toLocaleString()} kg</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">CO₂ Emissions Averted</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Equivalent to planting {Math.round(calculatedCO2 / 21)} trees</div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center mb-3">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-blue-400">{calculatedWater.toLocaleString()} L</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Virtual Water Conserved</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Saved from agricultural footprint</div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center mb-3">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-amber-400">₹{calculatedRupees}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Direct Food Relief Value</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Infused into community welfare</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
