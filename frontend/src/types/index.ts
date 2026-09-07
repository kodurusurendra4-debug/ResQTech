export type RiskLevel = 'RED' | 'YELLOW' | 'GREEN';

export type DisasterType =
  | 'Flood'
  | 'Cyclone'
  | 'Earthquake'
  | 'Tsunami'
  | 'Landslide'
  | 'Drought'
  | 'Heatwave'
  | 'Industrial Leakage'
  | 'Fire'
  | 'Building Collapse'
  | 'Severe Storm'
  | 'Other';

export type UserRole =
  | 'Citizen'
  | 'Volunteer'
  | 'Rescue Team'
  | 'Medical Team'
  | 'Forest/Wildlife Team'
  | 'District Admin'
  | 'State Admin'
  | 'Super Admin';

export type AgeCategory = 'Child' | 'Young' | 'Adult' | 'Elderly';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dob?: string;
  age: number;
  age_category: AgeCategory;
  gender: string;
  blood_group?: string;
  is_disabled: boolean;
  disability_details?: string;
  health_complications?: string[];
  is_safe?: boolean;
  safe_location_id?: string;
}

export interface FamilyProfile {
  family_id: string;
  household_name: string;
  head_of_family: string;
  contact_phone: string;
  email?: string;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  ration_card_number?: string;
  ration_card_verified: boolean;
  members: FamilyMember[];
  total_members: number;
  children_count: number;
  elderly_count: number;
  disabled_count: number;
  adults_count: number;
  young_count: number;
  ex_serviceman_in_family: boolean;
  forest_experience_in_family: boolean;
}

export interface RiskFactor {
  name: string;
  weight: number;
  score: number;
  impact_level: string;
  description: string;
}

export interface LocalityRiskAssessment {
  id: string;
  locality: string;
  mandal_taluk: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  disaster_type: DisasterType;
  risk_score: number;
  risk_level: RiskLevel;
  confidence_score: number;
  forecast_window_hours: number;
  is_advisory_notice: boolean;
  main_contributing_factors: RiskFactor[];
  population_affected_estimate: number;
  vulnerable_population_estimate: {
    children: number;
    elderly: number;
    disabled: number;
    adults: number;
  };
  recommended_actions: string[];
  historical_context?: {
    previous_event: string;
    year: number;
    casualties: number;
    displaced: number;
    source: string;
  };
  data_source: string;
  last_updated: string;
}

export interface SafePlace {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  total_capacity: number;
  current_occupancy: number;
  is_verified: boolean;
  accessibility_status: string;
  facilities: string[];
  contact_person: string;
  contact_phone: string;
  risk_level: RiskLevel;
}

export interface SOSAlert {
  incident_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  latitude: number;
  longitude: number;
  locality: string;
  timestamp: string;
  emergency_type: string;
  severity: RiskLevel;
  voice_note_url?: string;
  image_url?: string;
  text_message?: string;
  family_members_count: number;
  has_elderly: boolean;
  has_children: boolean;
  has_disabled: boolean;
  status: string;
  assigned_team_id?: string;
}

export interface CitizenReport {
  report_id: string;
  citizen_name: string;
  citizen_phone: string;
  disaster_type: DisasterType;
  severity: RiskLevel;
  latitude: number;
  longitude: number;
  description: string;
  media_url?: string;
  is_official_verified: boolean;
  timestamp: string;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  skills: string[];
  preferred_disasters: DisasterType[];
  service_radius_km: number;
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  is_ex_serviceman: boolean;
  is_forest_dept_experienced: boolean;
  assigned_incident_id?: string;
}

export interface RescuePriorityItem {
  incident_id: string;
  locality: string;
  hazard_type: string;
  hazard_severity_weight: number;
  total_population: number;
  children: number;
  elderly: number;
  disabled: number;
  accessibility_difficulty: number;
  calculated_priority_score: number;
  urgency_rank: number;
  status: string;
  assigned_team?: string;
}

export interface ThermalDetection {
  detection_id: string;
  timestamp: string;
  sensor_id: string;
  target_type: string;
  confidence: number;
  temperature_celsius: number;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  movement_detected: boolean;
  verified_by_operator: boolean;
  notes?: string;
}

export interface WildlifeProtectedArea {
  id: string;
  name: string;
  category: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  total_area_sq_km: number;
  key_species: Array<{
    name: string;
    status: string;
    est_count: number;
    source: string;
  }>;
  current_threat_level: RiskLevel;
  active_disaster?: string;
  animals_potentially_affected: number;
  animals_rescued: number;
  animals_transported: number;
  destination_shelter: string;
  wildlife_volunteers_needed: number;
  wildlife_volunteers_available: number;
}

export interface ResourceDemand {
  locality: string;
  affected_population: number;
  children_count: number;
  elderly_count: number;
  disabled_count: number;
  rescue_teams_required: number;
  rescue_teams_available: number;
  boats_required: number;
  boats_available: number;
  ambulances_required: number;
  ambulances_available: number;
  medical_staff_required: number;
  medical_staff_available: number;
  food_packets_required: number;
  food_packets_ready: number;
  potable_water_litres_required: number;
  potable_water_available: number;
  emergency_shelters_capacity: number;
  emergency_shelters_occupied: number;
}

export interface SimulationStep {
  step_number: number;
  title: string;
  description: string;
  risk_level: RiskLevel;
  risk_score: number;
  active_locality: string;
  affected_population: number;
  unaccounted_population: number;
  safe_checkins: number;
  volunteer_required: number;
  volunteer_available: number;
  vehicles_required: number;
  wildlife_rescued: number;
}
