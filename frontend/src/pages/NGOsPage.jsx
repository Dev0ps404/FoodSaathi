import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import {
  Building2,
  MapPin,
  Utensils,
  CheckCircle2,
  Sliders,
  Phone,
  Clock,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  HeartHandshake,
} from 'lucide-react';

export const NGOsPage = () => {
  const { ngos, updateNGORequirements, donations } = useData();
  const { role } = useAuth();
  const { addToast } = useToast();

  const [editingNGO, setEditingNGO] = useState(null);
  const [formData, setFormData] = useState({
    requiredMealQuantity: 250,
    serviceRadiusKm: 15,
    activeDemand: true,
    preferredCategories: ['Cooked Meals', 'Bakery', 'Produce'],
  });

  const openRequirementsModal = (ngo) => {
    setEditingNGO(ngo);
    setFormData({
      requiredMealQuantity: ngo.requiredMealQuantity || 200,
      serviceRadiusKm: ngo.serviceRadiusKm || 15,
      activeDemand: ngo.activeDemand !== undefined ? ngo.activeDemand : true,
      preferredCategories: ngo.preferredCategories || ['Cooked Meals', 'Produce'],
    });
  };

  const handleSaveRequirements = async (e) => {
    e.preventDefault();
    if (!editingNGO) return;

    await updateNGORequirements(editingNGO._id, formData);
    addToast({
      title: 'NGO Requirements Updated! 🏢',
      message: `Demand set to ${formData.requiredMealQuantity} meals within ${formData.serviceRadiusKm} km radius.`,
      type: 'success',
    });
    setEditingNGO(null);
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.preferredCategories.includes(cat);
      if (exists) {
        return {
          ...prev,
          preferredCategories: prev.preferredCategories.filter((c) => c !== cat),
        };
      } else {
        return {
          ...prev,
          preferredCategories: [...prev.preferredCategories, cat],
        };
      }
    });
  };

  const availableCategories = ['Cooked Meals', 'Bakery', 'Produce', 'Dairy', 'Packaged Goods', 'Beverages'];

  return (
    <div className="space-y-6 text-xs text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Partner NGO Shelters & Food Banks
          </h1>
          <p className="mt-1 text-slate-500 text-xs">
            Verified charitable distribution centers receiving, inspecting, and redistributing surplus meals.
          </p>
        </div>

        {ngos.length > 0 && (
          <button
            onClick={() => openRequirementsModal(ngos[0])}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all self-start sm:self-auto"
          >
            <Sliders className="w-4 h-4" />
            <span>Update Food Requirements</span>
          </button>
        )}
      </div>

      {/* NGO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ngos.map((ngo) => (
          <div
            key={ngo._id}
            className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with verified badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {ngo.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified NGO
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ngo.activeDemand
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ngo.activeDemand ? '● Seeking Food' : '○ Standby'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {ngo.organizationName}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>{ngo.address}</span>
              </p>

              {/* Requirements & Capacity Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Daily Demand</span>
                  <div className="font-black text-purple-700 text-sm mt-0.5">
                    {ngo.requiredMealQuantity} meals
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Max Capacity</span>
                  <div className="font-black text-slate-800 text-sm mt-0.5">
                    {ngo.currentCapacity || 400} meals
                  </div>
                </div>
              </div>

              {/* Preferred Categories */}
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Accepted Categories:</span>
                <div className="flex flex-wrap gap-1">
                  {ngo.preferredCategories?.map((cat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Operating Hours:</span>
                  <span className="font-semibold text-slate-700">{ngo.operatingHours}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service Radius:</span>
                  <span className="font-semibold text-slate-700">{ngo.serviceRadiusKm} km</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                {ngo.registrationNumber}
              </span>
              <button
                onClick={() => openRequirementsModal(ngo)}
                className="px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 font-bold hover:bg-purple-50 transition-colors flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Edit Demand</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Requirements Modal */}
      <Modal
        isOpen={!!editingNGO}
        onClose={() => setEditingNGO(null)}
        title={`Food Requirements: ${editingNGO?.organizationName}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveRequirements} className="space-y-4 text-xs text-left">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Required Daily Meal Quantity
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              step="10"
              value={formData.requiredMealQuantity}
              onChange={(e) => setFormData({ ...formData, requiredMealQuantity: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Maximum Service Radius (km)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.serviceRadiusKm}
              onChange={(e) => setFormData({ ...formData, serviceRadiusKm: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Preferred Food Categories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((cat) => {
                const isSelected = formData.preferredCategories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 text-purple-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeDemandToggle"
              checked={formData.activeDemand}
              onChange={(e) => setFormData({ ...formData, activeDemand: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="activeDemandToggle" className="font-bold text-slate-700">
              Actively Accepting Emergency Food Rescues
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingNGO(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs"
            >
              Save Requirements
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
