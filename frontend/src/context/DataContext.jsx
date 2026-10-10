import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
  initialDonations,
  initialNGOs,
  initialVolunteers,
  initialDeliveries,
} from '../services/mockData';
import { classifyFoodPriority, calculateDistance } from '../utils/aiAlgorithms';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Donations State
  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('foodrescue_donations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialDonations; }
    }
    return initialDonations;
  });

  // NGOs State
  const [ngos, setNGOs] = useState(() => {
    const saved = localStorage.getItem('foodrescue_ngos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialNGOs; }
    }
    return initialNGOs;
  });

  // Volunteers State
  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('foodrescue_volunteers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialVolunteers; }
    }
    return initialVolunteers;
  });

  // Deliveries State
  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('foodrescue_deliveries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialDeliveries; }
    }
    return initialDeliveries;
  });

  const [loading, setLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('foodrescue_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('foodrescue_ngos', JSON.stringify(ngos));
  }, [ngos]);

  useEffect(() => {
    localStorage.setItem('foodrescue_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('foodrescue_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  // Attempt backend fetch on initial load
  const refreshFromBackend = useCallback(async () => {
    try {
      const [donRes, ngoRes, volRes, delRes] = await Promise.allSettled([
        api.get('/donations'),
        api.get('/ngos'),
        api.get('/volunteers'),
        api.get('/deliveries'),
      ]);

      if (donRes.status === 'fulfilled' && donRes.value.data.success) {
        setDonations(donRes.value.data.data);
        setIsBackendConnected(true);
      }
      if (ngoRes.status === 'fulfilled' && ngoRes.value.data.success) {
        setNGOs(ngoRes.value.data.data);
      }
      if (volRes.status === 'fulfilled' && volRes.value.data.success) {
        setVolunteers(volRes.value.data.data);
      }
      if (delRes.status === 'fulfilled' && delRes.value.data.success) {
        setDeliveries(delRes.value.data.data);
      }
    } catch (e) {
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Add Donation
  const addDonation = async (donationData) => {
    const { priority, reason } = classifyFoodPriority(
      donationData.expiryTime,
      donationData.category,
      donationData.mealCount
    );

    const newDonation = {
      ...donationData,
      _id: 'don_' + Date.now(),
      mealCount: Number(donationData.mealCount),
      quantityKg: Number(donationData.quantityKg) || Number(donationData.mealCount) * 0.45,
      priority,
      priorityReason: reason,
      status: 'Available',
      createdAt: new Date().toISOString(),
      location: donationData.location || {
        lat: 28.6139 + (Math.random() - 0.5) * 0.08,
        lng: 77.2090 + (Math.random() - 0.5) * 0.08,
      },
    };

    try {
      const res = await api.post('/donations', newDonation);
      if (res.data?.success) {
        setDonations((prev) => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (e) {
      // client fallback
    }

    setDonations((prev) => [newDonation, ...prev]);
    return newDonation;
  };

  // Update Donation
  const updateDonation = async (id, updates) => {
    if (updates.expiryTime) {
      const { priority, reason } = classifyFoodPriority(
        updates.expiryTime,
        updates.category,
        updates.mealCount
      );
      updates.priority = priority;
      updates.priorityReason = reason;
    }

    try {
      await api.put(`/donations/${id}`, updates);
    } catch (e) {
      // ignore
    }

    setDonations((prev) =>
      prev.map((d) => (d._id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  };

  // Delete Donation
  const deleteDonation = async (id) => {
    try {
      await api.delete(`/donations/${id}`);
    } catch (e) {
      // ignore
    }
    setDonations((prev) => prev.filter((d) => d._id !== id));
  };

  // Match Donation with NGO & auto create delivery pipeline
  const matchDonationWithNGO = async (donationId, ngo) => {
    const targetDonation = donations.find((d) => d._id === donationId);
    if (!targetDonation) return;

    const matchedUpdate = {
      status: 'Matched',
      matchedNGO: { id: ngo._id, name: ngo.organizationName },
    };

    setDonations((prev) =>
      prev.map((d) => (d._id === donationId ? { ...d, ...matchedUpdate } : d))
    );

    // Auto-create an unassigned delivery for volunteers to claim
    const dist = calculateDistance(
      targetDonation.location?.lat || 28.6139,
      targetDonation.location?.lng || 77.2090,
      ngo.location?.lat || 28.6139,
      ngo.location?.lng || 77.2090
    );

    const newDelivery = {
      _id: 'del_' + Date.now(),
      donationId,
      ngoId: ngo._id,
      volunteerId: null,
      foodName: targetDonation.foodName,
      mealCount: targetDonation.mealCount,
      donorName: targetDonation.donorName,
      ngoName: ngo.organizationName,
      volunteerName: 'Unassigned',
      pickupAddress: targetDonation.pickupAddress,
      dropoffAddress: ngo.address,
      pickupLocation: targetDonation.location,
      dropoffLocation: ngo.location,
      status: 'Assigned',
      priority: targetDonation.priority,
      estimatedDistanceKm: dist,
      assignedAt: new Date().toISOString(),
      notes: 'Matched via FoodRescue AI Matchmaker.',
    };

    try {
      await api.post('/deliveries/assign', newDelivery);
    } catch (e) {
      // ignore
    }

    setDeliveries((prev) => [newDelivery, ...prev]);
  };

  // Update NGO Requirements
  const updateNGORequirements = async (ngoId, updates) => {
    try {
      await api.post('/ngos/requirements', { ngoId, ...updates });
    } catch (e) {
      // ignore
    }

    setNGOs((prev) =>
      prev.map((n) => (n._id === ngoId ? { ...n, ...updates } : n))
    );
  };

  // Toggle Volunteer Availability
  const toggleVolunteerAvailability = async (volunteerId, isAvailable) => {
    try {
      await api.put('/volunteers/availability', { volunteerId, isAvailable });
    } catch (e) {
      // ignore
    }

    setVolunteers((prev) =>
      prev.map((v) => (v._id === volunteerId ? { ...v, isAvailable } : v))
    );
  };

  // Assign Volunteer to Delivery
  const assignVolunteerToDelivery = async (deliveryId, volunteer) => {
    const updates = {
      volunteerId: volunteer._id,
      volunteerName: volunteer.fullName,
      status: 'Accepted',
    };

    try {
      await api.put(`/deliveries/${deliveryId}/status`, updates);
    } catch (e) {
      // ignore
    }

    setDeliveries((prev) =>
      prev.map((d) => (d._id === deliveryId ? { ...d, ...updates } : d))
    );

    // Update corresponding donation status
    const targetDel = deliveries.find((d) => d._id === deliveryId);
    if (targetDel) {
      setDonations((prev) =>
        prev.map((d) =>
          d._id === targetDel.donationId
            ? {
                ...d,
                status: 'Assigned',
                assignedVolunteer: {
                  id: volunteer._id,
                  name: volunteer.fullName,
                  phone: volunteer.phone,
                },
              }
            : d
        )
      );
    }
  };

  // Update Delivery Status (Assigned -> Accepted -> Picked Up -> Delivered)
  const updateDeliveryStatus = async (deliveryId, status, notes = '') => {
    const timestampUpdates = { status, notes };
    if (status === 'Picked Up') timestampUpdates.pickedUpAt = new Date().toISOString();
    if (status === 'Delivered') timestampUpdates.deliveredAt = new Date().toISOString();

    try {
      await api.put(`/deliveries/${deliveryId}/status`, timestampUpdates);
    } catch (e) {
      // ignore
    }

    setDeliveries((prev) =>
      prev.map((d) => (d._id === deliveryId ? { ...d, ...timestampUpdates } : d))
    );

    // Sync status to donation
    const targetDel = deliveries.find((d) => d._id === deliveryId);
    if (targetDel) {
      setDonations((prev) =>
        prev.map((d) =>
          d._id === targetDel.donationId ? { ...d, status } : d
        )
      );
    }
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setDonations(initialDonations);
    setNGOs(initialNGOs);
    setVolunteers(initialVolunteers);
    setDeliveries(initialDeliveries);
    localStorage.removeItem('foodrescue_donations');
    localStorage.removeItem('foodrescue_ngos');
    localStorage.removeItem('foodrescue_volunteers');
    localStorage.removeItem('foodrescue_deliveries');
  };

  // Computed Summary Metrics
  const summaryMetrics = {
    totalMealsRescued: 28450 + deliveries.filter((d) => d.status === 'Delivered').reduce((sum, d) => sum + d.mealCount, 0),
    availableDonationsCount: donations.filter((d) => d.status === 'Available').length,
    activeNGOsCount: ngos.filter((n) => n.activeDemand).length,
    availableVolunteersCount: volunteers.filter((v) => v.isAvailable).length,
    urgentDonationsCount: donations.filter((d) => d.priority === 'Critical' && d.status === 'Available').length,
    completedDeliveriesCount: deliveries.filter((d) => d.status === 'Delivered').length,
    activeDeliveriesCount: deliveries.filter((d) => d.status === 'Accepted' || d.status === 'Picked Up').length,
    co2SavedKg: Math.round(28450 * 0.45 * 2.5),
  };

  return (
    <DataContext.Provider
      value={{
        donations,
        ngos,
        volunteers,
        deliveries,
        summaryMetrics,
        loading,
        isBackendConnected,
        addDonation,
        updateDonation,
        deleteDonation,
        matchDonationWithNGO,
        updateNGORequirements,
        toggleVolunteerAvailability,
        assignVolunteerToDelivery,
        updateDeliveryStatus,
        resetDemoData,
        refreshFromBackend,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
