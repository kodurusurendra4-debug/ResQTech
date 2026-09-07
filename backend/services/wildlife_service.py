from typing import List, Dict, Any, Optional
from ..models.schemas import WildlifeProtectedArea, RiskLevel

class WildlifeResponseService:
    """
    Dedicated Wildlife Disaster Management & Evacuation Service
    Coordinates emergency protection, veterinary rescue, and specialized corridor evacuation
    for National Parks, Wildlife Sanctuaries, and Tiger/Elephant reserves across India.
    """

    @staticmethod
    def get_protected_areas() -> List[WildlifeProtectedArea]:
        return [
            WildlifeProtectedArea(
                id="PA-KAZIRANGA-01",
                name="Kaziranga National Park & Tiger Reserve",
                category="National Park & UNESCO World Heritage Site",
                state="Assam",
                district="Golaghat & Nagaon",
                latitude=26.5775,
                longitude=93.1711,
                total_area_sq_km=858.98,
                key_species=[
                    {"name": "Great Indian One-Horned Rhinoceros", "status": "Vulnerable (IUCN)", "est_count": 2613, "source": "Assam Forest Dept Census 2022"},
                    {"name": "Asian Elephant", "status": "Endangered", "est_count": 1100, "source": "Project Elephant MoEFCC"},
                    {"name": "Bengal Tiger", "status": "Endangered", "est_count": 121, "source": "National Tiger Conservation Authority (NTCA)"},
                    {"name": "Eastern Swamp Deer", "status": "Vulnerable", "est_count": 907, "source": "Assam Forest Dept 2023"}
                ],
                current_threat_level=RiskLevel.RED,
                active_disaster="Annual Brahmaputra Basin High Monsoon Surge / Flooding",
                animals_potentially_affected=320,
                animals_rescued=184,
                animals_transported=142,
                destination_shelter="Centre for Wildlife Rehabilitation and Conservation (CWRC), Panbari Highlands",
                wildlife_volunteers_needed=35,
                wildlife_volunteers_available=23
            ),
            WildlifeProtectedArea(
                id="PA-SUNDARBANS-02",
                name="Sundarbans Biosphere Reserve",
                category="Biosphere Reserve & Mangrove Delta",
                state="West Bengal",
                district="South 24 Parganas",
                latitude=21.9497,
                longitude=89.1833,
                total_area_sq_km=4260.0,
                key_species=[
                    {"name": "Royal Bengal Tiger", "status": "Endangered", "est_count": 100, "source": "NTCA Status of Tigers 2022"},
                    {"name": "Estuarine Crocodile", "status": "Least Concern", "est_count": 350, "source": "WB Forest Directorate"},
                    {"name": "Fishing Cat", "status": "Vulnerable", "est_count": 120, "source": "Sundarbans Biosphere Authority"}
                ],
                current_threat_level=RiskLevel.YELLOW,
                active_disaster="Bay of Bengal Severe Depression / Tidal Surge Alert",
                animals_potentially_affected=85,
                animals_rescued=48,
                animals_transported=36,
                destination_shelter="Sajnekhali Mangrove Wildlife Care Centre",
                wildlife_volunteers_needed=25,
                wildlife_volunteers_available=18
            ),
            WildlifeProtectedArea(
                id="PA-PERIYAR-03",
                name="Periyar Tiger Reserve",
                category="National Park & Sanctuary",
                state="Kerala",
                district="Idukki",
                latitude=9.4679,
                longitude=77.1429,
                total_area_sq_km=925.0,
                key_species=[
                    {"name": "Indian Elephant", "status": "Endangered", "est_count": 850, "source": "Kerala Forest Dept Survey"},
                    {"name": "Nilgiri Tahr", "status": "Endangered", "est_count": 210, "source": "Eravikulam-Periyar Highland Survey"},
                    {"name": "Lion-Tailed Macaque", "status": "Endangered", "est_count": 95, "source": "Kerala Wildlife Research Institute"}
                ],
                current_threat_level=RiskLevel.GREEN,
                active_disaster=None,
                animals_potentially_affected=0,
                animals_rescued=0,
                animals_transported=0,
                destination_shelter="Thekkady Veterinary Wildlife Transit Hub",
                wildlife_volunteers_needed=15,
                wildlife_volunteers_available=20
            ),
            WildlifeProtectedArea(
                id="PA-CORBETT-04",
                name="Jim Corbett National Park",
                category="Tiger Reserve",
                state="Uttarakhand",
                district="Nainital & Pauri Garhwal",
                latitude=29.5300,
                longitude=78.7747,
                total_area_sq_km=1288.31,
                key_species=[
                    {"name": "Bengal Tiger", "status": "Endangered", "est_count": 252, "source": "NTCA All India Tiger Estimation"},
                    {"name": "Asian Elephant", "status": "Endangered", "est_count": 1220, "source": "Uttarakhand Forest Dept"},
                    {"name": "Gharial", "status": "Critically Endangered", "est_count": 45, "source": "Ramganga River Survey"}
                ],
                current_threat_level=RiskLevel.YELLOW,
                active_disaster="Ramganga River Swell / Flash Flood Warning",
                animals_potentially_affected=45,
                animals_rescued=22,
                animals_transported=15,
                destination_shelter="Dhikala High-Ridge Wildlife Rescue Compound",
                wildlife_volunteers_needed=20,
                wildlife_volunteers_available=14
            )
        ]

    @staticmethod
    def calculate_evacuation_demand(park: WildlifeProtectedArea) -> Dict[str, Any]:
        """Calculates transport vehicles, veterinary tranquilizer crates, and remaining animals to relocate."""
        remaining = max(0, park.animals_potentially_affected - park.animals_transported)
        # 1 specialized animal transport truck / flatbed boat carries approx 3 large animals or 8 smaller mammals
        specialized_trucks_req = max(1, (remaining + 2) // 3)
        veterinarians_req = max(2, (remaining + 9) // 10)
        
        return {
            "park_id": park.id,
            "park_name": park.name,
            "animals_affected": park.animals_potentially_affected,
            "animals_rescued": park.animals_rescued,
            "animals_transported": park.animals_transported,
            "animals_remaining": remaining,
            "relocation_percentage": round((park.animals_transported / max(1, park.animals_potentially_affected)) * 100, 1),
            "specialized_vehicles_required": specialized_trucks_req,
            "veterinarians_required": veterinarians_req,
            "volunteers_needed": park.wildlife_volunteers_needed,
            "volunteers_available": park.wildlife_volunteers_available,
            "volunteers_remaining_needed": max(0, park.wildlife_volunteers_needed - park.wildlife_volunteers_available)
        }
