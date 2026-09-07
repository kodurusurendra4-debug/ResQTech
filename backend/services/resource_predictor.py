import math
from typing import Dict, Any, List
from ..models.schemas import ResourceDemand, DisasterType

class ResourceDemandPredictor:
    """
    Real-Time Rescue Resource Demand Prediction Engine
    Calculates operational requirements based on population density,
    vulnerable demographics (children, elderly, disabled), hazard type, and terrain access.
    """

    @staticmethod
    def predict_resources(
        locality: str,
        affected_population: int,
        children: int,
        elderly: int,
        disabled: int,
        hazard_type: DisasterType,
        severity_factor: float, # 1.0 - 2.5
        is_water_inundated: bool = False
    ) -> ResourceDemand:
        
        # 1. Rescue Personnel: baseline 1 rescuer per 50 people, boosted by vulnerability
        vulnerability_extra = (children * 0.04) + (elderly * 0.05) + (disabled * 0.12)
        base_rescuers = (affected_population / 45.0) * severity_factor + vulnerability_extra
        rescue_teams_req = max(2, math.ceil(base_rescuers / 10.0)) # 10 members per NDRF/SDRF team
        
        # 2. Watercraft & Vehicles
        if is_water_inundated or hazard_type in [DisasterType.FLOOD, DisasterType.CYCLONE, DisasterType.TSUNAMI]:
            boats_req = max(4, math.ceil((affected_population * 0.25) / 15.0)) # 15 capacity per boat
        else:
            boats_req = 0

        # Ambulances: 1 per 250 general + 1 per 20 disabled/critical elderly
        ambulances_req = max(2, math.ceil((affected_population / 250.0) + (disabled / 20.0) + (elderly / 60.0)))

        # Medical Staff: 1 doctor/paramedic per 120 affected
        medical_staff_req = max(4, math.ceil(affected_population / 120.0 * severity_factor))

        # Food & Potable Water
        food_packets_req = int(affected_population * 3 * 1.15) # 3 meals/day + 15% buffer
        water_litres_req = int(affected_population * 4.5) # WHO minimum emergency standard: 4.5L/person/day

        # Temporary Shelter Capacity Needed
        shelter_cap_needed = int(affected_population * 0.70)

        # Baseline availability estimates (simulated local administration stockpile)
        rescue_teams_avail = max(1, int(rescue_teams_req * 0.65))
        boats_avail = max(1, int(boats_req * 0.55))
        ambulances_avail = max(1, int(ambulances_req * 0.70))
        medical_staff_avail = max(2, int(medical_staff_req * 0.60))
        food_ready = int(food_packets_req * 0.75)
        water_avail = int(water_litres_req * 0.80)

        return ResourceDemand(
            locality=locality,
            affected_population=affected_population,
            children_count=children,
            elderly_count=elderly,
            disabled_count=disabled,
            rescue_teams_required=rescue_teams_req,
            rescue_teams_available=rescue_teams_avail,
            boats_required=boats_req,
            boats_available=boats_avail,
            ambulances_required=ambulances_req,
            ambulances_available=ambulances_avail,
            medical_staff_required=medical_staff_req,
            medical_staff_available=medical_staff_avail,
            food_packets_required=food_packets_req,
            food_packets_ready=food_ready,
            potable_water_litres_required=water_litres_req,
            potable_water_available=water_avail,
            emergency_shelters_capacity=shelter_cap_needed,
            emergency_shelters_occupied=int(shelter_cap_needed * 0.42)
        )

    @staticmethod
    def get_medical_equipment_checklist(disaster_type: DisasterType) -> Dict[str, Any]:
        """Authorized medical equipment checklists mapped to disaster operational profiles (Section 41)."""
        checklists = {
            DisasterType.FLOOD: {
                "categories": [
                    {"name": "Waterborne Disease Control", "items": ["Chlorine Water Purification Tablets", "Oral Rehydration Salts (ORS)", "Antidiarrheal Kits", "Doxycycline Prophylaxis"]},
                    {"name": "Emergency Trauma & Hypothermia", "items": ["Emergency Foil Blankets", "Spine Boards & Floating Stretchers", "Waterproof Dressing & Antiseptics", "Splints"]},
                    {"name": "Responder Protective Gear", "items": ["Snake Bite Antivenom Vials", "Anti-tetanus toxoids", "Personal Floatation Vests", "Infection Control Coveralls"]}
                ],
                "protocols": "Directorate General of Health Services (DGHS) Flood Response Protocol"
            },
            DisasterType.CYCLONE: {
                "categories": [
                    {"name": "Severe Trauma Kits", "items": ["Cervical Collars", "Tourniquets & Hemostatic Gauze", "Portable Oxygen Concentrators", "Laceration Suture Kits"]},
                    {"name": "Field Hospital Supplies", "items": ["Backup Diesel Powered Autoclaves", "Tetanus Immunoglobulin", "IV Cannulas & Normal Saline 500ml", "Burn Gel Dressings"]},
                    {"name": "Pediatric & Geriatric Care", "items": ["Pediatric Antibiotic Syrups", "Insulin Portable Cold Chain Bags", "Nebulizer Units", "Portable Glucometers"]}
                ],
                "protocols": "National Disaster Management Authority (NDMA) Cyclone Medical SOP"
            },
            DisasterType.EARTHQUAKE: {
                "categories": [
                    {"name": "Extrication & Crush Syndrome", "items": ["Mannitol 20% Infusions", "Hydraulic Rescue Tool Support Packs", "Rigid Spinal Immobilization Boards", "Crush Injury Assessment Monitors"]},
                    {"name": "Advanced Life Support", "items": ["Automated External Defibrillators (AEDs)", "Emergency Airway Intubation Packs", "Portable Ultrasound (FAST)", "Thoracostomy Drain Kits"]},
                    {"name": "Blood Transfusion Logistics", "items": ["Mobile Blood Bank Cold Boxes", "Rapid Blood Typing Kits", "Volume Expanders", "Pressure Infuser Bags"]}
                ],
                "protocols": "WHO / Ministry of Health & Family Welfare Earthquake Trauma Protocol"
            }
        }
        return checklists.get(disaster_type, checklists[DisasterType.FLOOD])
