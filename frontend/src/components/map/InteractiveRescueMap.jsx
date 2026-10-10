import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useData } from '../../context/DataContext';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import {
  Utensils,
  Building2,
  Bike,
  AlertTriangle,
  MapPin,
  Layers,
  Sparkles,
  Navigation,
  Info,
} from 'lucide-react';

// Custom SVG Icons using Leaflet DivIcon
const createCustomIcon = (bgColor, iconSvg, isUrgent = false) => {
  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `
      <div class="relative flex items-center justify-center w-9 h-9 rounded-full ${bgColor} text-white shadow-lg border-2 border-white transition-transform duration-200 hover:scale-125 ${
      isUrgent ? 'urgent-pulse' : ''
    }">
        ${iconSvg}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const donorIcon = createCustomIcon(
  'bg-emerald-600',
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`
);

const urgentDonorIcon = createCustomIcon(
  'bg-rose-600 ring-4 ring-rose-300',
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  true
);

const ngoIcon = createCustomIcon(
  'bg-purple-600',
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M16 14h.01"></path></svg>`
);

const volunteerIcon = createCustomIcon(
  'bg-blue-600',
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"></circle><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="15" cy="5" r="1"></circle><path d="M12 17.5V14l-3-3 4-3 2 3h2"></path></svg>`
);

export const InteractiveRescueMap = ({ onSelectDonation, onOpenMatchModal, height = 'h-[550px]' }) => {
  const { donations, ngos, volunteers, deliveries } = useData();

  // Filter States
  const [filter, setFilter] = useState({
    donors: true,
    ngos: true,
    volunteers: true,
    urgentOnly: false,
    routes: true,
  });

  const centerPos = [28.6250, 77.2150]; // Metro City Hub Center

  // Filtered lists
  const visibleDonations = donations.filter((d) => {
    if (!filter.donors) return false;
    if (filter.urgentOnly && d.priority !== 'Critical') return false;
    return true;
  });

  const visibleNGOs = filter.ngos ? ngos : [];
  const visibleVolunteers = filter.volunteers ? volunteers : [];

  // Active delivery routes to draw lines
  const activeRoutes = filter.routes
    ? deliveries
        .filter((del) => del.status === 'Accepted' || del.status === 'Picked Up')
        .map((del) => ({
          id: del._id,
          name: del.foodName,
          from: [del.pickupLocation.lat, del.pickupLocation.lng],
          to: [del.dropoffLocation.lat, del.dropoffLocation.lng],
          courier: del.volunteerName,
          status: del.status,
        }))
    : [];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Top Filter Bar Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Interactive Rescue Map</span>
          <span className="text-[10px] font-normal text-slate-400">
            (Leaflet & OpenStreetMap)
          </span>
        </div>

        {/* Filter Checkboxes */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setFilter((p) => ({ ...p, donors: !p.donors }))}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              filter.donors
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span>Donors ({donations.length})</span>
          </button>

          <button
            onClick={() => setFilter((p) => ({ ...p, ngos: !p.ngos }))}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              filter.ngos
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-300" />
            <span>NGOs ({ngos.length})</span>
          </button>

          <button
            onClick={() => setFilter((p) => ({ ...p, volunteers: !p.volunteers }))}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              filter.volunteers
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300" />
            <span>Volunteers ({volunteers.length})</span>
          </button>

          <button
            onClick={() => setFilter((p) => ({ ...p, urgentOnly: !p.urgentOnly }))}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              filter.urgentOnly
                ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                : 'bg-white text-rose-700 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Urgent Only</span>
          </button>

          <button
            onClick={() => setFilter((p) => ({ ...p, routes: !p.routes }))}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              filter.routes
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Routes ({activeRoutes.length})</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className={`${height} w-full relative`}>
        <MapContainer
          center={centerPos}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Active Delivery Route Polylines */}
          {activeRoutes.map((route) => (
            <Polyline
              key={route.id}
              positions={[route.from, route.to]}
              color="#f59e0b"
              weight={4}
              opacity={0.85}
              dashArray="8, 8"
            >
              <Popup>
                <div className="p-2 text-xs">
                  <div className="font-bold text-amber-600 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Active Rescue Transit</span>
                  </div>
                  <p className="text-slate-800 font-semibold mt-1">{route.name}</p>
                  <p className="text-slate-500 text-[11px]">Courier: <strong>{route.courier}</strong> ({route.status})</p>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Render Donor Markers */}
          {visibleDonations.map((donation) => {
            const isCritical = donation.priority === 'Critical';
            const pos = [donation.location?.lat || 28.6139, donation.location?.lng || 77.2090];

            return (
              <Marker
                key={donation._id}
                position={pos}
                icon={isCritical ? urgentDonorIcon : donorIcon}
              >
                <Popup>
                  <div className="p-2 text-xs max-w-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <PriorityBadge priority={donation.priority} size="xs" />
                      <StatusBadge status={donation.status} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {donation.foodName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {donation.mealCount} portions ({donation.category})
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      📍 {donation.pickupAddress}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {onSelectDonation && (
                        <button
                          onClick={() => onSelectDonation(donation)}
                          className="px-2 py-1 rounded bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          View Details
                        </button>
                      )}
                      {donation.status === 'Available' && onOpenMatchModal && (
                        <button
                          onClick={() => onOpenMatchModal(donation)}
                          className="px-2.5 py-1 rounded bg-emerald-600 font-bold text-white shadow-xs hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Match</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render NGO Markers */}
          {visibleNGOs.map((ngo) => {
            const pos = [ngo.location?.lat || 28.6139, ngo.location?.lng || 77.2090];
            return (
              <Marker key={ngo._id} position={pos} icon={ngoIcon}>
                <Popup>
                  <div className="p-2 text-xs max-w-xs space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                      🏢 Partner Shelter
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{ngo.organizationName}</h4>
                    <p className="text-[11px] text-slate-500">📍 {ngo.address}</p>
                    <div className="text-[11px] text-purple-700 font-medium pt-1">
                      Daily Demand: <strong>{ngo.requiredMealQuantity} meals</strong> (Radius: {ngo.serviceRadiusKm} km)
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render Volunteer Markers */}
          {visibleVolunteers.map((vol) => {
            const pos = [vol.location?.lat || 28.6139, vol.location?.lng || 77.2090];
            return (
              <Marker key={vol._id} position={pos} icon={volunteerIcon}>
                <Popup>
                  <div className="p-2 text-xs max-w-xs space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                      🛵 Volunteer Rescuer
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{vol.fullName}</h4>
                    <p className="text-[11px] text-slate-500">
                      Vehicle: <strong>{vol.vehicleType}</strong> ({vol.maxCapacityMeals} meals cap)
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-emerald-700 font-bold">
                        {vol.isAvailable ? '● Available for Dispatch' : '○ Currently Busy'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Simulation Badge / Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-xl p-2.5 border border-slate-200 shadow-md text-[11px] space-y-1 hidden sm:block">
          <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            <span>Map Legend & Simulated Coordinates</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Donors</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Urgent (&lt;3h)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> NGOs</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Couriers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
