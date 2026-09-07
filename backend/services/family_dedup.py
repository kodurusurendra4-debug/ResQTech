import hashlib
from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime
from ..models.schemas import FamilyProfile, FamilyMember, AgeCategory

class DuplicateFamilyResolutionEngine:
    """
    Privacy-Preserving Household Identity & Duplicate Resolution
    Resolves multi-account registrations belonging to the same domestic household.
    Prevents inflating family counts when multiple adult relatives register independently.
    """

    def __init__(self, child_max_age=14, young_max_age=25, adult_max_age=60):
        # Admin-configurable age classification thresholds
        self.child_max_age = child_max_age
        self.young_max_age = young_max_age
        self.adult_max_age = adult_max_age

    def classify_age(self, age: int) -> AgeCategory:
        if age < self.child_max_age:
            return AgeCategory.CHILD
        elif age <= self.young_max_age:
            return AgeCategory.YOUNG
        elif age <= self.adult_max_age:
            return AgeCategory.ADULT
        else:
            return AgeCategory.ELDERLY

    @staticmethod
    def generate_household_hash(ration_card: Optional[str], normalized_address: str, district: str) -> str:
        """
        Creates a one-way deterministic hash combining verified document or standardized address.
        Protects citizen privacy while guaranteeing collision detection.
        """
        salt = "SURAKSHA_INDIA_DISASTER_RESILIENCE_2026"
        token = f"{ration_card.strip().upper() if ration_card else ''}:{normalized_address.lower().strip()}:{district.lower().strip()}:{salt}"
        return hashlib.sha256(token.encode('utf-8')).hexdigest()[:16]

    @staticmethod
    def simulate_ration_card_ocr(document_bytes_placeholder: str) -> Dict[str, Any]:
        """
        Simulates Optical Character Recognition (OCR) on an Indian Ration Card / Smart Card.
        Extracts verified members, age, relationship, and head of household.
        Returns a draft for citizen manual review before committing.
        """
        return {
            "ocr_confidence": 0.94,
            "document_type": "National Food Security Act (NFSA) Digital Ration Card",
            "card_number_masked": "XXXX-XXXX-8921",
            "full_card_number": "AP14028921",
            "head_of_household": "Lakshmi Narayana Rao",
            "extracted_address": "Door No 4-82, Ramalayam Street, Kakinada Rural, Andhra Pradesh",
            "extracted_members": [
                {
                    "name": "Lakshmi Narayana Rao",
                    "relationship": "Self (Head)",
                    "dob": "1961-04-12",
                    "age": 65,
                    "gender": "Male",
                    "blood_group": "O+",
                    "disability": False
                },
                {
                    "name": "Saraswathi Rao",
                    "relationship": "Spouse",
                    "dob": "1964-08-20",
                    "age": 62,
                    "gender": "Female",
                    "blood_group": "B+",
                    "disability": False
                },
                {
                    "name": "Srinivas Rao",
                    "relationship": "Son",
                    "dob": "1992-11-05",
                    "age": 34,
                    "gender": "Male",
                    "blood_group": "O+",
                    "disability": False
                },
                {
                    "name": "Ananya Rao",
                    "relationship": "Daughter-in-Law",
                    "dob": "1995-02-18",
                    "age": 31,
                    "gender": "Female",
                    "blood_group": "A+",
                    "disability": False
                },
                {
                    "name": "Arjun Rao",
                    "relationship": "Grandson",
                    "dob": "2019-06-14",
                    "age": 7,
                    "gender": "Male",
                    "blood_group": "O+",
                    "disability": False
                }
            ]
        }

    def deduplicate_households(self, families: List[FamilyProfile]) -> Tuple[int, int, List[Dict[str, Any]]]:
        """
        Scans registered profiles and merges duplicate accounts that belong to the same household entity.
        Returns (unique_households_count, total_people_count, household_clusters)
        """
        household_clusters: Dict[str, List[FamilyProfile]] = {}

        for fam in families:
            h_key = fam.ration_card_number or fam.address
            if h_key not in household_clusters:
                household_clusters[h_key] = []
            household_clusters[h_key].append(fam)

        unique_households = len(household_clusters)
        
        # Deduplicate individuals within each household cluster
        total_unique_people = 0
        cluster_reports = []

        for h_key, fam_list in household_clusters.items():
            primary = fam_list[0]
            # Union of all distinct family members by name + age
            seen_members = set()
            unified_members = []
            for fam in fam_list:
                for m in fam.members:
                    identifier = (m.name.strip().lower(), m.age)
                    if identifier not in seen_members:
                        seen_members.add(identifier)
                        unified_members.append(m)

            total_unique_people += len(seen_members)
            cluster_reports.append({
                "household_id": primary.family_id,
                "household_name": primary.household_name,
                "associated_logins_count": len(fam_list),
                "unique_people_count": len(unified_members),
                "ration_card_ref": primary.ration_card_number or "Address Matching",
                "children": sum(1 for m in unified_members if m.age_category == AgeCategory.CHILD),
                "elderly": sum(1 for m in unified_members if m.age_category == AgeCategory.ELDERLY),
                "disabled": sum(1 for m in unified_members if m.is_disabled)
            })

        return unique_households, total_unique_people, cluster_reports
