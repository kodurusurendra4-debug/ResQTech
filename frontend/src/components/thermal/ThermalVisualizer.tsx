import React, { useState } from 'react';
import {
  Thermometer,
  Radio,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Info
} from 'lucide-react';
import { ThermalDetection } from '../../types';
import { FALLBACK_THERMAL_DETECTIONS } from '../../services/api';

export const ThermalVisualizer: React.FC = () => {
  const [detections, setDetections] = useState<ThermalDetection[]>(FALLBACK_THERMAL_DETECTIONS);
  const [selectedDetection, setSelectedDetection] = useState<ThermalDetection | null>(detections[0]);
  const [sensorStatus, setSensorStatus] = useState<'ONLINE' | 'STANDBY' | 'DISCONNECTED'>('ONLINE');

  const verifySignature = (id: string) => {
    setDetections(prev =>
      prev.map(d => (d.detection_id === id ? { ...d, verified_by_operator: true } : d))
    );
    if (selectedDetection?.detection_id === id) {
      setSelectedDetection(prev => (prev ? { ...prev, verified_by_operator: true } : null));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white">
      
      {/* Sensor Hardware Header */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">
                FLIR Vue Pro R 640 Radiometric LWIR Feed
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-700 text-emerald-400">
                {sensorStatus} • 30 FPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              NDRF Aerial Search Drone Unit-4 • Altitude: 35m • Sector: Surya Rao Peta Inundation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSensorStatus(sensorStatus === 'ONLINE' ? 'STANDBY' : 'ONLINE')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Switch Sensor
          </button>
        </div>
      </div>

      {/* Important Safety Hardware Notice */}
      <div className="bg-amber-950/40 border-b border-amber-900/50 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-300">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>HARDWARE NOTICE:</strong> Standard smartphone CMOS cameras cannot perform true radiometric thermal imaging. This interface connects to calibrated Long-Wave Infrared (LWIR) sensor payloads.
        </span>
      </div>

      {/* Main Grid: Thermal Feed Canvas & Signatures Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left: Thermal Screen Simulation (Ironbow Spectrum) */}
        <div className="lg:col-span-8 p-4 bg-black flex flex-col items-center justify-center relative">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-purple-900/60 shadow-inner bg-gradient-to-tr from-slate-950 via-purple-950 to-indigo-950">
            
            {/* Ironbow False Color Thermal Canvas Simulation */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background: `
                  radial-gradient(circle at 45% 50%, rgba(254, 240, 138, 0.9) 0%, rgba(239, 68, 68, 0.7) 25%, rgba(147, 51, 234, 0.5) 55%, rgba(15, 23, 42, 0.9) 100%),
                  radial-gradient(circle at 75% 35%, rgba(254, 240, 138, 0.8) 0%, rgba(239, 68, 68, 0.6) 20%, rgba(147, 51, 234, 0.4) 45%, rgba(15, 23, 42, 0) 70%),
                  radial-gradient(circle at 25% 75%, rgba(249, 115, 22, 0.6) 0%, rgba(147, 51, 234, 0.3) 40%, rgba(15, 23, 42, 0) 65%)
                `
              }}
            />

            {/* Crosshair & HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[11px] font-mono text-purple-300/80">
              <div className="flex justify-between items-start">
                <div>
                  <p>FOV: 45° × 37°</p>
                  <p>EMISSIVITY: 0.98 (Human Skin)</p>
                </div>
                <div className="text-right">
                  <p>TEMP RANGE: 12.0°C - 44.5°C</p>
                  <p>MODE: RESCUE ISOTHERM</p>
                </div>
              </div>

              {/* Center Crosshairs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-60">
                <div className="w-full h-0.5 bg-white/70 absolute top-1/2" />
                <div className="h-full w-0.5 bg-white/70 absolute left-1/2" />
              </div>

              <div className="flex justify-between items-end">
                <p>NIST CALIBRATED: OK</p>
                <p>GPS: 16.9834°N, 82.2451°E</p>
              </div>
            </div>

            {/* Detected Thermal Bounding Boxes */}
            {detections.map((d) => {
              const isSelected = selectedDetection?.detection_id === d.detection_id;
              const isHuman = d.target_type.includes('Human');
              const isAnimal = d.target_type.includes('Animal');

              let borderColor = 'border-purple-400';
              let badgeBg = 'bg-purple-950/80 text-purple-300';
              if (isHuman) {
                borderColor = 'border-emerald-400';
                badgeBg = 'bg-emerald-950/90 text-emerald-300 border-emerald-600';
              } else if (isAnimal) {
                borderColor = 'border-amber-400';
                badgeBg = 'bg-amber-950/90 text-amber-300 border-amber-600';
              }

              return (
                <div
                  key={d.detection_id}
                  onClick={() => setSelectedDetection(d)}
                  style={{
                    left: `${d.bounding_box.x}%`,
                    top: `${d.bounding_box.y}%`,
                    width: `${d.bounding_box.width}%`,
                    height: `${d.bounding_box.height}%`
                  }}
                  className={`absolute border-2 ${borderColor} cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-white scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap border ${badgeBg}`}
                  >
                    {d.temperature_celsius}°C • {d.target_type.split(' ')[0]} ({Math.round(d.confidence * 100)}%)
                  </div>
                </div>
              );
            })}

            {/* Ironbow Temperature Gradient Scale (Right side of screen) */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-36 w-3 rounded bg-gradient-to-t from-black via-purple-600 via-rose-500 via-amber-400 to-white border border-white/30 flex flex-col justify-between py-0.5 text-[8px] font-mono text-white text-right pr-4">
              <span>45°C</span>
              <span>37°C</span>
              <span>28°C</span>
              <span>15°C</span>
            </div>
          </div>
        </div>

        {/* Right: Signature Classifier & Triage Detail */}
        <div className="lg:col-span-4 p-4 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                AI Signature Detections ({detections.length})
              </h4>
              <span className="text-[10px] text-purple-400 font-mono">CV v2.4 Radiometric</span>
            </div>

            <div className="space-y-2 mb-4">
              {detections.map((d) => {
                const isSelected = selectedDetection?.detection_id === d.detection_id;
                return (
                  <button
                    key={d.detection_id}
                    onClick={() => setSelectedDetection(d)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-400'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white line-clamp-1">{d.target_type}</span>
                      <span className="text-[11px] font-mono font-extrabold text-amber-400">
                        {d.temperature_celsius}°C
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Confidence: {Math.round(d.confidence * 100)}%</span>
                      {d.verified_by_operator ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-400">Pending Confirmation</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Detection Detail Box */}
            {selectedDetection && (
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs">
                <div className="font-bold text-white mb-1">{selectedDetection.target_type}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                  {selectedDetection.notes}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-3 bg-slate-900 p-2 rounded-lg text-slate-400">
                  <div>Core Temp: <span className="text-white font-bold">{selectedDetection.temperature_celsius}°C</span></div>
                  <div>Movement: <span className="text-emerald-400 font-bold">{selectedDetection.movement_detected ? 'Active' : 'Static'}</span></div>
                  <div>Sensor ID: <span className="text-slate-300">{selectedDetection.sensor_id.slice(0, 12)}</span></div>
                  <div>Status: <span className={selectedDetection.verified_by_operator ? "text-emerald-400" : "text-amber-400"}>{selectedDetection.verified_by_operator ? 'Verified' : 'Unconfirmed'}</span></div>
                </div>

                {!selectedDetection.verified_by_operator && (
                  <button
                    onClick={() => verifySignature(selectedDetection.detection_id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirm Human Signature & Dispatch Rescue</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Radiometric Computer Vision: Human vs. Animal vs. Debris Differentiation
          </div>
        </div>

      </div>
    </div>
  );
};
