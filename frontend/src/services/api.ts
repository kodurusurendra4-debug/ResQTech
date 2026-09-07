import {
  LocalityRiskAssessment,
  SafePlace,
  SOSAlert,
  CitizenReport,
  VolunteerProfile,
  RescuePriorityItem,
  ThermalDetection,
  WildlifeProtectedArea,
  ResourceDemand,
  SimulationStep
} from '../types';

// Dynamically resolve API Base URL:
// 1. Explicit env var (VITE_API_BASE_URL)
// 2. Local Vite dev server (port 5173) -> http://localhost:8000
// 3. Production unified deployment (Render) -> empty string for relative paths
export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== '') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.port === '5173') {
      return 'http://localhost:8000';
    }
  }
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export async function fetchWithFallback<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      return fallbackData;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Suraksha API] Offline fallback engaged for ${endpoint}:`, err);
    return fallbackData;
  }
}

// Fallback seed definitions
export const FALLBACK_RISK: LocalityRiskAssessment = {
  id: "RISK-KKD-8491",
  locality: "Surya Rao Peta Lowlands",
  mandal_taluk: "Kakinada Urban",
  district: "Kakinada",
  state: "Andhra Pradesh",
  latitude: 16.9834,
  longitude: 82.2451,
  disaster_type: "Flood",
  risk_score: 81.7,
  risk_level: "RED",
  confidence_score: 0.88,
  forecast_window_hours: 24,
  is_advisory_notice: true,
  main_contributing_factors: [
    { name: "24h Precipitation Level", weight: 0.30, score: 74.0, impact_level: "High", description: "Recorded 185 mm torrential rainfall in past 24h." },
    { name: "River Gauge vs Danger Mark", weight: 0.25, score: 85.0, impact_level: "High", description: "Godavari reach at 1.18x of CWC danger threshold." },
    { name: "Lowland Elevation", weight: 0.20, score: 91.6, impact_level: "High", description: "Lowland elevation (4.2m) accelerates flood accumulation." },
    { name: "Population Density Exposure", weight: 0.15, score: 68.3, impact_level: "High", description: "8,200 persons/km² in immediate inundation path." },
    { name: "Demographic Vulnerability", weight: 0.10, score: 85.0, impact_level: "High", description: "34% of residents are children, elderly, or disabled." }
  ],
  population_affected_estimate: 12500,
  vulnerable_population_estimate: {
    children: 1850,
    elderly: 1100,
    disabled: 210,
    adults: 9340
  },
  recommended_actions: [
    "Immediate evacuation of ground floor residences in low-lying sectors.",
    "Pre-position NDRF watercraft and medical triage units.",
    "Activate Government Degree College Multipurpose Cyclone Shelter."
  ],
  historical_context: {
    previous_event: "Godavari Major Deluge",
    year: 2020,
    casualties: 14,
    displaced: 18200,
    source: "Andhra Pradesh SDMA Historical Floods Registry"
  },
  data_source: "IMD Doppler Radar + CWC Telemetry Gauges + Census GIS Base",
  last_updated: new Date().toISOString()
};

export const FALLBACK_SHELTERS: SafePlace[] = [
  {
    id: "SP-AP-KKD-01",
    name: "Government Degree College Multipurpose Cyclone Shelter",
    type: "Cyclone Shelter / High-Ground School",
    latitude: 16.9891,
    longitude: 82.2475,
    distance_km: 1.8,
    total_capacity: 1200,
    current_occupancy: 480,
    is_verified: true,
    accessibility_status: "Wheelchair Ramped & Ground Floor Access",
    facilities: ["Purified Drinking Water", "Kitchen Mass Feeding", "Medical Aid Post", "Solar Backup GenSet", "Sanitation Blocks"],
    contact_person: "Sri R. Venkatesh (Tahsildar / Shelter Custodian)",
    contact_phone: "+91-884-2361122",
    risk_level: "GREEN"
  },
  {
    id: "SP-AP-KKD-02",
    name: "District Government General Hospital (GGH) Emergency Block",
    type: "Tertiary Hospital & Trauma Centre",
    latitude: 16.9604,
    longitude: 82.2381,
    distance_km: 3.2,
    total_capacity: 850,
    current_occupancy: 610,
    is_verified: true,
    accessibility_status: "Full ADA Compliant Ramps & Elevators",
    facilities: ["24x7 Trauma Ward", "Oxygen Plant", "Blood Bank", "Pediatric ICU", "Emergency Triage Wing"],
    contact_person: "Dr. K. Padma (Medical Superintendent)",
    contact_phone: "+91-884-2374400",
    risk_level: "GREEN"
  },
  {
    id: "SP-AP-KKD-03",
    name: "Sri Bhavanarayaswami Community Relief Center",
    type: "Reinforced Concrete Community Hall",
    latitude: 17.0120,
    longitude: 82.2610,
    distance_km: 2.7,
    total_capacity: 600,
    current_occupancy: 210,
    is_verified: true,
    accessibility_status: "Wide Ramped Entry",
    facilities: ["Clean Water Tanks", "Community Kitchen", "Dry Rations Stockpile", "First Aid Kit"],
    contact_person: "M. Satyanarayana (Community President)",
    contact_phone: "+91-9440182736",
    risk_level: "GREEN"
  }
];

export const FALLBACK_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: "VOL-IN-001",
    name: "Subedar Major R. K. Nayak (Retd.)",
    phone: "+91-9849012345",
    email: "rknayak.defence@gmail.com",
    skills: ["Search & Rescue", "First Aid", "Driving", "Communication", "Engineering"],
    preferred_disasters: ["Flood", "Cyclone", "Building Collapse"],
    service_radius_km: 25.0,
    is_available: true,
    current_latitude: 16.9850,
    current_longitude: 82.2420,
    is_ex_serviceman: true,
    is_forest_dept_experienced: false
  },
  {
    id: "VOL-IN-002",
    name: "Dr. Priya Sundaram",
    phone: "+91-9444123890",
    email: "dr.priya.med@rescue-suraksha.org",
    skills: ["Medical", "First Aid", "Communication"],
    preferred_disasters: ["Flood", "Earthquake", "Heatwave"],
    service_radius_km: 15.0,
    is_available: true,
    current_latitude: 16.9920,
    current_longitude: 82.2510,
    is_ex_serviceman: false,
    is_forest_dept_experienced: false
  },
  {
    id: "VOL-IN-003",
    name: "Manoj Barman",
    phone: "+91-9706112984",
    email: "manoj.wildlife.assam@gmail.com",
    skills: ["Boat Operation", "Swimming", "Search & Rescue", "First Aid"],
    preferred_disasters: ["Flood", "Landslide"],
    service_radius_km: 35.0,
    is_available: true,
    current_latitude: 26.5820,
    current_longitude: 93.1650,
    is_ex_serviceman: false,
    is_forest_dept_experienced: true
  }
];

export const FALLBACK_PRIORITY_INCIDENTS: RescuePriorityItem[] = [
  {
    incident_id: "INC-KKD-01",
    locality: "Surya Rao Peta Lowlands",
    hazard_type: "Rapid Flood Inundation (Water level 1.6m and rising)",
    hazard_severity_weight: 2.8,
    total_population: 4500,
    children: 640,
    elderly: 480,
    disabled: 92,
    accessibility_difficulty: 2.6,
    calculated_priority_score: 88.4,
    urgency_rank: 1,
    status: "DISPATCHING_BOAT_TEAM",
    assigned_team: "NDRF 10th Battalion Unit Bravo"
  },
  {
    incident_id: "INC-KKD-02",
    locality: "Jagannaickpur Canal Bund Colony",
    hazard_type: "Canal Breaching & Flash Flood",
    hazard_severity_weight: 2.4,
    total_population: 2800,
    children: 320,
    elderly: 260,
    disabled: 45,
    accessibility_difficulty: 2.2,
    calculated_priority_score: 72.1,
    urgency_rank: 2,
    status: "PENDING_TEAM_ASSIGNMENT"
  },
  {
    incident_id: "INC-KKD-03",
    locality: "Madhavapatnam Industrial Edge",
    hazard_type: "Flood Inundation & Hazardous Material Precaution",
    hazard_severity_weight: 2.0,
    total_population: 1800,
    children: 110,
    elderly: 95,
    disabled: 14,
    accessibility_difficulty: 1.4,
    calculated_priority_score: 48.6,
    urgency_rank: 3,
    status: "ALERT_ISSUED"
  }
];

export const FALLBACK_WILDLIFE: WildlifeProtectedArea[] = [
  {
    id: "PA-KAZIRANGA-01",
    name: "Kaziranga National Park & Tiger Reserve",
    category: "National Park & UNESCO World Heritage Site",
    state: "Assam",
    district: "Golaghat & Nagaon",
    latitude: 26.5775,
    longitude: 93.1711,
    total_area_sq_km: 858.98,
    key_species: [
      { name: "Great Indian One-Horned Rhinoceros", status: "Vulnerable (IUCN)", est_count: 2613, source: "Assam Forest Dept Census 2022" },
      { name: "Asian Elephant", status: "Endangered", est_count: 1100, source: "Project Elephant MoEFCC" },
      { name: "Bengal Tiger", status: "Endangered", est_count: 121, source: "NTCA" },
      { name: "Eastern Swamp Deer", status: "Vulnerable", est_count: 907, source: "Assam Forest Dept 2023" }
    ],
    current_threat_level: "RED",
    active_disaster: "Annual Brahmaputra High Monsoon Surge / Flooding",
    animals_potentially_affected: 320,
    animals_rescued: 184,
    animals_transported: 142,
    destination_shelter: "Centre for Wildlife Rehabilitation and Conservation (CWRC), Panbari Highlands",
    wildlife_volunteers_needed: 35,
    wildlife_volunteers_available: 23
  },
  {
    id: "PA-SUNDARBANS-02",
    name: "Sundarbans Biosphere Reserve",
    category: "Biosphere Reserve & Mangrove Delta",
    state: "West Bengal",
    district: "South 24 Parganas",
    latitude: 21.9497,
    longitude: 89.1833,
    total_area_sq_km: 4260.0,
    key_species: [
      { name: "Royal Bengal Tiger", status: "Endangered", est_count: 100, source: "NTCA Status of Tigers 2022" },
      { name: "Estuarine Crocodile", status: "Least Concern", est_count: 350, source: "WB Forest Directorate" },
      { name: "Fishing Cat", status: "Vulnerable", est_count: 120, source: "Sundarbans Biosphere Authority" }
    ],
    current_threat_level: "YELLOW",
    active_disaster: "Bay of Bengal Severe Depression / Tidal Surge Alert",
    animals_potentially_affected: 85,
    animals_rescued: 48,
    animals_transported: 36,
    destination_shelter: "Sajnekhali Mangrove Wildlife Care Centre",
    wildlife_volunteers_needed: 25,
    wildlife_volunteers_available: 18
  }
];

export const FALLBACK_THERMAL_DETECTIONS: ThermalDetection[] = [
  {
    detection_id: "TH-SIG-8491",
    timestamp: new Date().toISOString(),
    sensor_id: "FLIR-LWIR-DRONE-01",
    target_type: "Human (Probable Child/Adult Survivor)",
    confidence: 0.92,
    temperature_celsius: 36.8,
    bounding_box: { x: 38.5, y: 44.2, width: 12.0, height: 18.0 },
    movement_detected: true,
    verified_by_operator: false,
    notes: "Heat blob on rooftop surrounded by 1.8m floodwaters. Rhythmic respiratory thermal bloom."
  },
  {
    detection_id: "TH-SIG-8492",
    timestamp: new Date().toISOString(),
    sensor_id: "FLIR-LWIR-DRONE-01",
    target_type: "Animal (Stranded Livestock/Dog)",
    confidence: 0.86,
    temperature_celsius: 38.9,
    bounding_box: { x: 68.0, y: 28.0, width: 16.0, height: 14.0 },
    movement_detected: true,
    verified_by_operator: false,
    notes: "Elevated canine/bovine core temp signature on elevated mud mound."
  },
  {
    detection_id: "TH-SIG-8493",
    timestamp: new Date().toISOString(),
    sensor_id: "FLIR-LWIR-DRONE-01",
    target_type: "Debris / Latent Solar Heat",
    confidence: 0.34,
    temperature_celsius: 43.2,
    bounding_box: { x: 18.0, y: 72.0, width: 22.0, height: 16.0 },
    movement_detected: false,
    verified_by_operator: false,
    notes: "Tin roof debris releasing retained thermal radiation. Non-vital pattern."
  }
];

// API Methods
export const api = {
  getLocalityRisk: () => fetchWithFallback<LocalityRiskAssessment>('/api/risk/locality', FALLBACK_RISK),
  getShelters: () => fetchWithFallback<SafePlace[]>('/api/shelters', FALLBACK_SHELTERS),
  checkinShelter: (payload: any) =>
    fetchWithFallback('/api/shelters/checkin', { status: 'CHECKED_IN', message: 'Checked in successfully (offline fallback)' }, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  triggerSOS: (alert: SOSAlert) =>
    fetchWithFallback('/api/sos/trigger', {
      status: 'SOS_DISPATCHED',
      incident_id: alert.incident_id,
      sms_fallback_code: `SMSTO:112:SURAKSHA SOS ${alert.incident_id} LAT ${alert.latitude} LNG ${alert.longitude}`
    }, {
      method: 'POST',
      body: JSON.stringify(alert)
    }),
  submitReport: (report: CitizenReport) =>
    fetchWithFallback('/api/reports/submit', { status: 'SUBMITTED', report_id: report.report_id }, {
      method: 'POST',
      body: JSON.stringify(report)
    }),
  getVolunteers: () => fetchWithFallback<VolunteerProfile[]>('/api/volunteers', FALLBACK_VOLUNTEERS),
  getRescuePriorityQueue: () => fetchWithFallback<RescuePriorityItem[]>('/api/rescue/priority-queue', FALLBACK_PRIORITY_INCIDENTS),
  getWildlifeAreas: () => fetchWithFallback<WildlifeProtectedArea[]>('/api/wildlife/protected-areas', FALLBACK_WILDLIFE),
  getThermalDetections: () => fetchWithFallback<ThermalDetection[]>('/api/thermal/detections', FALLBACK_THERMAL_DETECTIONS),
  getSimulationState: () => fetchWithFallback<SimulationStep>('/api/simulation/state', {
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
  }),
  nextSimulationStep: () => fetchWithFallback<SimulationStep>('/api/simulation/next-step', {
    step_number: 2,
    title: "Cyclone Intensification & Inundation",
    description: "IMD radar tracks severe cyclone. Locality risk elevates to RED (84/100).",
    risk_level: "RED",
    risk_score: 84.0,
    active_locality: "Surya Rao Peta Lowlands",
    affected_population: 12500,
    unaccounted_population: 11200,
    safe_checkins: 1300,
    volunteer_required: 65,
    volunteer_available: 42,
    vehicles_required: 24,
    wildlife_rescued: 45
  }, { method: 'POST' }),
  resetSimulation: () => fetchWithFallback<SimulationStep>('/api/simulation/reset', {
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
  }, { method: 'POST' })
};
