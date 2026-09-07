import React, { useState } from 'react';
import {
  Waves,
  Wind,
  Shield,
  Building,
  Users,
  Filter,
  ArrowUpRight,
  Info
} from 'lucide-react';

interface CoastalDistrict {
  id: string;
  name: string;
  state: string;
  coastline_km: number;
  total_population: number;
  vulnerable_population: number;
  high_risk_zone_population: number;
  shelter_capacity: number;
  cyclone_exposure_rank: 'HIGH' | 'VERY HIGH' | 'MODERATE';
  last_major_event: string;
}

const COASTAL_DISTRICTS: CoastalDistrict[] = [
  {
    id: "CD-AP-KKD",
    name: "Kakinada & East Godavari",
    state: "Andhra Pradesh",
    coastline_km: 161.0,
    total_population: 1950000,
    vulnerable_population: 682500,
    high_risk_zone_population: 310000,
    shelter_capacity: 185000,
    cyclone_exposure_rank: "VERY HIGH",
    last_major_event: "Cyclone Gulab (2021) & Godavari High Flood"
  },
  {
    id: "CD-OD-PRI",
    name: "Puri Coastal Belt",
    state: "Odisha",
    coastline_km: 150.4,
    total_population: 1698000,
    vulnerable_population: 594300,
    high_risk_zone_population: 420000,
    shelter_capacity: 290000,
    cyclone_exposure_rank: "VERY HIGH",
    last_major_event: "Extremely Severe Cyclonic Storm Fani (2019)"
  },
  {
    id: "CD-WB-S24",
    name: "South 24 Parganas (Sundarbans)",
    state: "West Bengal",
    coastline_km: 240.0,
    total_population: 8161000,
    vulnerable_population: 2856000,
    high_risk_zone_population: 1250000,
    shelter_capacity: 540000,
    cyclone_exposure_rank: "VERY HIGH",
    last_major_event: "Super Cyclone Amphan (2020) & Yaas"
  },
  {
    id: "CD-TN-NAG",
    name: "Nagapattinam & Vedaranyam",
    state: "Tamil Nadu",
    coastline_km: 187.0,
    total_population: 1614000,
    vulnerable_population: 564900,
    high_risk_zone_population: 290000,
    shelter_capacity: 145000,
    cyclone_exposure_rank: "HIGH",
    last_major_event: "Cyclone Gaja (2018) & 2004 Tsunami"
  },
  {
    id: "CD-KL-ALP",
    name: "Alappuzha Kuttanad Coastal",
    state: "Kerala",
    coastline_km: 82.0,
    total_population: 2127000,
    vulnerable_population: 744400,
    high_risk_zone_population: 380000,
    shelter_capacity: 195000,
    cyclone_exposure_rank: "HIGH",
    last_major_event: "Kerala Deluge Inundation & Cyclone Ockhi"
  }
];

export const CoastalRiskPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('All');

  const filtered = selectedState === 'All'
    ? COASTAL_DISTRICTS
    : COASTAL_DISTRICTS.filter(d => d.state === selectedState);

  const totalCoastalPop = filtered.reduce((sum, d) => sum + d.total_population, 0);
  const totalVulnPop = filtered.reduce((sum, d) => sum + d.vulnerable_population, 0);
  const totalShelterCap = filtered.reduce((sum, d) => sum + d.shelter_capacity, 0);
  const totalDeficit = Math.max(0, totalVulnPop - totalShelterCap);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Waves className="w-4 h-4" />
            <span>Maritime & Coastal Vulnerability Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            India Coastal Risk & Storm Surge Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Covers 7,516 km of Indian coastline across Bay of Bengal & Arabian Sea. Evaluates storm-surge exposure against multipurpose cyclone shelter capacity.
          </p>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Maritime States</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Odisha">Odisha</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Kerala">Kerala</option>
          </select>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Coastal Population</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {(totalCoastalPop / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across selected coastal sectors</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-red-600 font-bold uppercase">Vulnerable Demographic</span>
          <div className="text-2xl font-black text-red-600 mt-1">
            {(totalVulnPop / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-red-400 mt-1">Children, elderly, mobility impaired</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Cyclone Shelter Capacity</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {(totalShelterCap / 1000).toFixed(0)}k
          </div>
          <p className="text-[11px] text-emerald-500 mt-1">Reinforced concrete shelters</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-amber-600 font-bold uppercase">Evacuation Transit Gap</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {(totalDeficit / 1000).toFixed(0)}k
          </div>
          <p className="text-[11px] text-amber-500 mt-1">Requires inland school hubs</p>
        </div>
      </div>

      {/* Coastal District Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
          Coastal District Threat & Shelter Capacity Matrix
        </h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
              <th className="pb-3 font-semibold">District & State</th>
              <th className="pb-3 font-semibold">Coastline</th>
              <th className="pb-3 font-semibold">Total Pop</th>
              <th className="pb-3 font-semibold">High-Risk Buffer</th>
              <th className="pb-3 font-semibold">Shelter Capacity</th>
              <th className="pb-3 font-semibold">Exposure Rank</th>
              <th className="pb-3 font-semibold">Historical Benchmark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 font-bold text-slate-900 dark:text-white">
                  {d.name}
                  <span className="block text-[10px] text-slate-500 font-normal">{d.state}</span>
                </td>
                <td className="py-3 font-mono">{d.coastline_km} km</td>
                <td className="py-3 font-semibold">{d.total_population.toLocaleString()}</td>
                <td className="py-3 text-red-600 font-bold">{d.high_risk_zone_population.toLocaleString()}</td>
                <td className="py-3 text-emerald-600 font-bold">{d.shelter_capacity.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    d.cyclone_exposure_rank === 'VERY HIGH'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {d.cyclone_exposure_rank}
                  </span>
                </td>
                <td className="py-3 text-slate-500 text-[11px]">{d.last_major_event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
