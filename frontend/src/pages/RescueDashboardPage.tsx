import React, { useState, useEffect } from 'react';
import {
  Radio,
  Users,
  AlertTriangle,
  Clock,
  Shield,
  Navigation,
  CheckCircle,
  Truck,
  Activity,
  Stethoscope,
  LifeBuoy
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { RescuePriorityItem, ResourceDemand } from '../types';
import { api, FALLBACK_PRIORITY_INCIDENTS } from '../services/api';
import { ThermalVisualizer } from '../components/thermal/ThermalVisualizer';

export const RescueDashboardPage: React.FC = () => {
  const { localityRisk, simulationState } = useDisaster();
  const [priorityQueue, setPriorityQueue] = useState<RescuePriorityItem[]>(FALLBACK_PRIORITY_INCIDENTS);
  const [activeTab, setActiveTab] = useState<'queue' | 'thermal' | 'resources'>('queue');
  const [resourceData, setResourceData] = useState<any>(null);

  useEffect(() => {
    api.getRescuePriorityQueue().then(setPriorityQueue);
    api.getLocalityRisk().then(() => {
      // Simulate resource calculations
      setResourceData({
        teams_required: 54,
        teams_available: 36,
        boats_required: 167,
        boats_available: 92,
        ambulances_required: 64,
        ambulances_available: 48,
        water_required_litres: 45000,
        food_packets_required: 37500
      });
    });
  }, []);

  const dispatchTeam = (incidentId: string) => {
    setPriorityQueue(prev =>
      prev.map(item =>
        item.incident_id === incidentId
          ? { ...item, status: 'TEAM_EN_ROUTE', assigned_team: 'NDRF 10th Battalion Unit Charlie' }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
              OPERATIONAL COMMAND CONSOLE
            </span>
          </div>
          <h2 className="text-2xl font-black">
            NDRF / SDRF & District Rescue Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Population-aware emergency dispatch. Incidents ranked automatically by composite Vulnerability Score: Hazard × Exposure × Demographics × Accessibility.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'queue' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Priority Queue ({priorityQueue.length})
          </button>

          <button
            onClick={() => setActiveTab('thermal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'thermal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thermal LWIR Feed
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Resource Demand Model
          </button>
        </div>
      </div>

      {/* 1. PRIORITY DISPATCH QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>Prioritized Incident Dispatch Queue (By Vulnerability Index)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Formula: P = Severity × Population × Vulnerability × Cutoff Factor
            </span>
          </div>

          <div className="space-y-3">
            {priorityQueue.map((item) => (
              <div
                key={item.incident_id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 flex items-center justify-center font-black text-base shrink-0">
                    #{item.urgency_rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {item.locality}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900">
                        Priority Score: {item.calculated_priority_score}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.incident_id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {item.hazard_type}
                    </p>

                    {/* Demographic concentration badge bar */}
                    <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 mt-2">
                      <span>👥 Total: <strong>{item.total_population}</strong></span>
                      <span>🚼 Children: <strong className="text-blue-600">{item.children}</strong></span>
                      <span>👵 Elderly: <strong className="text-amber-600">{item.elderly}</strong></span>
                      <span>♿ Disabled: <strong className="text-purple-600">{item.disabled}</strong></span>
                      <span>🌊 Cutoff Factor: <strong>{item.accessibility_difficulty}x</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status & Dispatch CTA */}
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <div className="text-xs font-semibold">
                    Status: <span className="text-red-600 font-bold">{item.status}</span>
                  </div>
                  {item.assigned_team ? (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{item.assigned_team}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => dispatchTeam(item.incident_id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Deploy Rescue Boat Team</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. THERMAL SENSOR CV MODULE */}
      {activeTab === 'thermal' && (
        <div>
          <ThermalVisualizer />
        </div>
      )}

      {/* 3. RESOURCE DEMAND & MEDICAL CHECKLIST */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
              Real-Time Rescue Demand: Required vs. Available vs. Gap
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 font-bold uppercase">Rescue Teams</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  54 <span className="text-xs text-slate-400 font-normal">Req</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1 font-semibold">36 Deployed • 18 Gap</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 font-bold uppercase">Inflatable Boats</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  167 <span className="text-xs text-slate-400 font-normal">Req</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1 font-semibold">92 Active • 75 Gap</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 font-bold uppercase">Ambulances</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  64 <span className="text-xs text-slate-400 font-normal">Req</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1 font-semibold">48 Ready • 16 Gap</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 font-bold uppercase">Potable Water</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  45,000 <span className="text-xs text-slate-400 font-normal">Liters</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1 font-semibold">WHO Standard (4.5L/person/day)</div>
              </div>
            </div>
          </div>

          {/* Authorized Medical Equipment SOP (Section 41) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-red-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Medical Equipment Recommendation (Flood Operational SOP)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Authorized by Directorate General of Health Services (DGHS) for rapid deployment triage units.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Waterborne Disease Control</h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  <li>• Chlorine Water Purification Tablets (Halazone)</li>
                  <li>• Oral Rehydration Salts (WHO formula)</li>
                  <li>• Doxycycline 100mg Leptospirosis Prophylaxis</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Trauma & Extrication</h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  <li>• Spine Boards & Floating Basket Stretchers</li>
                  <li>• Waterproof Antiseptic Wound Dressings</li>
                  <li>• Rigid Cervical Immobilization Collars</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">Responder Protection</h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  <li>• Polyvalent Snake Venom Antiserum Vials</li>
                  <li>• Tetanus Toxoid Vaccine Vials</li>
                  <li>• Level-C Waterborne Pathogen PPE</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
