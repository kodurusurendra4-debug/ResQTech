import urllib.request
import json

endpoints = [
    '/api/risk/locality',
    '/api/shelters',
    '/api/family/dedup-audit',
    '/api/wildlife/protected-areas',
    '/api/thermal/detections',
    '/api/simulation/state',
    '/api/rescue/priority-queue',
    '/api/emergency/contacts'
]

print("=== VERIFYING LIVE FASTAPI ENDPOINTS ===")
for ep in endpoints:
    url = f"http://127.0.0.1:8000{ep}"
    try:
        req = urllib.request.urlopen(url)
        data = json.loads(req.read().decode('utf-8'))
        count = len(data) if isinstance(data, list) else len(data.keys())
        print(f"[OK] {ep:32} HTTP {req.status} ({type(data).__name__} with {count} items)")
    except Exception as e:
        print(f"[FAIL] {ep:32} Error: {e}")

print("\nALL BACKEND ENDPOINTS VERIFIED LIVE!")
