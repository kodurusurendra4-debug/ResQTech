from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class RiskLevel(str, Enum):
    RED = "RED"         # High Risk (70-100)
    YELLOW = "YELLOW"   # Moderate Risk (40-69)
    GREEN = "GREEN"     # Low Risk (0-39)

class DisasterType(str, Enum):
    FLOOD = "Flood"
    CYCLONE = "Cyclone"
    EARTHQUAKE = "Earthquake"
    TSUNAMI = "Tsunami"
    LANDSLIDE = "Landslide"
    DROUGHT = "Drought"
    HEATWAVE = "Heatwave"
    INDUSTRIAL_LEAKAGE = "Industrial Leakage"
    FIRE = "Fire"
    BUILDING_COLLAPSE = "Building Collapse"
    SEVERE_STORM = "Severe Storm"
    OTHER = "Other"

class UserRole(str, Enum):
    CITIZEN = "Citizen"
    VOLUNTEER = "Volunteer"
    RESCUE_TEAM = "Rescue Team"
    MEDICAL_TEAM = "Medical Team"
    FOREST_WILDLIFE = "Forest/Wildlife Team"
    DISTRICT_ADMIN = "District Admin"
    STATE_ADMIN = "State Admin"
    SUPER_ADMIN = "Super Admin"

class AgeCategory(str, Enum):
    CHILD = "Child"       # < 14
    YOUNG = "Young"       # 14 - 25
    ADULT = "Adult"       # 26 - 60
    ELDERLY = "Elderly"   # > 60

class FamilyMember(BaseModel):
    id: str
    name: str
    relationship: str
    dob: Optional[str] = None
    age: int
    age_category: AgeCategory
    gender: str
    blood_group: Optional[str] = "Unknown"
    is_disabled: bool = False
    disability_details: Optional[str] = None
    health_complications: Optional[List[str]] = []
    is_safe: bool = False
    safe_location_id: Optional[str] = None

class FamilyProfile(BaseModel):
    family_id: str
    household_name: str
    head_of_family: str
    contact_phone: str
    email: Optional[str] = None
    address: str
    district: str
    state: str
    latitude: float
    longitude: float
    ration_card_number: Optional[str] = None
    ration_card_verified: bool = False
    members: List[FamilyMember] = []
    total_members: int = 0
    children_count: int = 0
    elderly_count: int = 0
    disabled_count: int = 0
    adults_count: int = 0
    young_count: int = 0
    ex_serviceman_in_family: bool = False
    forest_experience_in_family: bool = False
    registered_at: datetime = Field(default_factory=datetime.utcnow)

class LocationCoordinates(BaseModel):
    latitude: float
    longitude: float
    locality: str
    district: str
    state: str

class WaterResource(BaseModel):
    id: str
    name: str
    type: str  # River, Lake, Reservoir, Dam, Canal
    distance_km: float
    capacity_tmc: Optional[float] = None
    current_level_pct: float
    historical_flood_relevance: str
    infrastructure_classification: str # e.g. "Operational - Monitored by CWC"
    exposure_level: RiskLevel

class RiskFactor(BaseModel):
    name: str
    weight: float
    score: float # 0 to 100
    impact_level: str # Low, Medium, High
    description: str

class LocalityRiskAssessment(BaseModel):
    id: str
    locality: str
    mandal_taluk: str
    district: str
    state: str
    latitude: float
    longitude: float
    disaster_type: DisasterType
    risk_score: float # 0 to 100
    risk_level: RiskLevel
    confidence_score: float
    forecast_window_hours: int
    is_advisory_notice: bool = True
    main_contributing_factors: List[RiskFactor]
    population_affected_estimate: int
    vulnerable_population_estimate: Dict[str, int]
    recommended_actions: List[str]
    historical_context: Optional[Dict[str, Any]] = None
    data_source: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class SafePlace(BaseModel):
    id: str
    name: str
    type: str # Hospital, School, Government Building, Cyclone Shelter, Community Hall
    latitude: float
    longitude: float
    distance_km: Optional[float] = None
    total_capacity: int
    current_occupancy: int
    is_verified: bool = True
    accessibility_status: str # Wheelchair Accessible, Ground Floor, Ramped
    facilities: List[str] # Medical, Drinking Water, Kitchen, Backup Power
    contact_person: str
    contact_phone: str
    risk_level: RiskLevel = RiskLevel.GREEN

class ShelterCheckinRequest(BaseModel):
    shelter_id: str
    user_id: str
    family_id: Optional[str] = None
    member_ids: List[str] = []
    latitude: float
    longitude: float
    notes: Optional[str] = None

class SOSAlert(BaseModel):
    incident_id: str
    user_id: str
    user_name: str
    user_phone: str
    latitude: float
    longitude: float
    locality: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    emergency_type: str
    severity: RiskLevel
    voice_note_url: Optional[str] = None
    image_url: Optional[str] = None
    text_message: Optional[str] = None
    family_members_count: int = 1
    has_elderly: bool = False
    has_children: bool = False
    has_disabled: bool = False
    status: str = "Active" # Active, Responded, Rescued, Closed
    assigned_team_id: Optional[str] = None

class CitizenReport(BaseModel):
    report_id: str
    citizen_name: str
    citizen_phone: str
    disaster_type: DisasterType
    severity: RiskLevel
    latitude: float
    longitude: float
    description: str
    media_url: Optional[str] = None
    is_official_verified: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class VolunteerProfile(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    skills: List[str] # First Aid, Swimming, Boat Operation, Driving, Search & Rescue, Medical, Engineering, Communication
    preferred_disasters: List[DisasterType]
    service_radius_km: float
    is_available: bool = True
    current_latitude: float
    current_longitude: float
    is_ex_serviceman: bool = False
    is_forest_dept_experienced: bool = False
    assigned_incident_id: Optional[str] = None

class RescuePriorityItem(BaseModel):
    incident_id: str
    locality: str
    hazard_type: str
    hazard_severity_weight: float
    total_population: int
    children: int
    elderly: int
    disabled: int
    accessibility_difficulty: float # 1.0 (easy) to 3.0 (cut off by water)
    calculated_priority_score: float
    urgency_rank: int
    status: str
    assigned_team: Optional[str] = None

class ThermalDetection(BaseModel):
    detection_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    sensor_id: str
    target_type: str # Human, Animal, Debris/False Positive
    confidence: float # 0.0 - 1.0
    temperature_celsius: float
    bounding_box: Dict[str, float] # x, y, width, height in %
    movement_detected: bool
    verified_by_operator: bool = False
    notes: Optional[str] = None

class WildlifeProtectedArea(BaseModel):
    id: str
    name: str
    category: str # National Park, Wildlife Sanctuary, Biosphere Reserve
    state: str
    district: str
    latitude: float
    longitude: float
    total_area_sq_km: float
    key_species: List[Dict[str, Any]] # e.g. One-horned Rhino, Bengal Tiger, Elephant
    current_threat_level: RiskLevel
    active_disaster: Optional[str] = None
    animals_potentially_affected: int
    animals_rescued: int
    animals_transported: int
    destination_shelter: str
    wildlife_volunteers_needed: int
    wildlife_volunteers_available: int

class ResourceDemand(BaseModel):
    locality: str
    affected_population: int
    children_count: int
    elderly_count: int
    disabled_count: int
    rescue_teams_required: int
    rescue_teams_available: int
    boats_required: int
    boats_available: int
    ambulances_required: int
    ambulances_available: int
    medical_staff_required: int
    medical_staff_available: int
    food_packets_required: int
    food_packets_ready: int
    potable_water_litres_required: int
    potable_water_available: int
    emergency_shelters_capacity: int
    emergency_shelters_occupied: int

class SimulationStep(BaseModel):
    step_number: int
    title: str
    description: str
    risk_level: RiskLevel
    risk_score: float
    active_locality: str
    affected_population: int
    unaccounted_population: int
    safe_checkins: int
    volunteer_required: int
    volunteer_available: int
    vehicles_required: int
    wildlife_rescued: int
