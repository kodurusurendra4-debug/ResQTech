import random
from typing import List, Dict, Any
from datetime import datetime
from ..models.schemas import ThermalDetection

class ThermalSensorCVService:
    """
    Thermal Sensor Computer Vision (CV) Analytics Service
    Interfaces with calibrated FLIR / Long-Wave Infrared (LWIR) drone and handheld sensors.
    Applies radiometric isotherm thresholding and contour blob analysis to discriminate
    between human vital heat signatures (36.5°C - 37.5°C) and animal/debris thermal signatures.
    """

    @staticmethod
    def get_connected_sensors() -> List[Dict[str, Any]]:
        return [
            {
                "sensor_id": "FLIR-LWIR-DRONE-01",
                "hardware_model": "FLIR Vue Pro R 640 Radiometric LWIR",
                "carrier_platform": "NDRF Aerial Search Drone Unit-4",
                "status": "ONLINE",
                "battery_pct": 86,
                "altitude_meters": 35.0,
                "current_sector": "Kakinada Lowlands / Sector 4 Submerged Zone",
                "calibration_status": "Calibrated (NIST Standard)",
                "ambient_temp_celsius": 28.4
            },
            {
                "sensor_id": "HANDHELD-IR-SCOPE-02",
                "hardware_model": "InfiRay T3X Search & Rescue Thermal Core",
                "carrier_platform": "SDRF Ground Extrication Team Beta",
                "status": "ONLINE",
                "battery_pct": 92,
                "altitude_meters": 1.5,
                "current_sector": "Structural Collapse Site A, Block 3",
                "calibration_status": "Calibrated",
                "ambient_temp_celsius": 29.1
            },
            {
                "sensor_id": "FOREST-SCOUT-CAM-03",
                "hardware_model": "Pulsar Helion 2 XP50 Pro",
                "carrier_platform": "Wildlife Rescue Patrol Kaziranga East",
                "status": "STANDBY",
                "battery_pct": 68,
                "altitude_meters": 4.0,
                "current_sector": "Panbari Corridor Sector 2",
                "calibration_status": "Calibrated",
                "ambient_temp_celsius": 27.0
            }
        ]

    @staticmethod
    def simulate_detections(sensor_id: str) -> List[ThermalDetection]:
        """
        Simulates real-time heat signature detections captured by the radiometric sensor stream.
        """
        now = datetime.utcnow()
        if sensor_id == "FLIR-LWIR-DRONE-01":
            return [
                ThermalDetection(
                    detection_id="TH-SIG-8491",
                    timestamp=now,
                    sensor_id=sensor_id,
                    target_type="Human (Probable Child/Adult Survivor)",
                    confidence=0.92,
                    temperature_celsius=36.8,
                    bounding_box={"x": 38.5, "y": 44.2, "width": 12.0, "height": 18.0},
                    movement_detected=True,
                    verified_by_operator=False,
                    notes="Heat blob on rooftop surrounded by 1.8m floodwaters. Rhythmic respiratory thermal bloom."
                ),
                ThermalDetection(
                    detection_id="TH-SIG-8492",
                    timestamp=now,
                    sensor_id=sensor_id,
                    target_type="Animal (Stranded Livestock/Dog)",
                    confidence=0.86,
                    temperature_celsius=38.9,
                    bounding_box={"x": 68.0, "y": 28.0, "width": 16.0, "height": 14.0},
                    movement_detected=True,
                    verified_by_operator=False,
                    notes="Elevated canine/bovine core temp signature on elevated mud mound."
                ),
                ThermalDetection(
                    detection_id="TH-SIG-8493",
                    timestamp=now,
                    sensor_id=sensor_id,
                    target_type="Debris / Latent Solar Heat",
                    confidence=0.34,
                    temperature_celsius=43.2,
                    bounding_box={"x": 18.0, "y": 72.0, "width": 22.0, "height": 16.0},
                    movement_detected=False,
                    verified_by_operator=False,
                    notes="Tin roof debris releasing retained thermal radiation. Non-vital pattern."
                )
            ]
        else:
            return [
                ThermalDetection(
                    detection_id="TH-SIG-9012",
                    timestamp=now,
                    sensor_id=sensor_id,
                    target_type="Human (Entrapped Survivor)",
                    confidence=0.89,
                    temperature_celsius=36.4,
                    bounding_box={"x": 52.0, "y": 50.0, "width": 14.0, "height": 22.0},
                    movement_detected=True,
                    verified_by_operator=False,
                    notes="Vital heat radiation detected 1.2m beneath slab void. Responder acoustic check advised."
                )
            ]
