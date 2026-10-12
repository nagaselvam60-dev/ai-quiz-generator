@echo off
echo Starting AI Quiz Generator Backend with Python 3.13...
echo API Docs: http://localhost:8000/docs
echo.
py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
