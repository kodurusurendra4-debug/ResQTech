import sys
import os

# Add parent directory to sys.path so we can import backend packages
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.services.risk_engine import RiskScoringEngine
from backend.services.vulnerability_engine import VulnerabilityPrioritizationEngine
from backend.services.family_dedup import DuplicateFamilyResolutionEngine
from backend.services.resource_predictor import ResourceDemandPredictor
from backend.services.wildlife_service import WildlifeResponseService
from backend.services.thermal_cv import ThermalSensorCVService
from backend.data.seed_data import SEED_FAMILIES, SEED_PRIORITY_INCIDENTS
from backend.models.schemas import DisasterType, RiskLevel

def test_risk_scoring():
    print("Testing RiskScoringEngine...")
    assessment = RiskScoringEngine.calculate_locality_risk(
        locality="Surya Rao Peta",
        mandal_taluk="Kakinada Urban",
        district="Kakinada",
        state="Andhra Pradesh",
        latitude=16.9834,
        longitude=82.2451,
        disaster_type=DisasterType.FLOOD,
        rainfall_mm_24h=180.0,
        river_level_danger_ratio=1.20,
        elevation_meters=3.5,
        population_density_sq_km=8500.0,
        coastal_distance_km=2.5,
        historical_event_frequency=7,
        vulnerable_ratio=0.35
    )
    assert assessment.risk_level == RiskLevel.RED, f"Expected RED risk, got {assessment.risk_level}"
    assert len(assessment.main_contributing_factors) >= 4, "Should have explainable risk factors"
    print(f"[OK] Locality Risk: {assessment.risk_score} ({assessment.risk_level.value}) - Factors: {len(assessment.main_contributing_factors)}")

def test_vulnerability_prioritization():
    print("Testing VulnerabilityPrioritizationEngine...")
    ranked = VulnerabilityPrioritizationEngine.rank_rescue_queue(SEED_PRIORITY_INCIDENTS)
    assert len(ranked) >= 3, "Queue should contain incidents"
    assert ranked[0].urgency_rank == 1, "Top item should be rank 1"
    print(f"[OK] Priority Queue Ranked: 1st place is {ranked[0].locality} with score {ranked[0].calculated_priority_score}")

def test_family_dedup():
    print("Testing DuplicateFamilyResolutionEngine...")
    engine = DuplicateFamilyResolutionEngine()
    unique_h, total_people, clusters = engine.deduplicate_households(SEED_FAMILIES)
    # SEED_FAMILIES has 2 profiles with same ration card AP14028921.
    # Should deduplicate into 1 unique household instead of 2 separate families.
    assert unique_h == 1, f"Expected 1 unique household, got {unique_h}"
    assert total_people == 5, f"Expected 5 unique individuals, got {total_people}"
    print(f"[OK] Family Deduplication: Merged 2 accounts into {unique_h} household with {total_people} unique people")

def test_resource_prediction():
    print("Testing ResourceDemandPredictor...")
    demand = ResourceDemandPredictor.predict_resources(
        locality="Test Locality",
        affected_population=10000,
        children=1500,
        elderly=1000,
        disabled=200,
        hazard_type=DisasterType.FLOOD,
        severity_factor=1.8,
        is_water_inundated=True
    )
    assert demand.boats_required > 0, "Boats must be calculated for flood"
    assert demand.potable_water_litres_required == 45000, "WHO standard 4.5L/day check"
    print(f"[OK] Resource Prediction: {demand.rescue_teams_required} teams, {demand.boats_required} boats, {demand.potable_water_litres_required}L water")

def test_wildlife_evacuation():
    print("Testing WildlifeResponseService...")
    parks = WildlifeResponseService.get_protected_areas()
    assert len(parks) >= 3, "Should have multiple protected areas"
    plan = WildlifeResponseService.calculate_evacuation_demand(parks[0])
    assert plan["animals_remaining"] > 0, "Should have remaining animals to evacuate"
    print(f"[OK] Wildlife Service: {parks[0].name} - Remaining: {plan['animals_remaining']}, Vehicles: {plan['specialized_vehicles_required']}")

def test_thermal_cv():
    print("Testing ThermalSensorCVService...")
    sensors = ThermalSensorCVService.get_connected_sensors()
    assert len(sensors) > 0, "Should list connected thermal cameras"
    detections = ThermalSensorCVService.simulate_detections(sensors[0]["sensor_id"])
    assert any("Human" in d.target_type for d in detections), "Should detect human thermal signature"
    print(f"[OK] Thermal CV: {len(detections)} signatures detected by {sensors[0]['hardware_model']}")

if __name__ == "__main__":
    test_risk_scoring()
    test_vulnerability_prioritization()
    test_family_dedup()
    test_resource_prediction()
    test_wildlife_evacuation()
    test_thermal_cv()
    print("\nALL BACKEND CORE SERVICES PASSED SUCCESSFULLY!")
