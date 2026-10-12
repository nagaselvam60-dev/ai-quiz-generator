@echo off
echo ==============================================
echo   AI Quiz Generator - Starting Full Stack
echo ==============================================
echo.
start "Backend API (FastAPI)" cmd /k "cd /d %~dp0backend && py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
start "Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Both Backend and Frontend started in separate windows!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5174
echo.
pause
