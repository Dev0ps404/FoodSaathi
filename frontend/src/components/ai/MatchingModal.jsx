import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { calculateSmartMatching } from '../../utils/aiAlgorithms';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';

export const MatchingModal = ({ isOpen, onClose, donation }) => {
  const { ngos, matchDonationWithNGO } = useData();
  const { addToast } = useToast();
  const [selectedNGOId, setSelectedNGOId] = useState(null);

  if (!donation) return null;

  const matches = calculateSmartMatching(donation, ngos);
  const topMatches = matches.slice(0, 3);

  const handleConfirmMatch = async (ngo) => {
    await matchDonationWithNGO(donation._id, ngo);
    addToast({
      title: 'Match Established! 🎯',
      message: `"${donation.foodName}" successfully matched with ${ngo.organizationName}. Rescue mission initiated.`,
      type: 'success',
      triggerConfetti: true,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Smart Donor–NGO Matchmaker"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs text-left">
        {/* Donation Context Pill */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Active Donation Target
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">{donation.foodName}</h3>
              <p className="text-slate-600 text-[11px]">
                {donation.mealCount} portions ({donation.category}) • 📍 {donation.pickupAddress}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                AI Scored
              </span>
            </div>
          </div>
        </div>

        {/* Top 3 Ranked NGO Cards */}
        <div className="space-y-4">
          <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
            <span>Top Recommended Partner NGOs:</span>
            <span className="text-slate-400 font-normal text-[11px]">Ranked by multi-factor score</span>
          </div>

          {topMatches.map((item, idx) => {
            const isTopPick = idx === 0;
            return (
              <div
                key={item.ngo._id}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                  isTopPick
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.ngo.organizationName}
                        </h4>
                        {isTopPick && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ★ Best Match
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.distanceKm} km away
                        </span>
                        <span>•</span>
                        <span>Capacity: <strong>{item.ngo.requiredMealQuantity} meals/day</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{item.ngo.operatingHours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 tracking-tight">
                      {item.matchPercentage}%
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Match Score</span>
                  </div>
                </div>

                {/* Algorithmic Reason Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {item.reasons.map((r, rIdx) => (
                    <span
                      key={rIdx}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                {/* Score Breakdown Bars */}
                {item.breakdown && (
                  <div className="mt-3 grid grid-cols-5 gap-2 pt-2 border-t border-slate-100/80 text-[10px] text-slate-500">
                    <div>
                      <span className="block text-slate-400">Proximity</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${(item.breakdown.proximity / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="block text-slate-400">Capacity</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${(item.breakdown.capacity / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="block text-slate-400">Category</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${(item.breakdown.category / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="block text-slate-400">Demand</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${(item.breakdown.reliability / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="block text-slate-400">Urgency</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${(item.breakdown.urgency / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Match Action CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleConfirmMatch(item.ngo)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all"
                  >
                    <span>Match with this Shelter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-slate-400 text-[11px]">
          <span>Food safety deadlines are enforced automatically during all allocations.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
