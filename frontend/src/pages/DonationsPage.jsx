import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { DonationCard } from '../components/donations/DonationCard';
import { DonationFormModal } from '../components/donations/DonationFormModal';
import { MatchingModal } from '../components/ai/MatchingModal';
import { DonationDetailModal } from '../components/donations/DonationDetailModal';
import { DuplicateWarningModal } from '../components/donations/DuplicateWarningModal';
import {
  Search,
  PlusCircle,
  Filter,
  Utensils,
  Sparkles,
  AlertTriangle,
  Layers,
} from 'lucide-react';

const categories = ['All', 'Cooked Meals', 'Bakery', 'Produce', 'Dairy', 'Packaged Goods', 'Beverages'];
const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
const statuses = ['All', 'Available', 'Matched', 'Assigned', 'Picked Up', 'Delivered'];

export const DonationsPage = () => {
  const { donations, deleteDonation } = useData();
  const { role } = useAuth();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [matchDonation, setMatchDonation] = useState(null);
  const [detailDonation, setDetailDonation] = useState(null);
  const [duplicateModalData, setDuplicateModalData] = useState(null);

  const filteredDonations = donations.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        item.foodName.toLowerCase().includes(s) ||
        item.donorName.toLowerCase().includes(s) ||
        item.pickupAddress.toLowerCase().includes(s) ||
        item.category.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Food Donation Management
          </h1>
          <p className="mt-1 text-slate-500 text-xs">
            Browse, filter, and track surplus food listings with real-time freshness countdowns and AI matching.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Food Donation</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3.5">
        {/* Top Search & Priority select */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, donor, or location..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p} Priority</option>
              ))}
            </select>

            <span className="text-slate-500 font-semibold text-xs whitespace-nowrap ml-2">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Grid */}
      {filteredDonations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Food Donations Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No donations match your selected filters. Try adjusting your search or add a new donation batch.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedPriority('All');
              setSelectedStatus('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              currentUserRole={role}
              onViewDetails={(d) => setDetailDonation(d)}
              onOpenMatch={(d) => setMatchDonation(d)}
              onDelete={role === 'donor' || role === 'admin' ? deleteDonation : null}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <DonationFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onDuplicateTriggered={(dupInfo) => {
          setIsCreateOpen(false);
          setDuplicateModalData(dupInfo);
        }}
      />

      <MatchingModal
        isOpen={!!matchDonation}
        onClose={() => setMatchDonation(null)}
        donation={matchDonation}
      />

      <DonationDetailModal
        isOpen={!!detailDonation}
        onClose={() => setDetailDonation(null)}
        donation={detailDonation}
        onOpenMatch={(d) => setMatchDonation(d)}
      />

      <DuplicateWarningModal
        isOpen={!!duplicateModalData}
        onClose={() => setDuplicateModalData(null)}
        duplicateData={duplicateModalData}
        onConfirmAnyway={() => {
          duplicateModalData?.proceedSave();
          setDuplicateModalData(null);
        }}
      />
    </div>
  );
};
