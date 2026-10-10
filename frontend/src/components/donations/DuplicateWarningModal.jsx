import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const DuplicateWarningModal = ({
  isOpen,
  onClose,
  duplicateData,
  onConfirmAnyway,
}) => {
  if (!duplicateData) return null;

  const { matchedDonation, confidence, newDonationData } = duplicateData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚠️ Possible Duplicate Donation Detected"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs text-left">
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-xs mb-1">
              AI Heuristic Confidence: {confidence}% Match
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Our algorithm flagged that a very similar donation was recently published by this donor or at this location. Please ensure you are not listing duplicate food packets.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
          <div className="font-bold text-slate-800">Existing Active Listing:</div>
          <div className="text-slate-700">
            <strong>"{matchedDonation?.foodName}"</strong> ({matchedDonation?.mealCount} meals)
          </div>
          <div className="text-slate-500 text-[11px]">
            📍 {matchedDonation?.pickupAddress}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
          <div className="font-bold text-slate-800">New Submission:</div>
          <div className="text-slate-700">
            <strong>"{newDonationData?.foodName}"</strong> ({newDonationData?.mealCount} meals)
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel Listing
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmAnyway();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-xs"
          >
            Confirm & Publish Anyway
          </button>
        </div>
      </div>
    </Modal>
  );
};
