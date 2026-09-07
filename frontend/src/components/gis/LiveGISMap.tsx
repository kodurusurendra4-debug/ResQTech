import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Shield,
  Hospital,
  Users,
  LifeBuoy,
  Waves,
  AlertTriangle,
  Navigation,
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { SafePlace } from '../../types';

interface LayerToggleState {
  disasters: boolean;
  riskZones: boolean;
  waterResources: boolean;
  shelters: boolean;
  hospitals: boolean;
  vulnerableClusters: boolean;
  rescueTeams: boolean;
  volunteers: boolean;
  wildlife: boolean;
  evacuationRoute: boolean;
}

interface GISMarker {
  id: string;
  name: string;
  type: 'disaster' | 'shelter' | 'hospital' | 'water' | 'vulnerable' | 'rescue' | 'volunteer' | 'wildlife';
  lat: number;
  lng: number;
  x: number; // % on map
  y: number; // % on map
  riskLevel: 'RED' | 'YELLOW' | 'GREEN';
  info: string;
  capacity?: string;
  occupancy?: string;
}

export const LiveGISMap: React.FC<{
  selectedShelter?: SafePlace | null;
  onSelectShelter?: (shelter: SafePlace) => void;
}> = ({ selectedShelter, onSelectShelter }) => {
  const { localityRisk, shelters, userLocation } = useDisaster();

  const [layers, setLayers] = useState<LayerToggleState>({
    disasters: true,
    riskZones: true,
    waterResources: true,
    shelters: true,
    hospitals: true,
    vulnerableClusters: true,
    rescueTeams: true,
    volunteers: true,
    wildlife: true,
    evacuationRoute: true
  });

  const [activeMarker, setActiveMarker] = useState<GISMarker | null>(null);

  // Geographic bounds simulated for Kakinada & Godavari Delta (or National view)
  // Converting local coordinates to relative percentage for responsive GIS canvas
  const markers: GISMarker[] = [
    // Disasters
    {
      id: "DIS-01",
      name: "Severe Riverine Flash Flood (Level 1.8m)",
      type: "disaster",
      lat: 16.9850,
      lng: 82.2430,
      x: 48,
      y: 52,
      riskLevel: "RED",
      info: "Surya Rao Peta - 12,500 residents affected. Inundation continuing."
    },
    // Water Resources
    {
      id: "WR-01",
      name: "Godavari River (Dowleswaram Barrage)",
      type: "water",
      lat: 16.9400,
      lng: 81.7700,
      x: 22,
      y: 68,
      riskLevel: "RED",
      info: "Water gauge at 1.18x of danger threshold. 18.5 lakh cusecs discharge."
    },
    {
      id: "WR-02",
      name: "Salt Creek / Canal Bund Reach",
      type: "water",
      lat: 16.9920,
      lng: 82.2510,
      x: 55,
      y: 44,
      riskLevel: "YELLOW",
      info: "High embankment stress reported. Sandbag reinforcement deployed."
    },
    // Safe Shelters
    {
      id: "SP-01",
      name: "Govt Degree College Multipurpose Cyclone Shelter",
      type: "shelter",
      lat: 16.9891,
      lng: 82.2475,
      x: 58,
      y: 38,
      riskLevel: "GREEN",
      info: "High ground reinforced shelter. Wheelchair accessible. Rations active.",
      capacity: "1,200",
      occupancy: "480 / 1200 (40%)"
    },
    {
      id: "SP-02",
      name: "Sri Bhavanarayaswami Community Hall",
      type: "shelter",
      lat: 17.0120,
      lng: 82.2610,
      x: 72,
      y: 24,
      riskLevel: "GREEN",
      info: "Designated secondary safe center. Clean drinking water tanks available.",
      capacity: "600",
      occupancy: "210 / 600 (35%)"
    },
    // Hospitals
    {
      id: "HOSP-01",
      name: "District Government General Hospital (GGH) Trauma Ward",
      type: "hospital",
      lat: 16.9604,
      lng: 82.2381,
      x: 42,
      y: 74,
      riskLevel: "GREEN",
      info: "24x7 Emergency block, 60 ICU beds, mobile oxygen tankers in position."
    },
    // Vulnerable Demographic Cluster
    {
      id: "VULN-01",
      name: "High Vulnerability Cluster (Children & Elderly)",
      type: "vulnerable",
      lat: 16.9820,
      lng: 82.2410,
      x: 44,
      y: 56,
      riskLevel: "RED",
      info: "Priority Area: 640 children, 480 elderly, 92 mobility-impaired residents."
    },
    // Rescue Teams
    {
      id: "RESCUE-01",
      name: "NDRF 10th Battalion Rescue Boat Alpha",
      type: "rescue",
      lat: 16.9860,
      lng: 82.2440,
      x: 50,
      y: 49,
      riskLevel: "GREEN",
      info: "12 motorized inflatable rescue craft evacuating trapped families."
    },
    // Volunteers
    {
      id: "VOL-01",
      name: "Ex-Servicemen & First-Aid Volunteer Staging Post",
      type: "volunteer",
      lat: 16.9950,
      lng: 82.2460,
      x: 53,
      y: 32,
      riskLevel: "GREEN",
      info: "24 vetted volunteers coordinating distribution and elderly assistance."
    },
    // Wildlife Area
    {
      id: "WILD-01",
      name: "Coringa Wildlife Sanctuary & Mangrove Corridor",
      type: "wildlife",
      lat: 16.8500,
      lng: 82.3000,
      x: 82,
      y: 84,
      riskLevel: "YELLOW",
      info: "Fishing cat and estuarine crocodile habitat. Wildlife patrol deployed."
    }
  ];

  const toggleLayer = (layer: keyof LayerToggleState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev [layer] }));
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
      
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[85%]">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-white flex items-center gap-2 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span className="font-bold">Sector: Kakinada Delta</span>
          <span className="text-[10px] text-slate-400">Lat: 16.98°N, Lng: 82.24°E</span>
        </div>

        {/* Layer Filters Dropdown / Pills */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded-xl flex items-center gap-1.5 overflow-x-auto max-w-full text-[11px] text-slate-300">
          <Layers className="w-3.5 h-3.5 text-slate-400 ml-1" />
          
          <button
            onClick={() => toggleLayer('disasters')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              layers.disasters ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Disasters
          </button>

          <button
            onClick={() => toggleLayer('riskZones')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              layers.riskZones ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            AI Risk Zones
          </button>

          <button
            onClick={() => toggleLayer('shelters')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              layers.shelters ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Safe Shelters
          </button>

          <button
            onClick={() => toggleLayer('vulnerableClusters')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              layers.vulnerableClusters ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Vulnerable Clusters
          </button>

          <button
            onClick={() => toggleLayer('rescueTeams')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              layers.rescueTeams ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Rescue Teams
          </button>

          <button
            onClick={() => toggleLayer('wildlife')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              layers.wildlife ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Wildlife
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Simulation with Topographical & Hydrological Vector Layers */}
      <svg className="w-full h-full" viewBox="0 0 1000 640" preserveAspectRatio="none">
        
        {/* Background Grid & Sea / Estuary Gradient */}
        <defs>
          <linearGradient id="coastalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="65%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
          </pattern>

          {/* Risk Zone Heat Radial Gradients */}
          <radialGradient id="redZoneGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="yellowZoneGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Map Background */}
        <rect width="1000" height="640" fill="url(#coastalGrad)" />
        <rect width="1000" height="640" fill="url(#gridPattern)" />

        {/* Coastline & Bay of Bengal Water Body */}
        <path
          d="M 850 0 Q 780 180 820 320 T 900 640 L 1000 640 L 1000 0 Z"
          fill="#0284c7"
          opacity="0.25"
        />

        {/* Godavari River Delta Network */}
        {layers.waterResources && (
          <g>
            <path
              d="M 0 420 Q 250 430 400 460 T 700 500 T 840 560"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 400 460 Q 520 380 620 320 T 800 240"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
            />
            <text x="220" y="415" fill="#7dd3fc" fontSize="11" fontWeight="bold">Godavari River Reach</text>
          </g>
        )}

        {/* AI Risk Zones (Red & Yellow Buffers) */}
        {layers.riskZones && (
          <g>
            {/* Primary RED Inundation Zone (Surya Rao Peta) */}
            <circle cx="480" cy="330" r="140" fill="url(#redZoneGrad)" />
            <circle cx="480" cy="330" r="140" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            <text x="380" y="220" fill="#fca5a5" fontSize="12" fontWeight="extrabold">🔴 HIGH RISK ZONE (RED: 82/100)</text>

            {/* Secondary YELLOW Alert Zone */}
            <circle cx="700" cy="240" r="110" fill="url(#yellowZoneGrad)" />
            <circle cx="700" cy="240" r="110" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <text x="640" y="150" fill="#fde68a" fontSize="10" fontWeight="bold">🟡 MODERATE RISK ZONE (48/100)</text>
          </g>
        )}

        {/* Evacuation Route Line: User Location (480, 340) -> Govt Degree College Shelter (580, 240) */}
        {layers.evacuationRoute && (
          <g>
            <path
              d="M 480 340 L 510 300 L 550 270 L 580 240"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
            <text x="510" y="275" fill="#86efac" fontSize="10" fontWeight="bold">
              Evacuation Route: 1.8 km (8 min)
            </text>
          </g>
        )}

        {/* User Location Marker */}
        <g transform="translate(480, 340)">
          <circle r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />
          <circle r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
          <text x="14" y="4" fill="#ffffff" fontSize="11" fontWeight="bold">
            You Are Here
          </text>
        </g>
      </svg>

      {/* Interactive Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map((marker) => {
          // Layer visibility filters
          if (marker.type === 'disaster' && !layers.disasters) return null;
          if (marker.type === 'water' && !layers.waterResources) return null;
          if (marker.type === 'shelter' && !layers.shelters) return null;
          if (marker.type === 'hospital' && !layers.hospitals) return null;
          if (marker.type === 'vulnerable' && !layers.vulnerableClusters) return null;
          if (marker.type === 'rescue' && !layers.rescueTeams) return null;
          if (marker.type === 'volunteer' && !layers.volunteers) return null;
          if (marker.type === 'wildlife' && !layers.wildlife) return null;

          const isSelected = activeMarker?.id === marker.id;

          let IconComponent = MapPin;
          let pinColor = "bg-red-600 text-white";

          if (marker.type === 'shelter') {
            IconComponent = Shield;
            pinColor = "bg-emerald-600 text-white ring-2 ring-emerald-400";
          } else if (marker.type === 'hospital') {
            IconComponent = Hospital;
            pinColor = "bg-rose-600 text-white";
          } else if (marker.type === 'vulnerable') {
            IconComponent = Users;
            pinColor = "bg-purple-600 text-white animate-bounce";
          } else if (marker.type === 'rescue') {
            IconComponent = Navigation;
            pinColor = "bg-blue-600 text-white";
          } else if (marker.type === 'wildlife') {
            IconComponent = LifeBuoy;
            pinColor = "bg-teal-600 text-white";
          } else if (marker.type === 'water') {
            IconComponent = Waves;
            pinColor = "bg-cyan-600 text-white";
          }

          return (
            <div
              key={marker.id}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-10 group"
              onClick={() => {
                setActiveMarker(marker);
                if (marker.type === 'shelter' && onSelectShelter) {
                  const found = shelters.find(s => s.name.includes(marker.name.slice(0, 10))) || shelters[0];
                  onSelectShelter(found);
                }
              }}
            >
              <div className={`p-1.5 rounded-full shadow-lg ${pinColor} transition-transform group-hover:scale-125`}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Hover Badge */}
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded-md shadow-lg whitespace-nowrap z-30">
                {marker.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Marker Detail Drawer */}
      {activeMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  activeMarker.riskLevel === 'RED' ? 'bg-red-500' : activeMarker.riskLevel === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {activeMarker.type} • {activeMarker.riskLevel} Level
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mt-0.5">{activeMarker.name}</h4>
            </div>
            <button
              onClick={() => setActiveMarker(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {activeMarker.info}
          </p>

          {activeMarker.capacity && (
            <div className="flex items-center justify-between text-xs bg-slate-800/80 p-2 rounded-lg mb-3">
              <span className="text-slate-400">Occupancy:</span>
              <span className="font-bold text-emerald-400">{activeMarker.occupancy}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Routing initiated to ${activeMarker.name}. Distance: 1.8 km. Safe elevation corridor mapped.`);
              }}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate Here</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-[10px] text-slate-300 shadow-lg">
        <span className="font-bold uppercase tracking-wider text-slate-400">Legend:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" /> High Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe Shelter
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Vulnerable Cluster
        </span>
      </div>

    </div>
  );
};
