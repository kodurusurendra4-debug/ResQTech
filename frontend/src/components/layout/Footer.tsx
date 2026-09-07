import React from 'react';
import { Phone, Shield, ExternalLink, Heart, AlertOctagon } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  const emergencyQuickDials = [
    { label: "All-in-One Emergency", number: "112", icon: "🚨" },
    { label: "Ambulance / Medical", number: "108", icon: "🚑" },
    { label: "Fire & Rescue", number: "101", icon: "🚒" },
    { label: "Disaster Control (SDMA)", number: "1070", icon: "🌊" },
    { label: "Coast Guard Rescue", number: "1554", icon: "⚓" },
    { label: "Wildlife Distress", number: "1800-425-4733", icon: "🦏" }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Quick Emergency 1-Tap Dial Bar */}
        <div className="bg-red-950/80 border border-red-800/60 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="font-extrabold text-sm uppercase tracking-wider text-red-200">
              One-Touch Official Emergency Dialers (India)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {emergencyQuickDials.map((dial, idx) => (
              <a
                key={idx}
                href={`tel:${dial.number.replace(/[^0-9]/g, '')}`}
                className="flex flex-col items-center justify-center p-3 bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 rounded-xl transition-all active:scale-95 group text-center"
              >
                <span className="text-xl mb-1">{dial.icon}</span>
                <span className="text-lg font-black text-white group-hover:text-amber-200">{dial.number}</span>
                <span className="text-[10px] text-red-200 line-clamp-1">{dial.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Informational Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
          <div>
            <div className="flex items-center gap-2 mb-2 font-bold text-white text-base">
              <Shield className="w-5 h-5 text-red-500" />
              <span>SURAKSHA AI</span>
            </div>
            <p className="leading-relaxed mb-3">
              National-scale intelligent disaster management and population-aware emergency response infrastructure for India.
            </p>
            <p className="text-[11px] text-slate-500">
              Designed for citizens, NDRF/SDRF responders, volunteers, and wildlife rescue divisions.
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block mb-3">
              Authoritative Data Feeds
            </span>
            <ul className="space-y-1.5">
              <li>• India Meteorological Department (IMD)</li>
              <li>• Central Water Commission (CWC) Gauges</li>
              <li>• National Disaster Management Authority (NDMA)</li>
              <li>• Survey of India & OpenStreetMap GIS</li>
              <li>• Ministry of Environment, Forest & Climate Change</li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block mb-3">
              Emergency Architecture
            </span>
            <ul className="space-y-1.5">
              <li>• Population Vulnerability Indexing ($PVI$)</li>
              <li>• Duplicate Household Identity Deduplication</li>
              <li>• Low-Bandwidth / SMS Fallback Dispatch</li>
              <li>• Radiometric LWIR Thermal Sensor Vision</li>
              <li>• 10 Official Indian Languages Supported</li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block mb-3">
              Official Compliance Notice
            </span>
            <p className="text-[11px] leading-relaxed text-amber-300/80 bg-amber-950/40 border border-amber-900/50 p-2.5 rounded-lg">
              <strong>ADVISORY DISCLAIMER:</strong> All AI risk forecasts and vulnerability scores are advisory early-warning tools. Official orders and evacuation notices issued by SDMA, District Collectors, and Police control rooms supersede algorithmic assessments.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SURAKSHA AI Platform. Built for India's National Disaster Resilience.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Data Source: Verified NDMA/IMD Telemetry & Synthetic Demo Mode</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Public Safety
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
