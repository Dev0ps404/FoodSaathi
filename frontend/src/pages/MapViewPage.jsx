import React, { useState } from 'react';
import { InteractiveRescueMap } from '../components/map/InteractiveRescueMap';
import { DonationDetailModal } from '../components/donations/DonationDetailModal';
import { MatchingModal } from '../components/ai/MatchingModal';

export const MapViewPage = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [matchingDonation, setMatchingDonation] = useState(null);

  return (
    <div className="space-y-4 text-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Live Interactive Operations Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geospatial visibility across Donors, Partner Shelters, Active Couriers, and Transit Routes.
          </p>
        </div>
      </div>

      <InteractiveRescueMap
        height="h-[calc(100vh-230px)]"
        onSelectDonation={(d) => setSelectedDonation(d)}
        onOpenMatchModal={(d) => setMatchingDonation(d)}
      />

      <DonationDetailModal
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        donation={selectedDonation}
        onOpenMatch={(d) => setMatchingDonation(d)}
      />

      <MatchingModal
        isOpen={!!matchingDonation}
        onClose={() => setMatchingDonation(null)}
        donation={matchingDonation}
      />
    </div>
  );
};
