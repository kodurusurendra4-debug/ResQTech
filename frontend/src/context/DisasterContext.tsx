import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LocalityRiskAssessment,
  SafePlace,
  SOSAlert,
  CitizenReport,
  SimulationStep
} from '../types';
import { api, FALLBACK_RISK, FALLBACK_SHELTERS } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';

interface DisasterContextType {
  isOnline: boolean;
  localityRisk: LocalityRiskAssessment;
  shelters: SafePlace[];
  activeSOSAlerts: SOSAlert[];
  citizenReports: CitizenReport[];
  simulationState: SimulationStep;
  triggerSOS: (params: { notes?: string; membersCount: number; hasElderly: boolean; hasChildren: boolean; hasDisabled: boolean }) => Promise<string>;
  submitCitizenReport: (report: Omit<CitizenReport, 'report_id' | 'timestamp' | 'is_official_verified'>) => Promise<string>;
  checkInToShelter: (shelterId: string, memberCount: number) => Promise<boolean>;
  advanceSimulationStep: () => Promise<void>;
  resetSimulationStep: () => Promise<void>;
  userLocation: { lat: number; lng: number; locality: string };
  setUserLocation: (loc: { lat: number; lng: number; locality: string }) => void;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [localityRisk, setLocalityRisk] = useState<LocalityRiskAssessment>(FALLBACK_RISK);
  const [shelters, setShelters] = useState<SafePlace[]>(FALLBACK_SHELTERS);
  const [activeSOSAlerts, setActiveSOSAlerts] = useState<SOSAlert[]>([]);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationStep>({
    step_number: 1,
    title: "Initial Baseline Weather Advisory",
    description: "Normal monsoon monitoring. Locality risk is GREEN (28/100).",
    risk_level: "GREEN",
    risk_score: 28.0,
    active_locality: "Kakinada Coastal Sector",
    affected_population: 0,
    unaccounted_population: 0,
    safe_checkins: 0,
    volunteer_required: 5,
    volunteer_available: 18,
    vehicles_required: 2,
    wildlife_rescued: 0
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; locality: string }>({
    lat: 16.9834,
    lng: 82.2451,
    locality: "Surya Rao Peta, Kakinada"
  });

  // Track network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial data hydration
    api.getLocalityRisk().then(setLocalityRisk);
    api.getShelters().then(data => {
      setShelters(data);
      offlineStorage.cacheShelters(data);
    });
    api.getSimulationState().then(setSimulationState);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper for dynamic WebSocket URL resolution
  const getWebSocketUrl = (): string => {
    if (import.meta.env.VITE_WS_BASE_URL) {
      return import.meta.env.VITE_WS_BASE_URL;
    }
    if (typeof window !== 'undefined') {
      if (window.location.port === '5173') {
        return 'ws://localhost:8000/ws/live';
      }
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/ws/live`;
    }
    return 'ws://localhost:8000/ws/live';
  };

  // Real-time WebSocket connection to backend with auto-reconnect
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;
      try {
        const wsUrl = getWebSocketUrl();
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[Suraksha Telemetry] WebSocket connected to', wsUrl);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === 'SIMULATION_STEP_CHANGED' || data.event === 'SIMULATION_RESET') {
              setSimulationState(data.step);
              // Reflect in locality risk
              setLocalityRisk(prev => ({
                ...prev,
                risk_score: data.step.risk_score,
                risk_level: data.step.risk_level,
                population_affected_estimate: data.step.affected_population
              }));
            } else if (data.event === 'SHELTER_CHECKIN') {
              setShelters(prev => prev.map(s => s.id === data.shelter_id ? { ...s, current_occupancy: data.new_occupancy } : s));
            } else if (data.event === 'NEW_SOS_ALERT') {
              const newAlert: SOSAlert = {
                incident_id: data.incident_id,
                user_id: 'USER-REMOTE',
                user_name: 'Distressed Citizen',
                user_phone: '+91-XXXXX',
                latitude: data.latitude,
                longitude: data.longitude,
                locality: data.locality,
                timestamp: data.timestamp,
                emergency_type: 'Flash Flood Inundation',
                severity: data.severity,
                family_members_count: data.family_members_count,
                has_elderly: true,
                has_children: true,
                has_disabled: false,
                status: 'Active'
              };
              setActiveSOSAlerts(prev => [newAlert, ...prev]);
            }
          } catch (e) {
            console.error("WS Parse error:", e);
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            // Reconnect after 5 seconds
            reconnectTimer = setTimeout(connect, 5000);
          }
        };

        ws.onerror = (err) => {
          console.warn("WebSocket error (will attempt reconnection):", err);
          ws?.close();
        };
      } catch (err) {
        console.warn("WebSocket could not connect (operating in standalone demo mode):", err);
        if (!isUnmounted) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);


  const triggerSOS = async (params: {
    notes?: string;
    membersCount: number;
    hasElderly: boolean;
    hasChildren: boolean;
    hasDisabled: boolean;
  }): Promise<string> => {
    const alertId = `SOS-${Date.now().toString().slice(-6)}`;
    const newAlert: SOSAlert = {
      incident_id: alertId,
      user_id: 'USER-AP-01',
      user_name: 'Lakshmi Narayana Rao',
      user_phone: '+91-9849001122',
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      locality: userLocation.locality,
      timestamp: new Date().toISOString(),
      emergency_type: 'Life Threatening Emergency',
      severity: 'RED',
      text_message: params.notes || 'Immediate rescue evacuation required. Lowland water rising.',
      family_members_count: params.membersCount,
      has_elderly: params.hasElderly,
      has_children: params.hasChildren,
      has_disabled: params.hasDisabled,
      status: 'Active'
    };

    setActiveSOSAlerts(prev => [newAlert, ...prev]);

    if (!isOnline) {
      offlineStorage.draftOfflineIncident({
        disaster_type: 'SOS Emergency Alert',
        description: params.notes || 'Offline SOS triggered',
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        timestamp: new Date().toISOString()
      });
      return alertId;
    }

    await api.triggerSOS(newAlert);
    return alertId;
  };

  const submitCitizenReport = async (report: Omit<CitizenReport, 'report_id' | 'timestamp' | 'is_official_verified'>): Promise<string> => {
    const reportId = `REP-${Date.now().toString().slice(-4)}`;
    const fullReport: CitizenReport = {
      ...report,
      report_id: reportId,
      timestamp: new Date().toISOString(),
      is_official_verified: false
    };

    setCitizenReports(prev => [fullReport, ...prev]);

    if (!isOnline) {
      offlineStorage.draftOfflineIncident({
        disaster_type: report.disaster_type,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
        timestamp: new Date().toISOString()
      });
      return reportId;
    }

    await api.submitReport(fullReport);
    return reportId;
  };

  const checkInToShelter = async (shelterId: string, memberCount: number): Promise<boolean> => {
    setShelters(prev => prev.map(s => {
      if (s.id === shelterId) {
        return { ...s, current_occupancy: s.current_occupancy + memberCount };
      }
      return s;
    }));

    // Increment safe checkins in simulation state
    setSimulationState(prev => ({
      ...prev,
      safe_checkins: prev.safe_checkins + memberCount,
      unaccounted_population: Math.max(0, prev.unaccounted_population - memberCount)
    }));

    if (isOnline) {
      await api.checkinShelter({
        shelter_id: shelterId,
        user_id: 'USER-AP-01',
        member_ids: ['MEM-01', 'MEM-02', 'MEM-03', 'MEM-04', 'MEM-05'].slice(0, memberCount),
        latitude: userLocation.lat,
        longitude: userLocation.lng
      });
    }
    return true;
  };

  const advanceSimulationStep = async () => {
    const next = await api.nextSimulationStep();
    setSimulationState(next);
    setLocalityRisk(prev => ({
      ...prev,
      risk_score: next.risk_score,
      risk_level: next.risk_level,
      population_affected_estimate: next.affected_population
    }));
  };

  const resetSimulationStep = async () => {
    const reset = await api.resetSimulation();
    setSimulationState(reset);
    setLocalityRisk(prev => ({
      ...prev,
      risk_score: reset.risk_score,
      risk_level: reset.risk_level,
      population_affected_estimate: reset.affected_population
    }));
  };

  return (
    <DisasterContext.Provider
      value={{
        isOnline,
        localityRisk,
        shelters,
        activeSOSAlerts,
        citizenReports,
        simulationState,
        triggerSOS,
        submitCitizenReport,
        checkInToShelter,
        advanceSimulationStep,
        resetSimulationStep,
        userLocation,
        setUserLocation
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
