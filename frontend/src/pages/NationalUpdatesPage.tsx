import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  ExternalLink,
  Users,
  Building
} from 'lucide-react';

interface DisasterBulletin {
  id: string;
  title: string;
  category: 'OFFICIAL' | 'COMMUNITY REPORT';
  source: string;
  timestamp: string;
  locality: string;
  severity: 'RED' | 'YELLOW' | 'GREEN';
  affected_count: number;
  safe_count: number;
  rescue_status: string;
  relief_status: string;
  details: string;
}

const SEED_BULLETINS: DisasterBulletin[] = [
  {
    id: "BUL-2026-001",
    title: "Godavari Flood Wave: Level-1 Evacuation Ordered for Kakinada Lowlands",
    category: "OFFICIAL",
    source: "Andhra Pradesh State Disaster Management Authority (APSDMA)",
    timestamp: "10 minutes ago",
    locality: "Surya Rao Peta & Jagannaickpur, Kakinada",
    severity: "RED",
    affected_count: 12500,
    safe_count: 6800,
    rescue_status: "NDRF 10th Battalion deployed with 18 inflatable boats.",
    relief_status: "Community cyclone shelters active with hot meals and drinking water.",
    details: "Water level at Sir Arthur Cotton Barrage crossed 18.5 lakh cusecs. Low-lying wards advised to immediately move to designated cyclone shelters."
  },
  {
    id: "BUL-2026-002",
    title: "Brahmaputra Flood Surge Submerges 70% of Kaziranga Western Range",
    category: "OFFICIAL",
    source: "Assam State Forest Department & ASDMA",
    timestamp: "45 minutes ago",
    locality: "Kaziranga National Park, Assam",
    severity: "RED",
    affected_count: 320,
    safe_count: 184,
    rescue_status: "Forest speedboats and tranquilization units guiding wildlife across NH-715 highlands.",
    relief_status: "Panbari Wildlife Rehabilitation transit hub fully operational.",
    details: "Speed restrictions of 40 km/h enforced on National Highway 715 to protect migrating elephant and rhino herds."
  },
  {
    id: "BUL-2026-003",
    title: "Canal Bund Breach Observed Near Madhavapatnam Industrial Edge",
    category: "COMMUNITY REPORT",
    source: "Citizen Report Verified by Local Ward Volunteer",
    timestamp: "1 hour ago",
    locality: "Madhavapatnam, Andhra Pradesh",
    severity: "YELLOW",
    affected_count: 1800,
    safe_count: 950,
    rescue_status: "Irrigation department engineers dispatched with sandbagging fleet.",
    relief_status: "Precautionary power shutdown in affected ward.",
    details: "Minor seepage in canal bund observed following continuous heavy rain. No structural collapse reported yet."
  }
];

export const NationalUpdatesPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'OFFICIAL' | 'COMMUNITY'>('ALL');

  const filtered = filterCategory === 'ALL'
    ? SEED_BULLETINS
    : filterCategory === 'OFFICIAL'
    ? SEED_BULLETINS.filter(b => b.category === 'OFFICIAL')
    : SEED_BULLETINS.filter(b => b.category === 'COMMUNITY REPORT');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Real-Time Situational Awareness</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            National Disaster Bulletins & Verified Updates
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Official government releases from NDMA, SDMA, and IMD clearly demarcated from citizen community reports to maintain information integrity.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilterCategory('OFFICIAL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'OFFICIAL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Official Government Only
          </button>
          <button
            onClick={() => setFilterCategory('COMMUNITY')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'COMMUNITY' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Community Reports
          </button>
        </div>
      </div>

      {/* Bulletins List */}
      <div className="space-y-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase ${
                  b.category === 'OFFICIAL'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                }`}>
                  {b.category}
                </span>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  b.severity === 'RED'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {b.severity} ALERT
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {b.timestamp}
                </span>
                <span>•</span>
                <span className="font-mono">{b.id}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                {b.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{b.locality}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Source: {b.source}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {b.details}
              </p>
            </div>

            {/* Operations Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <strong className="text-slate-900 dark:text-white block mb-1">Rescue Deployment:</strong>
                <span className="text-slate-600 dark:text-slate-400">{b.rescue_status}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <strong className="text-slate-900 dark:text-white block mb-1">Relief Logistics:</strong>
                <span className="text-slate-600 dark:text-slate-400">{b.relief_status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
