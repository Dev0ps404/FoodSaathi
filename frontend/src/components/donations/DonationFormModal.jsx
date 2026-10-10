import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge } from '../common/Badge';
import { classifyFoodPriority, detectDuplicateDonation } from '../../utils/aiAlgorithms';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Utensils,
  Clock,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';

const imagePresets = [
  { label: 'Hot Buffet / Biryani', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60' },
  { label: 'Fresh Bakery / Breads', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60' },
  { label: 'Organic Produce Crates', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=60' },
  { label: 'Executive Lunch Combos', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60' },
  { label: 'Dairy & Yogurt Crates', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=60' },
];

export const DonationFormModal = ({ isOpen, onClose, onDuplicateTriggered }) => {
  const { user } = useAuth();
  const { addDonation, donations } = useData();
  const { addToast } = useToast();

  const getDefaultExpiry = (hours) => {
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Cooked Meals',
    mealCount: 100,
    quantityKg: 45,
    preparationTime: new Date().toISOString().slice(0, 16),
    expiryTime: getDefaultExpiry(3.5),
    dietaryType: 'Vegetarian',
    pickupAddress: user?.address || 'Hall #4, Downtown Banquet Plaza, New Delhi',
    pickupInstructions: 'Collect from loading bay at rear service lane. Staff will assist.',
    imageUrl: imagePresets[0].url,
    lat: 28.6280,
    lng: 77.2180,
  });

  // Calculate live priority preview
  const priorityPreview = classifyFoodPriority(
    formData.expiryTime,
    formData.category,
    formData.mealCount
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'mealCount') {
        updated.quantityKg = Math.round(Number(value) * 0.45);
      }
      return updated;
    });
  };

  const setQuickExpiry = (hours) => {
    setFormData((prev) => ({
      ...prev,
      expiryTime: getDefaultExpiry(hours),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.foodName.trim()) {
      addToast({ title: 'Validation Error', message: 'Please provide a food name', type: 'error' });
      return;
    }

    // AI Duplicate Donation Check
    const dupCheck = detectDuplicateDonation(
      { ...formData, donorName: user?.name },
      donations
    );

    if (dupCheck.isDuplicate && onDuplicateTriggered) {
      onDuplicateTriggered({
        newDonationData: {
          ...formData,
          donorName: user?.name || 'Verified Donor',
          donorOrg: user?.organizationName || 'Generous Kitchens',
          location: { lat: Number(formData.lat), lng: Number(formData.lng) },
        },
        matchedDonation: dupCheck.matchedDonation,
        confidence: dupCheck.confidence,
        proceedSave: async () => {
          await saveDonation();
        },
      });
      return;
    }

    await saveDonation();
  };

  const saveDonation = async () => {
    try {
      await addDonation({
        ...formData,
        donorName: user?.name || 'Verified Donor',
        donorOrg: user?.organizationName || 'Generous Kitchens',
        location: { lat: Number(formData.lat), lng: Number(formData.lng) },
      });

      addToast({
        title: 'Donation Listed Successfully! 🍲',
        message: `${formData.mealCount} portions of "${formData.foodName}" queued for AI Matching.`,
        type: 'success',
        triggerConfetti: true,
      });

      onClose();
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to save donation', type: 'error' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Donate Surplus Food" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5 text-left text-xs">
        {/* Live AI Priority Prediction Card */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">AI Urgency Classification:</span>
                <PriorityBadge priority={priorityPreview.priority} size="xs" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{priorityPreview.reason}</p>
            </div>
          </div>
        </div>

        {/* Row 1: Food Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Food Name / Description *</label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="e.g. Veg Pulao, Dal Fry & Chapati Trays"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Food Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="Cooked Meals">Cooked Meals (Buffet / Banquet)</option>
              <option value="Bakery">Bakery & Pastries</option>
              <option value="Produce">Fresh Fruits & Vegetables</option>
              <option value="Dairy">Dairy & Dairy Products</option>
              <option value="Packaged Goods">Packaged / Sealed Non-Perishables</option>
              <option value="Beverages">Beverages & Juices</option>
            </select>
          </div>
        </div>

        {/* Row 2: Meal Count, Weight & Dietary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Meal Packets (Count) *</label>
            <input
              type="number"
              name="mealCount"
              min="1"
              max="5000"
              value={formData.mealCount}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Est. Weight (kg)</label>
            <input
              type="number"
              name="quantityKg"
              step="0.5"
              value={formData.quantityKg}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dietary Type</label>
            <select
              name="dietaryType"
              value={formData.dietaryType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="Vegetarian">Vegetarian (Pure Veg)</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">100% Vegan</option>
              <option value="Eggitarian">Eggitarian</option>
            </select>
          </div>
        </div>

        {/* Row 3: Timestamps & Quick Expiry Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Preparation Time</label>
            <input
              type="datetime-local"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Safe-Consumption Deadline *</label>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setQuickExpiry(2)}
                  className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold hover:bg-rose-200"
                >
                  +2h (Critical)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(4)}
                  className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold hover:bg-amber-200"
                >
                  +4h (High)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(12)}
                  className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200"
                >
                  +12h (Med)
                </button>
              </div>
            </div>
            <input
              type="datetime-local"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 4: Pickup Address & Coordinates */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Pickup Address *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              required
              placeholder="e.g. Grand Banquet Hall, Gate 2, Metro City"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 5: Instructions & Image Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pickup Instructions for Couriers</label>
            <textarea
              name="pickupInstructions"
              rows="3"
              value={formData.pickupInstructions}
              onChange={handleChange}
              placeholder="e.g. Park at dock 3. Call kitchen manager upon arrival."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Photo Preset / URL</label>
            <select
              value={formData.imageUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white mb-2"
            >
              {imagePresets.map((preset, i) => (
                <option key={i} value={preset.url}>
                  {preset.label}
                </option>
              ))}
            </select>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Or paste custom image URL"
              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Publish Donation & Auto-Match</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
