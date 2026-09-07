from typing import List, Dict, Any
from ..models.schemas import (
    RiskLevel, DisasterType, SafePlace, WaterResource,
    VolunteerProfile, FamilyProfile, FamilyMember, AgeCategory,
    CitizenReport, SOSAlert, RescuePriorityItem
)
from datetime import datetime

# 1. Verified Official Emergency Directory (India)
OFFICIAL_EMERGENCY_DIRECTORY = [
    {
        "category": "National Emergency Operations",
        "name": "National Emergency Response System (Pan-India)",
        "number": "112",
        "jurisdiction": "All States & Union Territories",
        "type": "Single Emergency Number for Police, Fire, Ambulance",
        "verified_source": "Ministry of Home Affairs (MHA), Govt of India"
    },
    {
        "category": "Disaster Management Authorities",
        "name": "National Disaster Response Force (NDRF) HQ Control Room",
        "number": "011-24363260",
        "jurisdiction": "National",
        "type": "24x7 Specialized Disaster Search & Rescue HQ",
        "verified_source": "NDRF Directorate General, New Delhi"
    },
    {
        "category": "Disaster Management Authorities",
        "name": "State Disaster Management Authority (SDMA) Toll Free",
        "number": "1070",
        "jurisdiction": "State Level Control Rooms",
        "type": "State Emergency Operations Centre (SEOC)",
        "verified_source": "NDMA State Guidelines"
    },
    {
        "category": "Disaster Management Authorities",
        "name": "District Emergency Operations Centre (DEOC)",
        "number": "1077",
        "jurisdiction": "District Collectorates",
        "type": "District Disaster Helpline",
        "verified_source": "District Administration Portal"
    },
    {
        "category": "Ambulance & Healthcare",
        "name": "Emergency Medical Response Ambulance Service",
        "number": "108",
        "jurisdiction": "Pan-India National Health Mission",
        "type": "Trauma & Advanced Life Support Fleet",
        "verified_source": "Ministry of Health & Family Welfare"
    },
    {
        "category": "Fire & Rescue",
        "name": "Fire & Emergency Rescue Control Room",
        "number": "101",
        "jurisdiction": "Municipal & State Fire Services",
        "type": "Fire Extrication & Urban Rescue",
        "verified_source": "Directorate General Fire Services"
    },
    {
        "category": "Maritime & Coastal Safety",
        "name": "Indian Coast Guard Maritime Rescue Coordination Centre",
        "number": "1554",
        "jurisdiction": "Coastal States, EEZ & Territorial Waters",
        "type": "Maritime Distress, Cyclone Evacuation at Sea",
        "verified_source": "Ministry of Defence, Govt of India"
    },
    {
        "category": "Forest & Wildlife",
        "name": "Forest Department Wildlife Distress Helpline",
        "number": "1800-425-4733",
        "jurisdiction": "Forest & Wildlife Sanctuaries",
        "type": "Wildlife Rescue, Human-Wildlife Conflict in Floods",
        "verified_source": "Ministry of Environment, Forest and Climate Change (MoEFCC)"
    }
]

# 2. Verified Safe Shelters & Emergency Relief Camps
SEED_SAFE_PLACES: List[SafePlace] = [
    SafePlace(
        id="SP-AP-KKD-01",
        name="Government Degree College Multipurpose Cyclone Shelter",
        type="Cyclone Shelter / High-Ground School",
        latitude=16.9891,
        longitude=82.2475,
        distance_km=1.8,
        total_capacity=1200,
        current_occupancy=480,
        is_verified=True,
        accessibility_status="Wheelchair Ramped & Ground Floor Access",
        facilities=["Purified Drinking Water", "Kitchen Mass Feeding", "Medical Aid Post", "Solar Backup Generator", "Sanitation Blocks"],
        contact_person="Sri R. Venkatesh (Tahsildar / Shelter Custodian)",
        contact_phone="+91-884-2361122",
        risk_level=RiskLevel.GREEN
    ),
    SafePlace(
        id="SP-AP-KKD-02",
        name="District Government General Hospital (GGH) Emergency Block",
        type="Tertiary Hospital & Trauma Centre",
        latitude=16.9604,
        longitude=82.2381,
        distance_km=3.2,
        total_capacity=850,
        current_occupancy=610,
        is_verified=True,
        accessibility_status="Full ADA Compliant Ramps & Elevators",
        facilities=["24x7 Trauma Ward", "Oxygen Plant", "Blood Bank", "Pediatric ICU", "Emergency Triage Wing"],
        contact_person="Dr. K. Padma (Medical Superintendent)",
        contact_phone="+91-884-2374400",
        risk_level=RiskLevel.GREEN
    ),
    SafePlace(
        id="SP-AP-KKD-03",
        name="Sri Bhavanarayaswami Community Relief Center",
        type="Reinforced Concrete Community Hall",
        latitude=17.0120,
        longitude=82.2610,
        distance_km=2.7,
        total_capacity=600,
        current_occupancy=210,
        is_verified=True,
        accessibility_status="Wide Ramped Entry",
        facilities=["Clean Water Tanks", "Community Kitchen", "Dry Rations Stockpile", "First Aid Kit"],
        contact_person="M. Satyanarayana (Community President)",
        contact_phone="+91-9440182736",
        risk_level=RiskLevel.GREEN
    ),
    SafePlace(
        id="SP-AS-GOL-04",
        name="Bokakhat Higher Secondary Highland Shelter",
        type="Designated Flood Relief Camp",
        latitude=26.6214,
        longitude=93.5912,
        distance_km=2.4,
        total_capacity=900,
        current_occupancy=530,
        is_verified=True,
        accessibility_status="Highland Concrete Plinth, Ramped",
        facilities=["Water Filter Plant", "Baby Feeding Room", "Veterinary Holding Area for Livestock", "Emergency Lighting"],
        contact_person="Pranjal Saikia (Block Development Officer)",
        contact_phone="+91-3776-268224",
        risk_level=RiskLevel.GREEN
    ),
    SafePlace(
        id="SP-OD-PRI-05",
        name="Puri Sea Coast Multipurpose Cyclone Shelter (MCS No. 14)",
        type="ODRAP Cyclone Shelter",
        latitude=19.8135,
        longitude=85.8312,
        distance_km=1.2,
        total_capacity=1500,
        current_occupancy=890,
        is_verified=True,
        accessibility_status="Double Ramped Stilt Structure",
        facilities=["Helipad on Roof", "Underground Rainwater Cistern", "Diesel GenSet", "Satellite Phone Post", "First Aid Ward"],
        contact_person="B. C. Mohapatra (Revenue Officer)",
        contact_phone="+91-6752-222034",
        risk_level=RiskLevel.GREEN
    )
]

# 3. Water Resources & Exposure Zones
SEED_WATER_RESOURCES: List[WaterResource] = [
    WaterResource(
        id="WR-GODAVARI-01",
        name="Godavari River (Dowleswaram Barrage Reach)",
        type="Major River & Delta Basin",
        distance_km=3.4,
        capacity_tmc=3.12,
        current_level_pct=88.4,
        historical_flood_relevance="Subject to severe high flood discharges (exceeding 21 lakh cusecs in 2006 and 2022).",
        infrastructure_classification="Sir Arthur Cotton Barrage - CWC Continuous Telemetered Gauge",
        exposure_level=RiskLevel.RED
    ),
    WaterResource(
        id="WR-BRAHMAPUTRA-02",
        name="Brahmaputra River (Kaziranga - Dhansiri Confluence)",
        type="Trans-boundary Braided River",
        distance_km=2.1,
        capacity_tmc=None,
        current_level_pct=94.2,
        historical_flood_relevance="Annual overbank flooding submerging 70-85% of adjacent lowlands and animal corridors.",
        infrastructure_classification="Tezpur-Silghat Hydrological Station (CWC)",
        exposure_level=RiskLevel.RED
    ),
    WaterResource(
        id="WR-CHILIKA-03",
        name="Chilika Brackish Lagoon & Coastal Inlet",
        type="Coastal Lake / Wetland",
        distance_km=4.8,
        capacity_tmc=None,
        current_level_pct=72.0,
        historical_flood_relevance="Vulnerable to sea-storm surges during severe cyclonic storms (Fani 2019, Phailin 2013).",
        infrastructure_classification="Chilika Development Authority Eco-Monitored Inlet",
        exposure_level=RiskLevel.YELLOW
    ),
    WaterResource(
        id="WR-IDUKKI-04",
        name="Idukki Arch Dam & Periyar Reservoir",
        type="Hydroelectric Reservoir & Dam",
        distance_km=12.5,
        capacity_tmc=70.5,
        current_level_pct=81.6,
        historical_flood_relevance="Sluice gate openings impact downstream Cheruthoni and Aluva floodplains (2018 deluge).",
        infrastructure_classification="KSEB Dam Safety Authority - Rule Curve Regulated",
        exposure_level=RiskLevel.YELLOW
    )
]

# 4. Registered Volunteer Network
SEED_VOLUNTEERS: List[VolunteerProfile] = [
    VolunteerProfile(
        id="VOL-IN-001",
        name="Subedar Major R. K. Nayak (Retd.)",
        phone="+91-9849012345",
        email="rknayak.defence@gmail.com",
        skills=["Search & Rescue", "First Aid", "Driving", "Communication", "Engineering"],
        preferred_disasters=[DisasterType.FLOOD, DisasterType.CYCLONE, DisasterType.BUILDING_COLLAPSE],
        service_radius_km=25.0,
        is_available=True,
        current_latitude=16.9850,
        current_longitude=82.2420,
        is_ex_serviceman=True,
        is_forest_dept_experienced=False
    ),
    VolunteerProfile(
        id="VOL-IN-002",
        name="Dr. Priya Sundaram",
        phone="+91-9444123890",
        email="dr.priya.med@rescue-suraksha.org",
        skills=["Medical", "First Aid", "Communication"],
        preferred_disasters=[DisasterType.FLOOD, DisasterType.EARTHQUAKE, DisasterType.HEATWAVE],
        service_radius_km=15.0,
        is_available=True,
        current_latitude=16.9920,
        current_longitude=82.2510,
        is_ex_serviceman=False,
        is_forest_dept_experienced=False
    ),
    VolunteerProfile(
        id="VOL-IN-003",
        name="Manoj Barman",
        phone="+91-9706112984",
        email="manoj.wildlife.assam@gmail.com",
        skills=["Boat Operation", "Swimming", "Search & Rescue", "First Aid"],
        preferred_disasters=[DisasterType.FLOOD, DisasterType.LANDSLIDE],
        service_radius_km=35.0,
        is_available=True,
        current_latitude=26.5820,
        current_longitude=93.1650,
        is_ex_serviceman=False,
        is_forest_dept_experienced=True
    ),
    VolunteerProfile(
        id="VOL-IN-004",
        name="Captain Sandeep Verma (Retd. Navy)",
        phone="+91-9820045612",
        email="sandeep.maritime@outlook.com",
        skills=["Boat Operation", "Swimming", "Search & Rescue", "Engineering"],
        preferred_disasters=[DisasterType.CYCLONE, DisasterType.TSUNAMI, DisasterType.FLOOD],
        service_radius_km=40.0,
        is_available=True,
        current_latitude=19.8200,
        current_longitude=85.8280,
        is_ex_serviceman=True,
        is_forest_dept_experienced=False
    ),
    VolunteerProfile(
        id="VOL-IN-005",
        name="Aniket Deshmukh",
        phone="+91-9890123776",
        email="aniket.civil@gmail.com",
        skills=["Driving", "Engineering", "Search & Rescue"],
        preferred_disasters=[DisasterType.EARTHQUAKE, DisasterType.LANDSLIDE, DisasterType.BUILDING_COLLAPSE],
        service_radius_km=20.0,
        is_available=True,
        current_latitude=18.5204,
        current_longitude=73.8567,
        is_ex_serviceman=False,
        is_forest_dept_experienced=False
    )
]

# 5. Demo Household Family Profiles (for Duplicate Resolution Demo)
SEED_FAMILIES: List[FamilyProfile] = [
    FamilyProfile(
        family_id="FAM-AP-8921-A",
        household_name="Lakshmi Narayana Rao Household",
        head_of_family="Lakshmi Narayana Rao",
        contact_phone="+91-9849001122",
        email="ln.rao@gmail.com",
        address="Door No 4-82, Ramalayam Street, Kakinada Rural, Andhra Pradesh",
        district="Kakinada",
        state="Andhra Pradesh",
        latitude=16.9834,
        longitude=82.2451,
        ration_card_number="AP14028921",
        ration_card_verified=True,
        members=[
            FamilyMember(id="MEM-01", name="Lakshmi Narayana Rao", relationship="Self", age=65, age_category=AgeCategory.ELDERLY, gender="Male", blood_group="O+", health_complications=["Hypertension"]),
            FamilyMember(id="MEM-02", name="Saraswathi Rao", relationship="Spouse", age=62, age_category=AgeCategory.ELDERLY, gender="Female", blood_group="B+", is_disabled=False),
            FamilyMember(id="MEM-03", name="Srinivas Rao", relationship="Son", age=34, age_category=AgeCategory.ADULT, gender="Male", blood_group="O+"),
            FamilyMember(id="MEM-04", name="Ananya Rao", relationship="Daughter-in-Law", age=31, age_category=AgeCategory.ADULT, gender="Female", blood_group="A+"),
            FamilyMember(id="MEM-05", name="Arjun Rao", relationship="Grandson", age=7, age_category=AgeCategory.CHILD, gender="Male", blood_group="O+")
        ],
        total_members=5,
        children_count=1,
        elderly_count=2,
        disabled_count=0,
        adults_count=2,
        young_count=0,
        ex_serviceman_in_family=False,
        forest_experience_in_family=False
    ),
    # Duplicate login scenario: Srinivas Rao registers from his own smartphone with same ration card/address
    FamilyProfile(
        family_id="FAM-AP-8921-B",
        household_name="Srinivas Rao Household",
        head_of_family="Srinivas Rao",
        contact_phone="+91-9849556677",
        email="srinivas.rao92@gmail.com",
        address="Door No 4-82, Ramalayam Street, Kakinada Rural, Andhra Pradesh",
        district="Kakinada",
        state="Andhra Pradesh",
        latitude=16.9835,
        longitude=82.2452,
        ration_card_number="AP14028921",
        ration_card_verified=True,
        members=[
            FamilyMember(id="MEM-03-B", name="Srinivas Rao", relationship="Self", age=34, age_category=AgeCategory.ADULT, gender="Male", blood_group="O+"),
            FamilyMember(id="MEM-04-B", name="Ananya Rao", relationship="Spouse", age=31, age_category=AgeCategory.ADULT, gender="Female", blood_group="A+"),
            FamilyMember(id="MEM-05-B", name="Arjun Rao", relationship="Son", age=7, age_category=AgeCategory.CHILD, gender="Male", blood_group="O+")
        ],
        total_members=3,
        children_count=1,
        elderly_count=0,
        disabled_count=0,
        adults_count=2,
        young_count=0,
        ex_serviceman_in_family=False,
        forest_experience_in_family=False
    )
]

# 6. Rescue Priority Incidents Queue
SEED_PRIORITY_INCIDENTS: List[RescuePriorityItem] = [
    RescuePriorityItem(
        incident_id="INC-KKD-01",
        locality="Surya Rao Peta Lowlands",
        hazard_type="Rapid Flood Inundation (Water level 1.6m and rising)",
        hazard_severity_weight=2.8,
        total_population=4500,
        children=640,
        elderly=480,
        disabled=92,
        accessibility_difficulty=2.6,
        calculated_priority_score=88.4,
        urgency_rank=1,
        status="DISPATCHING_BOAT_TEAM",
        assigned_team="NDRF 10th Battalion Unit Bravo"
    ),
    RescuePriorityItem(
        incident_id="INC-KKD-02",
        locality="Jagannaickpur Canal Bund Colony",
        hazard_type="Canal Breaching & Flash Flood",
        hazard_severity_weight=2.4,
        total_population=2800,
        children=320,
        elderly=260,
        disabled=45,
        accessibility_difficulty=2.2,
        calculated_priority_score=72.1,
        urgency_rank=2,
        status="PENDING_TEAM_ASSIGNMENT",
        assigned_team=None
    ),
    RescuePriorityItem(
        incident_id="INC-KKD-03",
        locality="Madhavapatnam Industrial Edge",
        hazard_type="Flood Inundation & Hazardous Chemical Storage Precaution",
        hazard_severity_weight=2.0,
        total_population=1800,
        children=110,
        elderly=95,
        disabled=14,
        accessibility_difficulty=1.4,
        calculated_priority_score=48.6,
        urgency_rank=3,
        status="ALERT_ISSUED",
        assigned_team=None
    )
]
