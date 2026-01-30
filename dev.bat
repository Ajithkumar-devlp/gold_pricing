@echo off
echo 🚀 Starting GoldSight Development Servers

echo 📦 Starting Frontend (Next.js) on http://localhost:3000
start "GoldSight Frontend" cmd /k "npm run dev"

echo ⏳ Waiting 3 seconds before starting backend...
timeout /t 3 /nobreak >nul

echo 🐍 Starting Backend (FastAPI) on http://localhost:8000
start "GoldSight Backend" cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"

echo ✅ Both servers are starting!
echo 📚 Frontend: http://localhost:3000
echo 📊 API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window (servers will keep running)
pause >nul