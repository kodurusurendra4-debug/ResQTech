import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Shield,
  LifeBuoy,
  Plus,
  Send
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { VolunteerProfile, DisasterType } from '../types';
import { FALLBACK_VOLUNTEERS } from '../services/api';

export const VolunteerPage: React.FC = () => {
  const { simulationState } = useDisaster();
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>(FALLBACK_VOLUNTEERS);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // New volunteer form states
  const [volName, setVolName] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [isExService, setIsExService] = useState(false);
  const [isForestExperienced, setIsForestExperienced] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['First Aid', 'Swimming']);
  const [radius, setRadius] = useState(25);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  const skillsList = [
    'First Aid',
    'Swimming',
    'Boat Operation',
    'Search & Rescue',
    'Emergency Medical',
    'Heavy Vehicle Driving',
    'Electrical / Engineering',
    'Communication & Ham Radio'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    const newVol: VolunteerProfile = {
      id: `VOL-IN-${Date.now().toString().slice(-3)}`,
      name: volName || 'Consented Volunteer Responder',
      phone: volPhone || '+91-9849000000',
      skills: selectedSkills,
      preferred_disasters: ['Flood', 'Cyclone', 'Severe Storm'],
      service_radius_km: radius,
      is_available: true,
      current_latitude: 16.9850,
      current_longitude: 82.2420,
      is_ex_serviceman: isExService,
      is_forest_dept_experienced: isForestExperienced
    };

    setVolunteers(prev => [newVol, ...prev]);
    setEnrolledSuccess(true);
    setTimeout(() => {
      setEnrolledSuccess(false);
      setShowEnrollModal(false);
    }, 1500);
  };

  const handleAcceptAssignment = (volId: string) => {
    setVolunteers(prev =>
      prev.map(v =>
        v.id === volId
          ? { ...v, assigned_incident_id: 'INC-KKD-01 (Surya Rao Peta Flood Relief)' }
          : v
      )
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Community Resilience Network</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Vetted Emergency Volunteer Network
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Mobilizing ex-servicemen, forest workers, veterinarians, swimmers, and medical personnel during natural disasters.
          </p>
        </div>

        <button
          onClick={() => setShowEnrollModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Join Volunteer Network</span>
        </button>
      </div>

      {/* Volunteer Demands KPI Cards (Section 34) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase">Required Volunteers</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {simulationState.volunteer_required}
          </div>
          <p className="text-[11px] text-red-500 mt-1">Immediate active flood sector</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Available Nearby</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {simulationState.volunteer_available}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Within 25 km service radius</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase">Ex-Servicemen Deployed</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            18
          </div>
          <p className="text-[11px] text-blue-500 mt-1">Army / Navy veterans</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-teal-600 font-bold uppercase">Forest Dept / Wildlife Experts</span>
          <div className="text-2xl font-black text-teal-600 mt-1">
            12
          </div>
          <p className="text-[11px] text-teal-500 mt-1">Wildlife rescue & animal handling</p>
        </div>
      </div>

      {/* Volunteer Active Roster */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
          Active Registered Volunteer Roster
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{vol.name}</h4>
                    <span className="text-[11px] text-slate-500">{vol.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>

                {/* Special Qualifications Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {vol.is_ex_serviceman && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Ex-Serviceman
                    </span>
                  )}
                  {vol.is_forest_dept_experienced && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1">
                      <LifeBuoy className="w-3 h-3" /> Forest / Wildlife Expert
                    </span>
                  )}
                </div>

                {/* Skills tags */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {vol.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assignment Status */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {vol.assigned_incident_id ? (
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Assigned: {vol.assigned_incident_id}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcceptAssignment(vol.id)}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Assign to Flood Mission
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 transition-colors">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Join Suraksha Volunteer Network
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your contact details will only be used to notify you of emergencies within your selected service radius. Volunteers are never automatically deployed without explicit consent.
            </p>

            {enrolledSuccess ? (
              <div className="text-center py-8 text-emerald-600 space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto" />
                <p className="font-extrabold text-base">Enrolled Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleEnroll} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number:</label>
                    <input
                      type="tel"
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      placeholder="+91-XXXXX"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Service Experience (Section 32, 33) */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Specialized Service Background:
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isExService}
                      onChange={(e) => setIsExService(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Military / Armed Forces / NDRF / Ex-Serviceman</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isForestExperienced}
                      onChange={(e) => setIsForestExperienced(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Forest Dept / Wildlife Expert / Veterinarian / Animal Rescuer</span>
                  </label>
                </div>

                {/* Skills Checklist */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Select Your Verified Skills:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {skillsList.map((skill) => (
                      <label
                        key={skill}
                        className={`p-2 rounded-lg border text-[11px] cursor-pointer flex items-center gap-2 ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => toggleSkill(skill)}
                          className="rounded text-blue-600"
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                  >
                    Complete Enrollment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
