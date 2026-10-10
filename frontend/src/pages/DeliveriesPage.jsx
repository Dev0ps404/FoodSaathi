import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { VolunteerAssignModal } from '../components/ai/VolunteerAssignModal';
import {
  Truck,
  MapPin,
  Building2,
  Bike,
  CheckCircle2,
  Clock,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PackageCheck,
} from 'lucide-react';

const statuses = ['All', 'Assigned', 'Accepted', 'Picked Up', 'Delivered'];

export const DeliveriesPage = () => {
  const { deliveries, updateDeliveryStatus } = useData();
  const { role } = useAuth();
  const { addToast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [assignDeliveryModal, setAssignDeliveryModal] = useState(null);

  const filteredDeliveries = deliveries.filter((item) => {
    if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
    return true;
  });

  const handleStatusChange = async (delivery, nextStatus) => {
    await updateDeliveryStatus(delivery._id, nextStatus);

    if (nextStatus === 'Delivered') {
      addToast({
        title: 'Mission Completed! 🎉',
        message: `${delivery.mealCount} meals successfully delivered to ${delivery.ngoName}.`,
        type: 'success',
        triggerConfetti: true,
      });
    } else {
      addToast({
        title: `Status Updated: ${nextStatus} 🚚`,
        message: `Delivery for "${delivery.foodName}" is now marked as ${nextStatus}.`,
        type: 'info',
      });
    }
  };

  const getStepNumber = (status) => {
    switch (status) {
      case 'Assigned': return 1;
      case 'Accepted': return 2;
      case 'Picked Up': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rescue Missions & Delivery Pipeline
          </h1>
          <p className="mt-1 text-slate-500 text-xs">
            Live lifecycle tracking of food surplus pickups, volunteer transits, and shelter delivery drop-offs.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Deliveries Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              No deliveries match the selected status tab.
            </p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => {
            const step = getStepNumber(delivery.status);
            const isDelivered = delivery.status === 'Delivered';

            return (
              <div
                key={delivery._id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-card transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {delivery.foodName}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                        <span className="font-semibold text-emerald-700">{delivery.mealCount} meals</span>
                        <span>•</span>
                        <span>Est. Distance: <strong>{delivery.estimatedDistanceKm || 4.5} km</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <PriorityBadge priority={delivery.priority} size="xs" />
                    <StatusBadge status={delivery.status} />
                  </div>
                </div>

                {/* Visual Step Progress Bar */}
                <div className="px-2 py-1">
                  <div className="relative flex items-center justify-between">
                    {/* Background track line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-slate-100 -z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 -z-0 transition-all duration-500"
                      style={{
                        width:
                          step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%',
                      }}
                    />

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}>
                        1
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1">Assigned</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}>
                        2
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1">Accepted</span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 3 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}>
                        3
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1">Picked Up</span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 4 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}>
                        4
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Route & Courier Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Pickup Origin</span>
                    <div className="font-bold text-slate-800 mt-0.5">{delivery.donorName}</div>
                    <div className="text-slate-500 text-[11px] truncate mt-0.5">
                      📍 {delivery.pickupAddress}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Drop-off Shelter</span>
                    <div className="font-bold text-purple-700 mt-0.5">{delivery.ngoName}</div>
                    <div className="text-slate-500 text-[11px] truncate mt-0.5">
                      📍 {delivery.dropoffAddress}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Courier</span>
                    <div className="font-bold text-blue-700 mt-0.5 flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5" />
                      <span>{delivery.volunteerName}</span>
                    </div>
                    {delivery.notes && (
                      <div className="text-slate-400 text-[10px] italic truncate mt-0.5">
                        "{delivery.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="text-slate-400 text-[10px]">
                    {delivery.deliveredAt
                      ? `Delivered at ${new Date(delivery.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : `Mission assigned at ${new Date(delivery.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>

                  <div className="flex items-center gap-2">
                    {delivery.volunteerName === 'Unassigned' && (
                      <button
                        onClick={() => setAssignDeliveryModal(delivery)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                        <span>AI Assign Courier</span>
                      </button>
                    )}

                    {delivery.status === 'Assigned' && delivery.volunteerName !== 'Unassigned' && (
                      <button
                        onClick={() => handleStatusChange(delivery, 'Accepted')}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                      >
                        Accept Mission
                      </button>
                    )}

                    {delivery.status === 'Accepted' && (
                      <button
                        onClick={() => handleStatusChange(delivery, 'Picked Up')}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Confirm Food Picked Up</span>
                      </button>
                    )}

                    {delivery.status === 'Picked Up' && (
                      <button
                        onClick={() => handleStatusChange(delivery, 'Delivered')}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 hover:scale-105"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Complete & Handover Delivery</span>
                      </button>
                    )}

                    {isDelivered && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mission Fulfilled</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Courier Assignment Modal */}
      <VolunteerAssignModal
        isOpen={!!assignDeliveryModal}
        onClose={() => setAssignDeliveryModal(null)}
        delivery={assignDeliveryModal}
      />
    </div>
  );
};
