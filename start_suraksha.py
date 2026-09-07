"""
SURAKSHA AI — Master Service Orchestrator
Starts both the FastAPI Backend (Port 8000) and Vite Frontend (Port 5173).
"""

import subprocess
import sys
import os
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")
    
    print("=" * 70)
    print("  SURAKSHA AI — Intelligent Disaster Management Platform (India)")
    print("  Predict Risk. Protect People. Coordinate Rescue. Save Lives.")
    print("=" * 70)

    # 1. Start Python FastAPI Backend
    print("\n[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=root_dir
    )

    time.sleep(2)

    # 2. Start Vite Frontend
    print("[2/2] Starting Vite Frontend on http://localhost:5173 ...")
    shell_cmd = True if os.name == 'nt' else False
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=shell_cmd
    )

    print("\n" + "=" * 70)
    print("  ALL SERVICES RUNNING SUCCESSFULLY!")
    print("  - Frontend: http://localhost:5173")
    print("  - Backend API: http://localhost:8000")
    print("  - OpenAPI / Swagger Docs: http://localhost:8000/docs")
    print("  - WebSocket Stream: ws://localhost:8000/ws/live")
    print("=" * 70)
    print("Press Ctrl+C to stop all services.\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping Suraksha AI services...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
