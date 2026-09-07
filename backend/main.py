import asyncio
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models.schemas import (
    RiskLevel, DisasterType, LocalityRiskAssessment, SafePlace,
    ShelterCheckinRequest, SOSAlert, CitizenReport, VolunteerProfile,
    RescuePriorityItem, ThermalDetection, WildlifeProtectedArea,
    ResourceDemand, SimulationStep, FamilyProfile
)
from .services.risk_engine import RiskScoringEngine
from .services.vulnerability_engine import VulnerabilityPrioritizationEngine
from .services.family_dedup import DuplicateFamilyResolutionEngine
from .services.resource_predictor import ResourceDemandPredictor
from .services.wildlife_service import WildlifeResponseService
from .services.thermal_cv import ThermalSensorCVService
from .data.seed_data import (
    OFFICIAL_EMERGENCY_DIRECTORY, SEED_SAFE_PLACES, SEED_WATER_RESOURCES,
    SEED_VOLUNTEERS, SEED_FAMILIES, SEED_PRIORITY_INCIDENTS
)

app = FastAPI(
    title="SURAKSHA AI API",
    description="Intelligent Population-Aware Disaster Management & Emergency Response Platform for India",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database state
db_safe_places = list(SEED_SAFE_PLACES)
db_volunteers = list(SEED_VOLUNTEERS)
db_families = list(SEED_FAMILIES)
db_priority_incidents = list(SEED_PRIORITY_INCIDENTS)
db_sos_alerts: List[SOSAlert] = []
db_citizen_reports: List[CitizenReport] = [
    CitizenReport(
        report_id="REP-001",
        citizen_name="G. Ramana",
        citizen_phone="+91-9440129845",
        disaster_type=DisasterType.FLOOD,
        severity=RiskLevel.RED,
        latitude=16.9850,
        longitude=82.2430,
        description="Water inundated entire ground floor of residential apartments in Surya Rao Peta. Transformer submerged.",
        is_official_verified=True,
        timestamp=datetime.utcnow()
    ),
    CitizenReport(
        report_id="REP-002",
        citizen_name="K. Satya",
        citizen_phone="+91-9848123091",
        disaster_type=DisasterType.SEVERE_STORM,
        severity=RiskLevel.YELLOW,
        latitude=16.9940,
        longitude=82.2540,
        description="Large banyan tree fallen across main bypass road blocking ambulance passage.",
        is_official_verified=False,
        timestamp=datetime.utcnow()
    )
]

# Real-time WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# Interactive Simulation State (for Hackathon Presentation Mode - Section 54/66)
SIMULATION_STEPS: List[SimulationStep] = [
    SimulationStep(
        step_number=1,
        title="Initial Baseline Weather Advisory",
        description="Normal monsoon monitoring over Bay of Bengal. Locality risk is GREEN (28/100).",
        risk_level=RiskLevel.GREEN,
        risk_score=28.0,
        active_locality="Kakinada Coastal Sector",
        affected_population=0,
        unaccounted_population=0,
        safe_checkins=0,
        volunteer_required=5,
        volunteer_available=18,
        vehicles_required=2,
        wildlife_rescued=0
    ),
    SimulationStep(
        step_number=2,
        title="Cyclone Intensification & Torrential Inundation",
        description="IMD radar tracks Severe Cyclone 'Jal-Suraksha' landfall. River Godavari exceeds warning gauge. Risk elevates to YELLOW (58/100).",
        risk_level=RiskLevel.YELLOW,
        risk_score=58.0,
        active_locality="Kakinada Coastal Sector",
        affected_population=3500,
        unaccounted_population=3500,
        safe_checkins=120,
        volunteer_required=25,
        volunteer_available=28,
        vehicles_required=8,
        wildlife_rescued=12
    ),
    SimulationStep(
        step_number=3,
        title="RED Risk Alert & High-Priority Evacuation Cascade",
        description="Lowland bund breaches. AI Risk spikes to RED (84/100). 12,500 residents exposed (1,850 children, 1,100 elderly, 210 disabled). Priority queue auto-ranked.",
        risk_level=RiskLevel.RED,
        risk_score=84.0,
        active_locality="Surya Rao Peta Lowlands",
        affected_population=12500,
        unaccounted_population=11200,
        safe_checkins=1300,
        volunteer_required=65,
        volunteer_available=42,
        vehicles_required=24,
        wildlife_rescued=45
    ),
    SimulationStep(
        step_number=4,
        title="Rescue Dispatch, Thermal UAV Scan & Safe Check-ins",
        description="NDRF watercraft deployed to highest vulnerability cluster. FLIR thermal drone spots 3 rooftop survivors. 6,800 reach safe cyclone shelters.",
        risk_level=RiskLevel.RED,
        risk_score=76.0,
        active_locality="Surya Rao Peta Lowlands",
        affected_population=12500,
        unaccounted_population=5700,
        safe_checkins=6800,
        volunteer_required=65,
        volunteer_available=58,
        vehicles_required=24,
        wildlife_rescued=110
    ),
    SimulationStep(
        step_number=5,
        title="Stabilization, Relief Operations & Final Accounting",
        description="Water levels recede below danger threshold. 11,800 confirmed safe in verified shelters. Unaccounted reduced to minimal search zones. Wildlife corridors secured.",
        risk_level=RiskLevel.YELLOW,
        risk_score=42.0,
        active_locality="Kakinada Coastal Sector",
        affected_population=12500,
        unaccounted_population=700,
        safe_checkins=11800,
        volunteer_required=40,
        volunteer_available=52,
        vehicles_required=12,
        wildlife_rescued=184
    )
]

current_simulation_index = 0

# ==================== REST ENDPOINTS ====================

@app.get("/")
def root():
    return {
        "platform": "SURAKSHA AI",
        "tagline": "Predict Risk. Protect People. Coordinate Rescue. Save Lives.",
        "status": "OPERATIONAL",
        "jurisdiction": "India",
        "advisory": "AI outputs are advisory. Official government directives override algorithmic forecasts."
    }

# 1. AUTHENTICATION & DEMO OTP
class OTPRequest(BaseModel):
    mobile_number: str

class OTPVerify(BaseModel):
    mobile_number: str
    otp_code: str

@app.post("/api/auth/send-otp")
def send_otp(req: OTPRequest):
    return {
        "status": "SUCCESS",
        "message": f"Demo OTP sent to {req.mobile_number}. For hackathon demonstration, use OTP: 112233.",
        "demo_otp": "112233"
    }

@app.post("/api/auth/verify-otp")
def verify_otp(req: OTPVerify):
    if req.otp_code in ["112233", "123456", "999999"]:
        return {
            "status": "VERIFIED",
            "token": "suraksha_demo_jwt_token_889201",
            "user": {
                "user_id": "USER-AP-01",
                "name": "Lakshmi Narayana Rao",
                "phone": req.mobile_number,
                "role": "Citizen",
                "family_id": "FAM-AP-8921-A",
                "verified_document": "AP14028921"
            }
        }
    raise HTTPException(status_code=400, detail="Invalid OTP code entered. Please try 112233.")

# 2. RISK ENGINE & ASSESSMENTS
@app.get("/api/risk/locality")
def get_locality_risk(
    locality: str = Query("Surya Rao Peta", description="Locality name"),
    disaster_type: DisasterType = Query(DisasterType.FLOOD, description="Disaster type")
):
    assessment = RiskScoringEngine.calculate_locality_risk(
        locality=locality,
        mandal_taluk="Kakinada Urban",
        district="Kakinada",
        state="Andhra Pradesh",
        latitude=16.9834,
        longitude=82.2451,
        disaster_type=disaster_type,
        rainfall_mm_24h=185.0,
        river_level_danger_ratio=1.18,
        elevation_meters=4.2,
        population_density_sq_km=8200.0,
        coastal_distance_km=2.8,
        historical_event_frequency=6,
        vulnerable_ratio=0.34
    )
    return assessment

@app.get("/api/risk/national-summary")
def get_national_summary():
    return {
        "active_disasters_count": 4,
        "high_risk_districts_count": 12,
        "estimated_total_affected": 48500,
        "confirmed_safe_population": 34200,
        "unaccounted_or_pending_confirmation": 14300,
        "demographic_breakdown": {
            "children": {"safe": 7520, "unaccounted": 3150},
            "elderly": {"safe": 4780, "unaccounted": 2010},
            "disabled": {"safe": 1360, "unaccounted": 570},
            "adults": {"safe": 20540, "unaccounted": 8570}
        },
        "resources_telemetry": {
            "rescue_teams": {"required": 48, "deployed": 36, "gap": 12},
            "boats": {"required": 115, "deployed": 82, "gap": 33},
            "ambulances": {"required": 64, "deployed": 54, "gap": 10},
            "volunteers": {"required": 320, "available": 245, "gap": 75}
        },
        "coastal_risk_index": "HIGH - Bay of Bengal Deep Depression Active",
        "data_freshness": "Updated 4 minutes ago via IMD / CWC / SDMA Feeds"
    }

# 3. SAFE PLACES & SHELTER CHECK-IN
@app.get("/api/shelters", response_model=List[SafePlace])
def get_safe_places(radius_km: float = Query(10.0, description="Radius search")):
    return db_safe_places

@app.post("/api/shelters/checkin")
async def checkin_to_shelter(req: ShelterCheckinRequest):
    target = next((s for s in db_safe_places if s.id == req.shelter_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Shelter not found")
    
    count_to_add = len(req.member_ids) if req.member_ids else 1
    target.current_occupancy += count_to_add
    
    # Broadcast update via WebSocket
    await manager.broadcast({
        "event": "SHELTER_CHECKIN",
        "shelter_id": target.id,
        "new_occupancy": target.current_occupancy,
        "capacity": target.total_capacity,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {
        "status": "CHECKED_IN",
        "shelter_name": target.name,
        "updated_occupancy": target.current_occupancy,
        "message": f"Successfully registered {count_to_add} family members at safe shelter."
    }

# 4. SOS ALERTS
@app.post("/api/sos/trigger")
async def trigger_sos(alert: SOSAlert):
    db_sos_alerts.append(alert)
    # Broadcast SOS incident
    await manager.broadcast({
        "event": "NEW_SOS_ALERT",
        "incident_id": alert.incident_id,
        "locality": alert.locality,
        "severity": alert.severity,
        "family_members_count": alert.family_members_count,
        "latitude": alert.latitude,
        "longitude": alert.longitude,
        "timestamp": datetime.utcnow().isoformat()
    })
    return {
        "status": "SOS_DISPATCHED",
        "incident_id": alert.incident_id,
        "sms_fallback_code": f"SMSTO:112:SURAKSHA SOS {alert.incident_id} LAT {alert.latitude} LNG {alert.longitude} MEMBERS {alert.family_members_count}",
        "message": "Emergency alert received. Dispatched to Nearest DEOC, Police & NDRF Control."
    }

@app.get("/api/sos/active", response_model=List[SOSAlert])
def get_active_sos():
    return db_sos_alerts

# 5. CITIZEN DISASTER REPORTS
@app.post("/api/reports/submit")
async def submit_citizen_report(report: CitizenReport):
    db_citizen_reports.append(report)
    await manager.broadcast({
        "event": "CITIZEN_REPORT_SUBMITTED",
        "report_id": report.report_id,
        "disaster_type": report.disaster_type,
        "severity": report.severity,
        "locality": "Citizen GPS Area",
        "timestamp": datetime.utcnow().isoformat()
    })
    return {"status": "SUBMITTED", "report_id": report.report_id, "official_review": "PENDING_VERIFICATION"}

@app.get("/api/reports", response_model=List[CitizenReport])
def get_reports():
    return db_citizen_reports

# 6. RESCUE DASHBOARD & PRIORITY QUEUE
@app.get("/api/rescue/priority-queue", response_model=List[RescuePriorityItem])
def get_rescue_priority_queue():
    return VulnerabilityPrioritizationEngine.rank_rescue_queue(db_priority_incidents)

@app.get("/api/rescue/resources")
def get_resource_predictions():
    demand = ResourceDemandPredictor.predict_resources(
        locality="Surya Rao Peta Lowlands",
        affected_population=12500,
        children=1850,
        elderly=1100,
        disabled=210,
        hazard_type=DisasterType.FLOOD,
        severity_factor=1.8,
        is_water_inundated=True
    )
    checklist = ResourceDemandPredictor.get_medical_equipment_checklist(DisasterType.FLOOD)
    return {
        "demand": demand,
        "medical_checklist": checklist
    }

# 7. VOLUNTEERS
@app.get("/api/volunteers", response_model=List[VolunteerProfile])
def get_volunteers():
    return db_volunteers

@app.post("/api/volunteers/register")
def register_volunteer(vol: VolunteerProfile):
    db_volunteers.append(vol)
    return {"status": "REGISTERED", "volunteer_id": vol.id}

# 8. FAMILY PROFILE & DUPLICATE RESOLUTION
@app.get("/api/family/dedup-audit")
def audit_family_duplicates():
    engine = DuplicateFamilyResolutionEngine()
    unique_households, total_people, clusters = engine.deduplicate_households(db_families)
    return {
        "total_individual_accounts_in_db": len(db_families),
        "actual_unique_households": unique_households,
        "actual_unique_individuals": total_people,
        "prevented_inflation_rate_pct": round((1 - (unique_households / len(db_families))) * 100, 1),
        "household_clusters": clusters
    }

@app.get("/api/family/ocr-simulate")
def simulate_ocr():
    return DuplicateFamilyResolutionEngine.simulate_ration_card_ocr("base64_sample_placeholder")

# 9. THERMAL SENSORS & COMPUTER VISION
@app.get("/api/thermal/sensors")
def get_thermal_sensors():
    return ThermalSensorCVService.get_connected_sensors()

@app.get("/api/thermal/detections", response_model=List[ThermalDetection])
def get_thermal_detections(sensor_id: str = "FLIR-LWIR-DRONE-01"):
    return ThermalSensorCVService.simulate_detections(sensor_id)

# 10. WILDLIFE DISASTER MANAGEMENT
@app.get("/api/wildlife/protected-areas", response_model=List[WildlifeProtectedArea])
def get_wildlife_areas():
    return WildlifeResponseService.get_protected_areas()

@app.get("/api/wildlife/evacuation-plan")
def get_wildlife_evacuation(park_id: str = "PA-KAZIRANGA-01"):
    parks = WildlifeResponseService.get_protected_areas()
    target = next((p for p in parks if p.id == park_id), parks[0])
    return WildlifeResponseService.calculate_evacuation_demand(target)

# 11. EMERGENCY DIRECTORY & WATER RESOURCES
@app.get("/api/emergency/contacts")
def get_emergency_contacts():
    return OFFICIAL_EMERGENCY_DIRECTORY

@app.get("/api/water-resources")
def get_water_resources():
    return SEED_WATER_RESOURCES

# 12. HACKATHON PRESENTATION SIMULATION CONTROLLER (Section 54/66)
@app.get("/api/simulation/state", response_model=SimulationStep)
def get_simulation_state():
    global current_simulation_index
    return SIMULATION_STEPS[current_simulation_index]

@app.post("/api/simulation/next-step", response_model=SimulationStep)
async def advance_simulation():
    global current_simulation_index
    current_simulation_index = (current_simulation_index + 1) % len(SIMULATION_STEPS)
    state = SIMULATION_STEPS[current_simulation_index]
    
    # Broadcast to all connected UI clients
    await manager.broadcast({
        "event": "SIMULATION_STEP_CHANGED",
        "step": state.dict(),
        "timestamp": datetime.utcnow().isoformat()
    })
    return state

@app.post("/api/simulation/reset", response_model=SimulationStep)
async def reset_simulation():
    global current_simulation_index
    current_simulation_index = 0
    state = SIMULATION_STEPS[0]
    await manager.broadcast({
        "event": "SIMULATION_RESET",
        "step": state.dict(),
        "timestamp": datetime.utcnow().isoformat()
    })
    return state

# 13. REAL-TIME WEBSOCKET
@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial sync payload
        await websocket.send_json({
            "event": "CONNECTION_ESTABLISHED",
            "message": "Suraksha AI Real-Time Telemetry Stream Connected",
            "simulation_step": SIMULATION_STEPS[current_simulation_index].dict(),
            "timestamp": datetime.utcnow().isoformat()
        })
        while True:
            data = await websocket.receive_text()
            # Handle client ping or messages
            parsed = json.loads(data) if data.startswith("{") else {"raw": data}
            if parsed.get("type") == "PING":
                await websocket.send_json({"type": "PONG"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
