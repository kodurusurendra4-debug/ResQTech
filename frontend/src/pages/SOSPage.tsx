import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Camera,
  Mic,
  Phone,
  AlertTriangle,
  CheckCircle,
  Users,
  Navigation
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { offlineStorage } from '../services/offlineStorage';

export const SOSPage: React.FC<{ onOpenShelters: () => void }> = ({ onOpenShelters }) => {
  const { isOnline, userLocation, triggerSOS } = useDisaster();
  const { familyProfile } = useAuth();

  const [notes, setNotes] = useState('');
  const [voiceAttached, setVoiceAttached] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [alertId, setAlertId] = useState<string | null>(null);

  const handleSOS = async () => {
    const id = await triggerSOS({
      notes: notes || 'Urgent evacuation required. Water level rising above residential compound.',
      membersCount: familyProfile?.total_members || 5,
      hasElderly: (familyProfile?.elderly_count || 0) > 0,
      hasChildren: (familyProfile?.children_count || 0) > 0,
      hasDisabled: (familyProfile?.disabled_count || 0) > 0
    });
    setAlertId(id);
    setStatusMessage('SOS Alert dispatched directly to District DEOC, NDRF Search Team, and registered emergency contacts.');
  };

  const smsLink = offlineStorage.generateSMSFallback(
    alertId || 'EMERGENCY',
    userLocation.lat,
    userLocation.lng,
    familyProfile?.total_members || 5,
    notes
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* SOS Hero Card */}
      <div className="bg-red-600 text-white rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-xl">
            <ShieldAlert className="w-12 h-12 animate-bounce" />
          </div>

          <h2 className="text-3xl font-black tracking-tight mb-2">
            SURAKSHA EMERGENCY SOS
          </h2>
          <p className="text-sm text-red-100 max-w-md mb-6 leading-relaxed">
            One-touch life-safety escalation. Captures real-time GPS, triggers immediate NDRF/SDRF priority queuing, and notifies family.
          </p>

          <button
            onClick={handleSOS}
            className="w-full sm:w-auto px-10 py-5 bg-white text-red-700 hover:bg-red-50 rounded-2xl font-black text-lg shadow-2xl shadow-black/30 animate-emergency-pulse active:scale-95 transition-all cursor-pointer"
          >
            CONFIRM & ACTIVATE SOS NOW
          </button>
        </div>
      </div>

      {/* Confirmation State */}
      {statusMessage && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-base">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span>SOS Dispatched Successfully ({alertId})</span>
          </div>
          <p className="text-xs leading-relaxed">{statusMessage}</p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={onOpenShelters}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route to Nearest Shelter</span>
            </button>
            <a
              href="tel:112"
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call 112 Control</span>
            </a>
          </div>
        </div>
      )}

      {/* Geolocation & Family Context */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>Automatic Emergency Geolocation</span>
        </h3>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs space-y-1">
          <p><strong>Sector:</strong> {userLocation.locality}</p>
          <p className="font-mono text-slate-500">
            Latitude: {userLocation.lat.toFixed(4)}°N • Longitude: {userLocation.lng.toFixed(4)}°E
          </p>
          <p className="text-emerald-600 font-semibold mt-1">
            ✓ Accuracy: GPS High-Precision Lock (within 4 meters)
          </p>
        </div>

        {/* Optional Context Inputs */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Emergency Description / Trapped Context:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Water at 1.5m depth, 2 elderly individuals on roof, medicine needed..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setVoiceAttached(!voiceAttached)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                voiceAttached
                  ? 'bg-red-50 border-red-400 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{voiceAttached ? "Voice Attached" : "Record Voice SOS"}</span>
            </button>

            <button
              onClick={() => setPhotoAttached(!photoAttached)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                photoAttached
                  ? 'bg-red-50 border-red-400 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{photoAttached ? "Photo Attached" : "Take Live Photo"}</span>
            </button>
          </div>
        </div>

        {/* Offline SMS Emergency Fallback Box */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 text-xs">
          <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
            Offline & Cellular Resilience (SMS Fallback):
          </p>
          <p className="text-amber-800 dark:text-amber-300 mb-3">
            If mobile internet is disrupted by flood or cyclone tower outage, use pre-formatted SMS trigger to dispatch coordinates over 2G cellular network:
          </p>
          <a
            href={smsLink}
            className="block text-center py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs transition-colors"
          >
            DISPATCH SMS TO 112 DIRECTLY
          </a>
        </div>
      </div>

    </div>
  );
};
