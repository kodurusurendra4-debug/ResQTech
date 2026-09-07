// Offline & Low-Connectivity Resilience Layer (Section 26)
// Provides IndexedDB / LocalStorage caching and offline SMS fallback generator

export interface OfflineIncidentDraft {
  id: string;
  disaster_type: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  is_synced: boolean;
}

const OFFLINE_SHELTERS_KEY = 'suraksha_offline_shelters';
const OFFLINE_CONTACTS_KEY = 'suraksha_offline_contacts';
const OFFLINE_INCIDENTS_KEY = 'suraksha_offline_incidents';
const OFFLINE_LAST_LOCATION_KEY = 'suraksha_offline_last_location';

export const offlineStorage = {
  saveLastLocation: (lat: number, lng: number, locality: string) => {
    localStorage.setItem(OFFLINE_LAST_LOCATION_KEY, JSON.stringify({ lat, lng, locality, time: new Date().toISOString() }));
  },

  getLastLocation: () => {
    const raw = localStorage.getItem(OFFLINE_LAST_LOCATION_KEY);
    return raw ? JSON.parse(raw) : { lat: 16.9834, lng: 82.2451, locality: "Kakinada Lowlands", time: new Date().toISOString() };
  },

  cacheShelters: (shelters: any[]) => {
    localStorage.setItem(OFFLINE_SHELTERS_KEY, JSON.stringify(shelters));
  },

  getCachedShelters: (): any[] => {
    const raw = localStorage.getItem(OFFLINE_SHELTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  cacheEmergencyContacts: (contacts: any[]) => {
    localStorage.setItem(OFFLINE_CONTACTS_KEY, JSON.stringify(contacts));
  },

  getCachedEmergencyContacts: (): any[] => {
    const raw = localStorage.getItem(OFFLINE_CONTACTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  draftOfflineIncident: (draft: Omit<OfflineIncidentDraft, 'id' | 'is_synced'>) => {
    const existing = offlineStorage.getOfflineIncidents();
    const newDraft: OfflineIncidentDraft = {
      ...draft,
      id: `DRAFT-${Date.now()}`,
      is_synced: false
    };
    existing.push(newDraft);
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(existing));
    return newDraft;
  },

  getOfflineIncidents: (): OfflineIncidentDraft[] => {
    const raw = localStorage.getItem(OFFLINE_INCIDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  markIncidentSynced: (draftId: string) => {
    const existing = offlineStorage.getOfflineIncidents();
    const updated = existing.map(item => item.id === draftId ? { ...item, is_synced: true } : item);
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(updated));
  },

  // Generates offline SMS trigger string for 112
  generateSMSFallback: (incidentId: string, lat: number, lng: number, memberCount: number, notes?: string) => {
    const text = `SURAKSHA SOS! ID:${incidentId} LOC:${lat.toFixed(4)},${lng.toFixed(4)} PPL:${memberCount} ${notes ? 'INFO:' + notes.slice(0, 50) : ''}`;
    // URI format for initiating SMS on iOS & Android
    return `sms:112?body=${encodeURIComponent(text)}`;
  }
};
