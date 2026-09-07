import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Waves,
  Wind,
  Mountain,
  Sun,
  Factory,
  Building2,
  CloudLightning,
  HeartHandshake,
  MapPin,
  Users,
  Building,
  PhoneCall,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Radio,
  FileCheck
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { DisasterType } from '../types';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  openSOSModal: () => void;
  openChatbot: () => void;
  setSelectedDisasterType: (type: DisasterType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  openSOSModal,
  openChatbot,
  setSelectedDisasterType
}) => {
  const { localityRisk, userLocation, simulationState, shelters, checkInToShelter } = useDisaster();
  const { t } = useThemeLanguage();

  const disasterCategories: Array<{ type: DisasterType; icon: any; color: string; risk: string }> = [
    { type: 'Flood', icon: Waves, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800', risk: 'HIGH (RED)' },
    { type: 'Cyclone', icon: Wind, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800', risk: 'HIGH (RED)' },
    { type: 'Earthquake', icon: Activity, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800', risk: 'MODERATE' },
    { type: 'Tsunami', icon: Waves, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800', risk: 'WATCH' },
    { type: 'Landslide', icon: Mountain, color: 'text-stone-500 bg-stone-50 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800', risk: 'LOCALIZED' },
    { type: 'Drought', icon: Sun, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800', risk: 'MONITORED' },
    { type: 'Heatwave', icon: Flame, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800', risk: 'WARNING' },
    { type: 'Industrial Leakage', icon: Factory, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800', risk: 'ALERT' },
    { type: 'Fire', icon: Flame, color: 'text-red-500 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800', risk: 'ACTIVE' },
    { type: 'Building Collapse', icon: Building2, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-800', risk: 'RESCUE ONGOING' },
    { type: 'Severe Storm', icon: CloudLightning, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800', risk: 'ADVISORY' },
    { type: 'Other', icon: ShieldAlert, color: 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800', risk: 'STANDBY' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO SECTION (Section 5) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold tracking-wide uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            National Early Warning & Emergency Response
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Know the Risk. Act Early. <span className="text-red-500">Save Lives.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            India's unified, population-aware disaster response intelligence platform. Connecting citizens, families, NDRF/SDRF responders, volunteers, and wildlife teams through real-time GIS vulnerability mapping.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openSOSModal}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <ShieldAlert className="w-5 h-5 fill-current" />
              <span>{t('sosButton')}</span>
            </button>

            <button
              onClick={() => setActiveTab('live-map')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Explore Live Risk Map</span>
            </button>

            <button
              onClick={openChatbot}
              className="px-5 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4" />
              <span>Voice AI Assistant</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. LOCALITY EMERGENCY RISK WIDGET (Section 56) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Local Threat & Vulnerability Assessment
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Source: IMD Doppler + CWC Gauge Network
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1: Risk Level */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60">
            <div className="text-xs text-red-700 dark:text-red-400 font-bold uppercase tracking-wider mb-1">
              Current Regional Risk
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-600 dark:text-red-400">
                {localityRisk.risk_score}
              </span>
              <span className="text-xs font-bold text-red-500">/ 100</span>
              <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white">
                {localityRisk.risk_level}
              </span>
            </div>
            <p className="text-xs text-red-800 dark:text-red-300 mt-2 font-medium">
              {localityRisk.disaster_type}: High Inundation Hazard
            </p>
          </div>

          {/* Card 2: Affected Population & Demographics */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
              Affected Population
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {localityRisk.population_affected_estimate.toLocaleString()}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span>🚼 {localityRisk.vulnerable_population_estimate.children} Children</span>
              <span>👵 {localityRisk.vulnerable_population_estimate.elderly} Elderly</span>
              <span>♿ {localityRisk.vulnerable_population_estimate.disabled} Disabled</span>
            </div>
          </div>

          {/* Card 3: Nearest Safe Shelter */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
              Nearest Verified Safe Shelter
            </div>
            <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200 line-clamp-1">
              Govt Degree College Cyclone Shelter
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
              1.8 km • Capacity: 480 / 1,200
            </p>
            <button
              onClick={() => setActiveTab('safe-places')}
              className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Quick Action */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex flex-col justify-between">
            <div>
              <div className="text-xs text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
                Citizen Safety Status
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                Are you currently in a safe location? Let rescue authorities know.
              </p>
            </div>
            <button
              onClick={() => checkInToShelter(shelters[0].id, 5)}
              className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm I Am Safe (Check In)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. DISASTER CATEGORIES GRID (Section 5) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Disaster Preparedness & Response Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any disaster category to access recognizable warning signs, Do's & Don'ts, and checklists.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('disasters')}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {disasterCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.type}
                onClick={() => {
                  setSelectedDisasterType(cat.type);
                  setActiveTab('disasters');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] flex flex-col justify-between ${cat.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                    {cat.risk}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {cat.type}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Protocols & emergency contacts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REAL-TIME NATIONAL DEMOGRAPHIC RESCUE TELEMETRY (Section 37, 38) */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="font-extrabold text-base tracking-wide">
              Live National Rescue Telemetry & Demographic Progress
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {simulationState.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Estimated Exposed</span>
            <div className="text-3xl font-black text-white mt-1">
              {simulationState.affected_population.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Impact zone demographic count</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-emerald-400 uppercase font-semibold">Confirmed Safe in Shelters</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              {simulationState.safe_checkins.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">Verified shelter & family check-ins</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-amber-400 uppercase font-semibold">Unaccounted / Pending Confirmation</span>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {simulationState.unaccounted_population.toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-600 mt-1">Active priority search sector</p>
          </div>
        </div>

        {/* Demographic Progress Breakdown (Section 38) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Vulnerability Evacuation Ratio
          </span>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Children Safe</span>
                <span className="text-emerald-400 font-bold">1,420 / 1,850 (77%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '77%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Elderly Safe</span>
                <span className="text-emerald-400 font-bold">810 / 1,100 (73%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '73%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Mobility Impaired / Disabled Safe</span>
                <span className="text-emerald-400 font-bold">165 / 210 (78%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUICK ACCESS SHORTCUTS FOR RESPONDERS & CITIZENS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('report-disaster')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mb-3">
            <FileCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Report Disaster</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Attach live photos, video, audio notes, and GPS for immediate authority verification.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('volunteers')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Volunteer Network</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Join the vetted responder network for first aid, boat operation, and search missions.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('wildlife')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Wildlife Response</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kaziranga & Sundarbans emergency evacuation coordination for endangered species.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('relief')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Relief & Donations</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct transparent contributions to Chief Minister & Prime Minister Relief Funds.
          </p>
        </div>
      </section>

    </div>
  );
};
