import React from 'react';
import {
  Settings,
  Play,
  RotateCcw,
  Activity,
  Users,
  Shield,
  LifeBuoy,
  Truck,
  Building,
  AlertTriangle,
  CheckCircle,
  Radio,
  Eye
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

export const AdminDashboardPage: React.FC = () => {
  const { simulationState, advanceSimulationStep, resetSimulationStep } = useDisaster();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Executive Command & Control (Super Admin)</span>
          </div>
          <h2 className="text-2xl font-black">
            National Disaster Administration & Emergency Simulation Console
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure risk model weights, monitor multi-agency resource pipelines, and launch the interactive 11-step hackathon disaster cascade.
          </p>
        </div>

        {/* Presentation Simulation Controls (Section 54, 66) */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <button
            onClick={advanceSimulationStep}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Advance Cascade Step ({simulationState.step_number}/5)</span>
          </button>

          <button
            onClick={resetSimulationStep}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors"
            title="Reset Simulation to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. HACKATHON PRESENTATION MODE CARD (Section 66) */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-2 border-amber-600/50 rounded-2xl p-6 shadow-xl space-y-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-amber-400">
              Interactive Hackathon Presentation Cascade Active
            </span>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            simulationState.risk_level === 'RED'
              ? 'bg-red-600 text-white'
              : simulationState.risk_level === 'YELLOW'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-emerald-600 text-white'
          }`}>
            Phase {simulationState.step_number}: {simulationState.risk_level} ({simulationState.risk_score}/100)
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-white">{simulationState.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {simulationState.description}
          </p>
        </div>

        {/* 5-Step Visual Progress Bar */}
        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono font-bold pt-2">
          {[
            { step: 1, label: "Baseline Monitoring (GREEN)" },
            { step: 2, label: "Cyclone Surge Warning (YELLOW)" },
            { step: 3, label: "RED Risk & Evacuation Trigger" },
            { step: 4, label: "Thermal CV & Shelter Check-ins" },
            { step: 5, label: "Relief & Final Accounting" }
          ].map((s) => (
            <div
              key={s.step}
              className={`p-2 rounded-xl border transition-all ${
                simulationState.step_number === s.step
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400 font-black'
                  : simulationState.step_number > s.step
                  ? 'bg-emerald-950/40 border-emerald-700 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <div>Step {s.step}</div>
              <div className="text-[9px] font-sans font-normal mt-0.5 line-clamp-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. EXECUTIVE KPIs (Section 64) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Impact Population</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {simulationState.affected_population.toLocaleString()}
          </div>
          <p className="text-[10px] text-red-500 mt-1">Surya Rao Peta Sector</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Confirmed Safe Check-Ins</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {simulationState.safe_checkins.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">Deduplicated Citizens Safe</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Unaccounted / Searching</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {simulationState.unaccounted_population.toLocaleString()}
          </div>
          <p className="text-[10px] text-amber-500 mt-1">NDRF Search Target</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Wildlife Corridor Evacuated</span>
          <div className="text-2xl font-black text-teal-600 mt-1">
            {simulationState.wildlife_rescued}
          </div>
          <p className="text-[10px] text-teal-500 mt-1">Animals Secured at Transit Hub</p>
        </div>
      </div>

      {/* 3. MULTI-AGENCY ROLE-BASED ACCESS CONTROLS (RBAC - Section 46) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Active Role-Based Access Control (RBAC Directory)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { role: 'Citizen', access: 'SOS, Safe Places, Chatbot, Reporting, Profile', color: 'bg-slate-100 dark:bg-slate-800' },
            { role: 'Volunteer', access: 'Disaster Alerts, Mission Acceptance, Skills Matrix', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300' },
            { role: 'Rescue Team (NDRF/SDRF)', access: 'Priority Queue, Dispatch, Thermal Sensor CV', color: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300' },
            { role: 'Forest/Wildlife Team', access: 'Protected Areas, Translocation, Animal Transit', color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300' },
            { role: 'Medical Response', access: 'Trauma Triage, Bed Tracking, Blood Logistics', color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300' },
            { role: 'District Admin', access: 'Order Evacuation, Shelter Activation, Alerts', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' },
            { role: 'State Admin (SDMA)', access: 'Inter-district Resource Dispatch, Treasury Grants', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300' },
            { role: 'Super Admin', access: 'AI Risk Engine Calibration, Telemetry Feeds', color: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' }
          ].map((r, idx) => (
            <div key={idx} className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 ${r.color}`}>
              <span className="font-bold block mb-1">{r.role}</span>
              <span className="text-[10px] opacity-80 leading-snug">{r.access}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
