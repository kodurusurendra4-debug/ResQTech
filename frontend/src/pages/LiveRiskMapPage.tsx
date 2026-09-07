import React, { useState } from 'react';
import { LiveGISMap } from '../components/gis/LiveGISMap';
import { useDisaster } from '../context/DisasterContext';
import { Shield, Navigation, AlertTriangle, Building, Users } from 'lucide-react';
import { SafePlace } from '../types';

export const LiveRiskMapPage: React.FC = () => {
  const { localityRisk, shelters, userLocation, setUserLocation } = useDisaster();
  const [selectedShelter, setSelectedShelter] = useState<SafePlace | null>(shelters[0]);

  const sectors = [
    { name: "Surya Rao Peta Lowlands, Kakinada", lat: 16.9834, lng: 82.2451, risk: "RED" },
    { name: "Kaziranga Floodplain Corridor, Assam", lat: 26.5775, lng: 93.1711, risk: "RED" },
    { name: "Puri Sea Coast Cyclone Belt, Odisha", lat: 19.8135, lng: 85.8312, risk: "YELLOW" },
    { name: "Wayanad Landslide Highland, Kerala", lat: 11.6854, lng: 76.1320, risk: "YELLOW" },
    { name: "Sundarbans Delta, West Bengal", lat: 21.9497, lng: 89.1833, risk: "YELLOW" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Sector Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            Live National GIS Risk & Shelter Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time geospatial overlay: Multi-hazard risk zones, floodplains, vulnerable populations, shelters & rescue assets.
          </p>
        </div>

        {/* Sector Quick Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Sector:</span>
          <select
            value={userLocation.locality}
            onChange={(e) => {
              const selected = sectors.find(s => s.name === e.target.value);
              if (selected) {
                setUserLocation({ lat: selected.lat, lng: selected.lng, locality: selected.name });
              }
            }}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {sectors.map(s => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.risk})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <LiveGISMap
        selectedShelter={selectedShelter}
        onSelectShelter={setSelectedShelter}
      />

      {/* Map Context Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Active Hazard Exposure</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {localityRisk.disaster_type}: River level danger ratio at 1.18x. 12,500 people in active flood buffer.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <Building className="w-4 h-4" />
            <span>Designated Shelter Network</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {shelters.length} verified government cyclone & community shelters monitored with live occupancy.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-1">
            <Users className="w-4 h-4" />
            <span>Vulnerability Priority Buffer</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            High priority cluster identified: 640 children and 480 elderly in Surya Rao Peta lowlands.
          </p>
        </div>
      </div>

    </div>
  );
};
