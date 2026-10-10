import React from 'react';
import { Modal } from '../common/Modal';
import { recommendVolunteers } from '../../utils/aiAlgorithms';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Bike,
  Star,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const VolunteerAssignModal = ({ isOpen, onClose, delivery }) => {
  const { volunteers, assignVolunteerToDelivery, donations } = useData();
  const { addToast } = useToast();

  if (!delivery) return null;

  const targetDonation = donations.find((d) => d._id === delivery.donationId) || {
    foodName: delivery.foodName,
    mealCount: delivery.mealCount,
    location: delivery.pickupLocation,
  };

  const recommendations = recommendVolunteers(
    targetDonation,
    delivery.dropoffLocation,
    volunteers
  );

  const handleAssign = async (volunteer) => {
    await assignVolunteerToDelivery(delivery._id, volunteer);
    addToast({
      title: 'Courier Assigned! 🛵',
      message: `${volunteer.fullName} has been assigned to rescue "${delivery.foodName}".`,
      type: 'success',
      triggerConfetti: true,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Volunteer Assignment"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-xs text-left">
        {/* Delivery Mission Summary Banner */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Rescue Mission Target
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">{delivery.foodName}</h3>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {delivery.mealCount} meals • From <strong>{delivery.donorName}</strong> to <strong>{delivery.ngoName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Fleet AI
              </span>
            </div>
          </div>
        </div>

        {/* Volunteer List */}
        <div className="space-y-3">
          <div className="font-bold text-slate-800 text-xs">
            Recommended Active Volunteers ({recommendations.length}):
          </div>

          {recommendations.map((item, idx) => {
            const isTop = idx === 0;
            const vol = item.volunteer;

            return (
              <div
                key={vol._id}
                className={`rounded-2xl p-4 border transition-all ${
                  isTop
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{vol.fullName}</h4>
                        {isTop && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            ★ Top Choice
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.distanceKm} km from pickup
                        </span>
                        <span>•</span>
                        <span>Vehicle: <strong>{vol.vehicleType}</strong> ({vol.maxCapacityMeals} meals cap)</span>
                        <span>•</span>
                        <span className="text-amber-600 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {vol.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-blue-600 tracking-tight">
                      {item.suitabilityScore}%
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Suitability</span>
                  </div>
                </div>

                {/* Reasons */}
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

                {/* Assign Action Button */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleAssign(vol)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <span>Dispatch Volunteer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
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
