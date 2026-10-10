import React from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge, StatusBadge, DietaryBadge } from '../common/Badge';
import { FreshnessTimer } from '../common/FreshnessTimer';
import {
  MapPin,
  Building2,
  Calendar,
  Utensils,
  Clock,
  Sparkles,
  Phone,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export const DonationDetailModal = ({ isOpen, onClose, donation, onOpenMatch }) => {
  if (!donation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Donation Batch Details" maxWidth="max-w-2xl">
      <div className="space-y-5 text-xs text-left">
        {/* Top Header Banner */}
        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'}
            alt={donation.foodName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <PriorityBadge priority={donation.priority} size="sm" />
            <StatusBadge status={donation.status} />
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-black/60 text-[11px] font-semibold">
                {donation.category}
              </span>
              <DietaryBadge type={donation.dietaryType || 'Vegetarian'} />
            </div>
            <h2 className="text-lg font-bold leading-tight">{donation.foodName}</h2>
          </div>
        </div>

        {/* Freshness Timer Box */}
        <FreshnessTimer expiryTime={donation.expiryTime} />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Meal Quantity</span>
            <div className="text-base font-black text-slate-800 mt-0.5">{donation.mealCount} portions</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Est. Weight</span>
            <div className="text-base font-black text-slate-800 mt-0.5">{donation.quantityKg || (donation.mealCount * 0.45).toFixed(1)} kg</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">CO₂ Avoidance</span>
            <div className="text-base font-black text-emerald-600 mt-0.5">{Math.round((donation.mealCount * 0.45) * 2.5)} kg</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Safety Status</span>
            <div className="text-base font-black text-blue-600 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Priority Reason */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Urgency Assessment:</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">{donation.priorityReason || 'Standard food rescue timeframe.'}</p>
        </div>

        {/* Pickup Details */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="font-bold text-slate-800 text-xs">Pickup & Dispatch Information:</div>
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Donor: <strong>{donation.donorName || donation.donorOrg}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>Address: {donation.pickupAddress}</span>
          </div>
          <div className="text-slate-500 pt-1 text-[11px]">
            <strong>Instructions:</strong> {donation.pickupInstructions || 'Report to reception or loading dock.'}
          </div>
        </div>

        {/* Matched Details if assigned */}
        {donation.matchedNGO && (
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
            <span className="font-bold block mb-1">Matched NGO Destination:</span>
            <span>{donation.matchedNGO.name}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            Close
          </button>

          {donation.status === 'Available' && onOpenMatch && (
            <button
              onClick={() => {
                onClose();
                onOpenMatch(donation);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-600/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Matchmaker</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
