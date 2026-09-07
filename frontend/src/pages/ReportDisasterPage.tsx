import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  Camera,
  Video,
  Mic,
  Send,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { DisasterType, RiskLevel } from '../types';
import { useDisaster } from '../context/DisasterContext';

export const ReportDisasterPage: React.FC<{ initialDisaster?: DisasterType }> = ({ initialDisaster = 'Flood' }) => {
  const { userLocation, submitCitizenReport } = useDisaster();

  const [citizenName, setCitizenName] = useState('Lakshmi Narayana Rao');
  const [citizenPhone, setCitizenPhone] = useState('+91-9849001122');
  const [disasterType, setDisasterType] = useState<DisasterType>(initialDisaster);
  const [severity, setSeverity] = useState<RiskLevel>('RED');
  const [description, setDescription] = useState('');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [isVoiceRecorded, setIsVoiceRecorded] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide a brief description of the incident.");
      return;
    }

    const reportId = await submitCitizenReport({
      citizen_name: citizenName,
      citizen_phone: citizenPhone,
      disaster_type: disasterType,
      severity: severity,
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      description: description,
      media_url: isPhotoCaptured ? "https://suraksha.gov.in/evidence/photo_01.jpg" : undefined
    });

    setSubmittedReportId(reportId);
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-red-600 mb-1 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Citizen Disaster Reporting Portal</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Report Active Disaster Incident
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Reports are geocoded and relayed to the District Emergency Operations Centre (DEOC) and nearby NDRF/SDRF units for validation.
        </p>
      </div>

      {/* Distinction notice (Section 6 & 18) */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-300">
        <Info className="w-5 h-5 text-amber-500 shrink-0" />
        <span>
          <strong>COMMUNITY REPORT NOTICE:</strong> Citizen submissions are categorized as "COMMUNITY REPORT - PENDING VERIFICATION" until verified by official district authorities to prevent disinformation.
        </span>
      </div>

      {submittedReportId ? (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-3 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-extrabold text-lg">Report Submitted Successfully!</h3>
          <p className="text-xs max-w-md mx-auto">
            Incident Tracking ID: <strong>{submittedReportId}</strong>. Relayed to Kakinada District Collectorate & SDMA Central Dispatch.
          </p>
          <button
            onClick={() => setSubmittedReportId(null)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          
          {/* Geolocation Lock */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{userLocation.locality}</span>
                <span className="text-slate-500 text-[10px] block">
                  Lat: {userLocation.lat.toFixed(4)}°, Lng: {userLocation.lng.toFixed(4)}°
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              GPS Attached
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Disaster Category:
              </label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Flood">Flood</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Tsunami">Tsunami</option>
                <option value="Landslide">Landslide</option>
                <option value="Drought">Drought</option>
                <option value="Heatwave">Heatwave</option>
                <option value="Industrial Leakage">Industrial Leakage</option>
                <option value="Fire">Fire</option>
                <option value="Building Collapse">Building Collapse</option>
                <option value="Severe Storm">Severe Storm</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Observed Severity:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="RED">RED - Catastrophic / Rising Fast</option>
                <option value="YELLOW">YELLOW - Moderate Risk</option>
                <option value="GREEN">GREEN - Minor / Precautionary</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Incident Details & Trapped Count:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is happening: water level, collapsed structures, stranded residents..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              rows={3}
              required
            />
          </div>

          {/* Media Evidence Upload Simulation */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Attach Evidence (Photo / Video / Voice):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIsPhotoCaptured(!isPhotoCaptured)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isPhotoCaptured
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{isPhotoCaptured ? "Photo Added" : "Snap Photo"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoRecorded(!isVideoRecorded)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isVideoRecorded
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{isVideoRecorded ? "Video (12s)" : "Record Video"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVoiceRecorded(!isVoiceRecorded)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isVoiceRecorded
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isVoiceRecorded ? "Voice Note" : "Voice Note"}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>SUBMIT CITIZEN REPORT TO EMERGENCY COMMAND</span>
          </button>
        </form>
      )}

    </div>
  );
};
