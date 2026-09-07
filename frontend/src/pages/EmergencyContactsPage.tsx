import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Users,
  Plus,
  Trash2,
  Share2,
  ExternalLink,
  Info,
  Phone
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface PersonalContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternate_phone?: string;
}

export const EmergencyContactsPage: React.FC = () => {
  const { userLocation } = useDisaster();
  const { t } = useThemeLanguage();

  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([
    { id: '1', name: 'Srinivas Rao', relationship: 'Son', phone: '+91-9849556677', alternate_phone: '+91-9440123456' },
    { id: '2', name: 'Dr. Priya Sundaram', relationship: 'Family Physician', phone: '+91-9444123890' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRel, setNewRel] = useState('Relative');
  const [newPhone, setNewPhone] = useState('');

  const officialDirectory = [
    { name: "National Emergency Service (All-in-One)", number: "112", role: "Police, Fire, Ambulance Coordination", source: "Ministry of Home Affairs" },
    { name: "National Disaster Response Force (NDRF)", number: "011-24363260", role: "Specialized Search & Extrication Rescue", source: "NDRF HQ New Delhi" },
    { name: "State Emergency Operations Centre (SEOC)", number: "1070", role: "State Disaster Management Authority Toll Free", source: "SDMA Directory" },
    { name: "District Emergency Control Room (DEOC)", number: "1077", role: "District Collectorate Operations Center", source: "District Administration" },
    { name: "Emergency Medical Ambulance", number: "108", role: "Trauma & Advanced Life Support Fleet", source: "National Health Mission" },
    { name: "Fire & Rescue Emergency", number: "101", role: "Fire Extrication & Urban Rescue", source: "Directorate General Fire Services" },
    { name: "Indian Coast Guard Rescue (MRCC)", number: "1554", role: "Maritime Distress & Cyclone Sea Rescue", source: "Ministry of Defence" },
    { name: "Forest Dept Wildlife Distress Hotline", number: "1800-425-4733", role: "Wildlife Rescue & Human-Animal Conflict", source: "MoEFCC" }
  ];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    const newEntry: PersonalContact = {
      id: Date.now().toString(),
      name: newName,
      relationship: newRel,
      phone: newPhone
    };
    setPersonalContacts(prev => [...prev, newEntry]);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const deleteContact = (id: string) => {
    setPersonalContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Directory</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Official Emergency Numbers & Family Contacts
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Verified Indian emergency organizations and personal emergency contacts. Tap to dial directly from any mobile or desktop browser.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Contact</span>
        </button>
      </div>

      {/* 1. PERSONAL EMERGENCY CONTACTS (Notified during SOS) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Personal Family Emergency Contacts ({personalContacts.length})</span>
          </h3>
          <span className="text-[11px] text-slate-500">Automatically notified via SMS during SOS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {personalContacts.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {c.relationship}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">{c.phone}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                <a
                  href={`tel:${c.phone}`}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => deleteContact(c.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. OFFICIAL VERIFIED EMERGENCY DIRECTORY (Section 19) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Official Verified Emergency Organizations (India)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialDirectory.map((org, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start justify-between gap-3 hover:border-red-400 transition-colors"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{org.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{org.role}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Verified: {org.source}</span>
              </div>

              <a
                href={`tel:${org.number.replace(/[^0-9]/g, '')}`}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shrink-0 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>{org.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Add Emergency Contact</h3>
            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Name:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="E.g. Ramesh Rao"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relationship:</label>
                <input
                  type="text"
                  value={newRel}
                  onChange={(e) => setNewRel(e.target.value)}
                  placeholder="E.g. Spouse / Son / Doctor"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number:</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91-XXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
