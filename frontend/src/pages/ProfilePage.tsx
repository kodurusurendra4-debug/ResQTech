import React, { useState } from 'react';
import {
  UserCheck,
  FileText,
  Upload,
  CheckCircle,
  Users,
  Award,
  AlertTriangle,
  Heart,
  Eye,
  Plus,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FamilyMember, AgeCategory } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, familyProfile, permissions, requestPermission, updateFamilyProfile } = useAuth();
  const [ocrSimulating, setOcrSimulating] = useState(false);
  const [ocrExtracted, setOcrExtracted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'family' | 'ocr' | 'dedup' | 'permissions'>('profile');

  const handleSimulateOCR = () => {
    setOcrSimulating(true);
    setTimeout(() => {
      setOcrSimulating(false);
      setOcrExtracted(true);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Citizen & Vulnerability Record</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {familyProfile?.head_of_family || 'Citizen Profile'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Household ID: <strong className="font-mono">{familyProfile?.family_id}</strong> • Ration Card Ref: <strong className="text-emerald-600">{familyProfile?.ration_card_number} (Verified)</strong>
          </p>
        </div>

        {/* Sub-tabs navigation */}
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'profile' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveSubTab('family')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'family' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Family ({familyProfile?.total_members || 5})
          </button>
          <button
            onClick={() => setActiveSubTab('ocr')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'ocr' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Ration Card OCR
          </button>
          <button
            onClick={() => setActiveSubTab('dedup')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'dedup' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Household Deduplication
          </button>
          <button
            onClick={() => setActiveSubTab('permissions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'permissions' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Permissions
          </button>
        </div>
      </div>

      {/* 1. PERSONAL PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Personal & Health Vulnerability Attributes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Head of Household</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{familyProfile?.head_of_family}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Phone (OTP)</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{familyProfile?.contact_phone}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Blood Group</span>
              <p className="font-bold text-sm text-red-600">O+ Positive</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Chronic Health Condition</span>
              <p className="font-bold text-sm text-amber-600">Hypertension (Daily Medication)</p>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Residential Address</span>
              <p className="font-semibold text-slate-900 dark:text-white">{familyProfile?.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. FAMILY MEMBERS & VULNERABILITY */}
      {activeSubTab === 'family' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Registered Household Members ({familyProfile?.members.length})
            </h3>
            <span className="text-xs text-slate-500">
              Auto-categorized by Admin Age Thresholds (Child &lt; 14, Elderly &gt; 60)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyProfile?.members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{member.name}</h4>
                      <span className="text-xs text-slate-500">{member.relationship} • Age {member.age}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.age_category === 'Child'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : member.age_category === 'Elderly'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {member.age_category}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p>Blood Group: <strong>{member.blood_group}</strong></p>
                    {member.health_complications && member.health_complications.length > 0 && (
                      <p className="text-amber-600">
                        Medical Note: {member.health_complications.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Citizen
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RATION CARD OCR SIMULATOR (Section 10) */}
      {activeSubTab === 'ocr' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Document OCR Family Extraction (Ration Card / NFSA Digital Card)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload your National Food Security Act (NFSA) or State Digital Ration Card. Our OCR engine extracts members and calculates ages automatically for review.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/40">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Upload Ration Card Image (JPG/PNG/PDF)
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              Supports Andhra Pradesh, Telangana, Tamil Nadu, Odisha Smart Cards
            </p>

            <button
              onClick={handleSimulateOCR}
              disabled={ocrSimulating}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {ocrSimulating ? "Running Optical Character Recognition..." : "Simulate OCR Document Scan"}
            </button>
          </div>

          {ocrExtracted && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Extracted 5 Family Members with 94.2% Confidence</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Extracted: Lakshmi Narayana Rao (65 - Elderly), Saraswathi Rao (62 - Elderly), Srinivas Rao (34 - Adult), Ananya Rao (31 - Adult), Arjun Rao (7 - Child).
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => alert("OCR Members verified and committed to family profile.")}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Verify & Commit Records
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. DUPLICATE HOUSEHOLD DEDUPLICATION (Section 11) */}
      {activeSubTab === 'dedup' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Critical Feature: Section 11 Compliance</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Privacy-Preserving Household Identity & Duplicate Resolution
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Multiple members of the same family often install the app on different phones. Suraksha AI resolves multi-account logins into a single <strong>Household Entity</strong> using cryptographic ration card matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-bold uppercase">Individual App Logins</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">2 Logins</div>
              <p className="text-[11px] text-slate-500 mt-1">Father + Son registered separately</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
              <span className="text-xs text-emerald-600 font-bold uppercase">Resolved Households</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">1 Unique Household</div>
              <p className="text-[11px] text-emerald-500 mt-1">Deduplicated by AP14028921</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800">
              <span className="text-xs text-purple-600 font-bold uppercase">Unique People Counted</span>
              <div className="text-2xl font-black text-purple-600 mt-1">5 Unique People</div>
              <p className="text-[11px] text-purple-500 mt-1">2 Elderly, 1 Child, 2 Adults</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">How Suraksha Solves Statistical Inflation:</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Without duplicate family resolution, 2 members logging in would falsely register as "2 affected families" (e.g. 10 people requiring double rations). Suraksha AI resolves them into 1 domestic unit of 5 individuals, preventing relief duplication while preserving accurate vulnerable headcounts for boat teams.
            </p>
          </div>
        </div>
      )}

      {/* 5. PERMISSIONS MANAGEMENT (Section 8) */}
      {activeSubTab === 'permissions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
            Granular Device Permissions & Privacy Controls
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Suraksha AI requires specific hardware permissions for life-safety features. You can review and toggle permissions at any time.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 dark:text-white block">GPS Geolocation Access</strong>
                <span className="text-slate-500 text-[11px]">Needed to calculate distance to nearest safe cyclone shelters and attach coordinates during SOS.</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg text-xs">
                Granted
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 dark:text-white block">Camera & Video</strong>
                <span className="text-slate-500 text-[11px]">Enables capturing live disaster photos and citizen reports directly from browser.</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg text-xs">
                Granted
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 dark:text-white block">Microphone / Voice Audio</strong>
                <span className="text-slate-500 text-[11px]">Enables voice triage in 10 Indian languages for illiterate or stressed citizens.</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg text-xs">
                Granted
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 dark:text-white block">Emergency Notifications</strong>
                <span className="text-slate-500 text-[11px]">Allows instant broadcast of RED cyclone, flood wave, and evacuation orders.</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg text-xs">
                Granted
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
