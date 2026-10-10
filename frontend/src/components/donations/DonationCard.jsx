import React from 'react';
import { PriorityBadge, StatusBadge, DietaryBadge } from '../common/Badge';
import { FreshnessTimer } from '../common/FreshnessTimer';
import {
  MapPin,
  Utensils,
  Sparkles,
  MoreVertical,
  Calendar,
  Building2,
  Trash2,
  Edit,
  Eye,
  Send,
  UserCheck,
} from 'lucide-react';

export const DonationCard = ({
  donation,
  onViewDetails,
  onOpenMatch,
  onEdit,
  onDelete,
  currentUserRole = 'donor',
}) => {
  const isUrgent = donation.priority === 'Critical';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 overflow-hidden ${
        isUrgent
          ? 'border-rose-300 ring-1 ring-rose-400/20 shadow-sm'
          : 'border-slate-200 shadow-xs'
      }`}
    >
      {/* Card Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'}
          alt={donation.foodName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <PriorityBadge priority={donation.priority} size="xs" />
          <StatusBadge status={donation.status} />
        </div>

        {/* Bottom Floating Info on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-semibold">
            {donation.category}
          </span>
          <DietaryBadge type={donation.dietaryType || 'Vegetarian'} />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Meal Count */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onViewDetails(donation)}
              className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors"
            >
              {donation.foodName}
            </h3>
            <div className="text-right flex-shrink-0">
              <span className="text-base font-black text-emerald-700">
                {donation.mealCount}
              </span>
              <span className="block text-[10px] text-slate-600 font-semibold uppercase">meals</span>
            </div>
          </div>

          {/* Donor details */}
          <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate font-medium text-slate-700">{donation.donorName || donation.donorOrg}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{donation.pickupAddress}</span>
            </div>
          </div>

          {/* Matched NGO / Volunteer Alert Banner if active */}
          {donation.matchedNGO && (
            <div className="mt-3 p-2 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
              <span className="text-purple-800 font-medium truncate">
                Matched to <strong>{donation.matchedNGO.name}</strong>
              </span>
            </div>
          )}

          {donation.assignedVolunteer && (
            <div className="mt-2 p-2 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
              <span className="text-blue-800 font-medium truncate">
                Courier: <strong>{donation.assignedVolunteer.name}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Bottom Expiry Countdown */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <FreshnessTimer expiryTime={donation.expiryTime} compact={true} />
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(donation)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-1.5">
          {donation.status === 'Available' && (
            <button
              onClick={() => onOpenMatch(donation)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-xs hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>AI Match</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(donation._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete donation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
