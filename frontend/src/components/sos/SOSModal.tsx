import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  X,
  Phone,
  Camera,
  Mic,
  Send,
  Navigation,
  CheckCircle,
  Users,
  MessageSquare
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { offlineStorage } from '../../services/offlineStorage';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShelters: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, onOpenShelters }) => {
  const { isOnline, userLocation, triggerSOS } = useDisaster();
  const { familyProfile } = useAuth();
  const { t } = useThemeLanguage();

  const [countdown, setCountdown] = useState<number | null>(5);
  const [sosDispatched, setSosDispatched] = useState<boolean>(false);
  const [alertId, setAlertId] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [recordedVoice, setRecordedVoice] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<boolean>(false);

  // 5-second anti-accidental countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isOpen && countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (isOpen && countdown === 0 && !sosDispatched) {
      handleFinalSOSDispatch();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, sosDispatched]);

  if (!isOpen) return null;

  const cancelSOS = () => {
    setCountdown(null);
    setSosDispatched(false);
    onClose();
  };

  const handleFinalSOSDispatch = async () => {
    setCountdown(null);
    const id = await triggerSOS({
      notes: additionalNotes || 'High water level inundation. Immediate family rescue requested.',
      membersCount: familyProfile?.total_members || 5,
      hasElderly: (familyProfile?.elderly_count || 0) > 0,
      hasChildren: (familyProfile?.children_count || 0) > 0,
      hasDisabled: (familyProfile?.disabled_count || 0) > 0
    });
    setAlertId(id);
    setSosDispatched(true);
  };

  const smsTriggerUrl = offlineStorage.generateSMSFallback(
    alertId || 'EMERGENCY',
    userLocation.lat,
    userLocation.lng,
    familyProfile?.total_members || 5,
    additionalNotes
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border-2 border-red-600 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-white transition-colors">
        
        {/* Urgent Emergency Header */}
        <div className="bg-red-600 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-lg">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">EMERGENCY SOS DISPATCH</h2>
            <p className="text-xs text-red-100 mt-1 max-w-sm">
              Coordinates broadcast to District Control Room (1077), NDRF Unit & Police HQ.
            </p>
          </div>
          
          <button
            onClick={cancelSOS}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {countdown !== null && countdown > 0 ? (
            /* ACCIDENTAL ACTIVATION COUNTDOWN SCREEN */
            <div className="text-center py-4">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Emergency dispatching automatically in:
              </p>
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-red-600 flex items-center justify-center text-4xl font-black text-red-600 animate-pulse my-4">
                {countdown}
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Press cancel if triggered by mistake.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelSOS}
                  className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-white rounded-xl font-bold text-sm transition-colors"
                >
                  CANCEL DISPATCH
                </button>
                <button
                  onClick={handleFinalSOSDispatch}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm shadow-lg shadow-red-600/30 transition-colors"
                >
                  DISPATCH NOW
                </button>
              </div>
            </div>
          ) : (
            /* SOS DISPATCHED CONFIRMATION & EVIDENCE INPUT */
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                    SOS Incident Active ({alertId || 'SOS-ACTIVE'})
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)} ({userLocation.locality}).
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    Family: 5 members (2 Elderly, 1 Child) tagged with highest rescue priority rank.
                  </p>
                </div>
              </div>

              {/* Attachments: Voice, Photo, Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Optional Emergency Context:
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="E.g., Grandfather has high BP medication trapped on 1st floor..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  rows={2}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setRecordedVoice(!recordedVoice)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      recordedVoice
                        ? 'bg-red-50 border-red-400 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{recordedVoice ? "Voice Note Attached (14s)" : "Record Voice Note"}</span>
                  </button>

                  <button
                    onClick={() => setCapturedPhoto(!capturedPhoto)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      capturedPhoto
                        ? 'bg-red-50 border-red-400 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{capturedPhoto ? "Photo Attached" : "Snap Situation Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Offline SMS Direct Fallback */}
              {!isOnline && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl text-xs">
                  <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    Cellular Offline Detected:
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mb-2">
                    Click below to open native SMS dialer with pre-formatted emergency coordinates for 112.
                  </p>
                  <a
                    href={smsTriggerUrl}
                    className="block text-center py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs"
                  >
                    SEND SMS TO 112 NOW
                  </a>
                </div>
              )}

              {/* Direct Next Steps */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenShelters();
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>View Route to Safe Shelter (1.8 km)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:112"
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call 112 Control</span>
                  </a>
                  <a
                    href="tel:108"
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    <span>Call 108 Ambulance</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
