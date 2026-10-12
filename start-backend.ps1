# Start Backend — AI Quiz Generator
# Run this script from d:\event\event\backend\

Write-Host "Starting AI Quiz Generator Backend with Python 3.13..." -ForegroundColor Cyan
Write-Host ""

cd "$PSScriptRoot\backend"
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
py -3.13 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

