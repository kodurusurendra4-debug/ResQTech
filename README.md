# SURAKSHA AI (सुरक्षा AI)
### Intelligent Disaster Management & Emergency Response Platform for India

> **Primary Tagline:** *"Predict Risk. Protect People. Coordinate Rescue. Save Lives."*  
> **Secondary Tagline:** *"One intelligent platform for citizens, responders, volunteers and wildlife during disasters."*

---

## 1. Product Overview

**SURAKSHA AI** is a national-scale, intelligent disaster-management and emergency response platform built specifically for India's geographical, hydrological, and demographic complexities.

Rather than being a static UI mockup or simple disaster news feed, SURAKSHA AI is powered by **population-aware vulnerability intelligence**:
$$\text{Priority} = \text{Hazard Severity} \times \text{Population Exposure} \times \text{Vulnerability Factor} \times \text{Accessibility Difficulty}$$

It answers the critical operational question for emergency authorities:
> **"WHO NEEDS HELP FIRST, WHERE, AND WHAT RESOURCES ARE REQUIRED?"**

---

## 2. Core Architectural Highlights

### AI & Analytical Engines
1. **Multi-Hazard Locality Risk Scoring Engine (`backend/services/risk_engine.py`)**:
   - $Risk = Hazard \times Exposure \times Vulnerability$ normalized $0-100$.
   - Red ($70-100$), Yellow ($40-69$), Green ($0-39$).
   - SHAP-like explainability breaking down factor weights (24h rainfall, CWC river gauge danger ratio, lowland elevation, density, vulnerability concentration).
2. **Vulnerable Population Prioritization Engine (`backend/services/vulnerability_engine.py`)**:
   - Ranks search-and-rescue queues by concentrating resources on areas with trapped children, elderly, and mobility-impaired citizens.
3. **Privacy-Preserving Duplicate Household Deduplication (`backend/services/family_dedup.py`)**:
   - Resolves multi-account registrations within the same family into a single **Household Entity** using cryptographic matching on verified ration card references (NFSA smart cards).
   - Prevents artificial demographic inflation (e.g. 2 relatives registering on different phones count as 1 household with 5 individuals, not 2 separate families).
4. **Demographic Resource Demand Prediction Engine (`backend/services/resource_predictor.py`)**:
   - Dynamically calculates demanded vs. available rescue boats, NDRF battalions, ambulances, medical personnel, food packets, and potable water (WHO standard $4.5\text{L}/\text{person}/\text{day}$).
5. **Thermal Sensor Radiometric Computer Vision (`backend/services/thermal_cv.py`)**:
   - Calibrated LWIR FLIR drone sensor simulation with Ironbow false-color palette.
   - Detects and discriminates human vitals ($36.5^\circ\text{C}-37.5^\circ\text{C}$) from animals ($38.5^\circ\text{C}-39.5^\circ\text{C}$) and hot debris with confidence scoring.
6. **Wildlife Disaster Management & Evacuation Service (`backend/services/wildlife_service.py`)**:
   - Protects flagship species across Kaziranga, Sundarbans, Jim Corbett, and Periyar during monsoon inundations.
   - Calculates evacuation fleet demand, safe transit highlands, and specialized forest volunteer dispatch.
7. **Multilingual AI Voice & Text Emergency Assistant (`frontend/src/components/chatbot/AIChatbotModal.tsx`)**:
   - Supports 10 official Indian languages: English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Bengali (বাংলা), Marathi (मराठी), Odia (ଓଡ଼ିଆ), Gujarati (ગુજરાતી).
   - Real-time speech recognition (Web Speech API), speech synthesis audio responses, triage detection, and 1-tap SOS escalation.
8. **Offline & Low-Connectivity Resilience Layer (`frontend/src/services/offlineStorage.ts`)**:
   - PWA Service Worker caching of emergency numbers, cached safe shelters, and offline SOS queue.
   - Automatic cellular fallback to direct SMS payload generation for 112 (`sms:112?body=...`).

---

## 3. The 17 Core Application Views

1. **Home**: Hero banner, compact locality threat widget, 12 disaster categories, live national rescue metrics, quick actions.
2. **Live Risk Map**: Full-screen interactive GIS dashboard with 13 switchable layers (disasters, AI risk zones, floodplains, shelters, hospitals, rescue teams, wildlife reserves, turn-by-turn routing).
3. **Disaster Information**: Complete SOP handbooks for 12 disaster types (Warning signs, What to do, What NOT to do, Before/During/After checklists, 1-tap dials, citizen report triggers).
4. **AI Emergency Assistant**: Multilingual voice and text conversational assistant with location triage.
5. **Emergency Contacts & Directory**: Official verified Indian helplines (112, 108, 101, 1070, 1077, NDRF, Coast Guard, Wildlife) + custom family emergency contacts.
6. **Safe Places Finder**: Certified cyclone shelter & hospital directory with GIS radius search, live capacity/occupancy gauges, and 1-tap safe check-in.
7. **SOS Command System**: High-visibility SOS trigger with 5-second accidental cancel countdown, GPS lock, photo/video/voice note attachment, and offline SMS fallback.
8. **Report Disaster**: Citizen disaster reporting with severity selection, photo/video capture simulation, and geolocation lock.
9. **National Disaster Updates**: Verified official government bulletins (NDMA/SDMA/IMD) clearly demarcated from community reports.
10. **Volunteer Network**: Enrollment for ex-servicemen, forest dept veterans, swimmers, and medical personnel with live available vs. required counters.
11. **Rescue Dashboard**: Operational command console for NDRF/SDRF responders featuring the vulnerability-ranked priority queue, thermal sensor visualizer, and medical equipment checklists.
12. **Wildlife Emergency**: Protected areas monitoring (Kaziranga, Sundarbans) with animal translocation pipeline and species census breakdown.
13. **Coastal Risk Analytics**: 7,516 km coastline storm-surge analysis covering maritime states with shelter deficit calculations.
14. **Relief & Donations**: Transparent financial contributions routed directly to official PMNRF & State CMRF treasuries + physical relief inventory pledges.
15. **Profile & Family Vulnerability**: Ration card OCR extraction simulator, demographic breakdown, duplicate household resolution audit, and device permission management.
16. **Login & Registration**: Demo OTP authentication flow (Code: `112233`) and WebAuthn biometric passkey simulation without storing raw biometrics.
17. **Admin Dashboard & Hackathon Presentation Mode**: Central governance hub featuring the 5-phase interactive cyclone disaster cascade.

---

## 4. Quick Start & Execution

### Prerequisites
- Node.js v18+ (verified on v24)
- Python 3.10+ (verified on Python 3.14)

### Starting the Application
Open a terminal in `suraksha-ai`:

```bash
# Launch both Backend and Frontend concurrently
python start_suraksha.py
```

Alternatively, run each service individually:

```bash
# Terminal 1: Python FastAPI Backend
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: React Frontend
cd frontend
npm run dev
```

### Access URLs
- **Web Application:** [http://localhost:5173](http://localhost:5173)
- **FastAPI Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Live WebSocket Stream:** `ws://localhost:8000/ws/live`

### Hackathon Presentation Flow
1. Open the web application and locate the **"Sim Step 1/5"** button in the navbar or navigate to **Admin & Simulation**.
2. Advance through the cascade to demonstrate:
   - Baseline Weather Advisory (GREEN)
   - Cyclone Surge Alert (YELLOW)
   - RED Risk Alert & Vulnerable Population Clustering ($12,500$ affected, $1,850$ children, $1,100$ elderly)
   - Rescue Dispatch & FLIR Radiometric UAV thermal scan detecting survivors
   - Safe Shelter Check-ins reducing unaccounted populations dynamically
   - Wildlife corridor evacuation at Kaziranga / Sundarbans.
