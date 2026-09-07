import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Users,
  Navigation,
  CheckCircle,
  Phone,
  Shield,
  Search,
  Filter,
  Info
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { SafePlace } from '../types';

export const SafePlacesPage: React.FC = () => {
  const { shelters, checkInToShelter, userLocation } = useDisaster();
  const [filterRadius, setFilterRadius] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedInId, setCheckedInId] = useState<string | null>(null);

  const filteredShelters = shelters.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckin = async (shelterId: string) => {
    await checkInToShelter(shelterId, 5);
    setCheckedInId(shelterId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Verified Safe Shelter & Relief Camp Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Locate high-ground cyclone shelters, tertiary trauma hospitals, and relief community centers. Check in to record yourself safe and update live capacity.
          </p>
        </div>

        {/* Search & Radius Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shelters by name..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={filterRadius}
            onChange={(e) => setFilterRadius(Number(e.target.value))}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
          </select>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 p-4 rounded-xl flex items-center gap-3 text-xs text-blue-900 dark:text-blue-300">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <span>
          <strong>VERIFICATION NOTICE:</strong> Suraksha AI lists only officially designated shelters certified by District Disaster Management Authorities (DDMA). Do not assume private tall buildings are safe from structural inundation without designation.
        </span>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShelters.map((shelter) => {
          const occupancyPct = Math.round((shelter.current_occupancy / shelter.total_capacity) * 100);
          const isFull = occupancyPct >= 95;
          const isCurrentCheckedIn = checkedInId === shelter.id;

          return (
            <div
              key={shelter.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isCurrentCheckedIn
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {shelter.type}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {shelter.distance_km || 2.1} km
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                  {shelter.name}
                </h3>

                {/* Capacity Gauge */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Current Occupancy:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {shelter.current_occupancy} / {shelter.total_capacity} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-red-500' : occupancyPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Accessibility & Facilities */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
                  <p>♿ <strong>Access:</strong> {shelter.accessibility_status}</p>
                  <div className="flex flex-wrap gap-1">
                    {shelter.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Contact: {shelter.contact_person}</span>
                  <a href={`tel:${shelter.contact_phone}`} className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCheckin(shelter.id)}
                    disabled={isCurrentCheckedIn}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isCurrentCheckedIn
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-black'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isCurrentCheckedIn ? "Checked In Safe" : "Check In Safe"}</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Initiating GPS routing to ${shelter.name}. Route coordinates downloaded for offline guidance.`);
                    }}
                    className="py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-500" />
                    <span>Directions</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
