@echo off
echo 🚀 Starting GoldSight Development Environment

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.9+ first.
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install

REM Setup backend
echo 🐍 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install backend dependencies
echo 📦 Installing backend dependencies...
pip install -r requirements.txt

REM Go back to root directory
cd ..

echo ✅ Setup complete!
echo.
echo 🌟 To start the development servers:
echo    Frontend: npm run dev
echo    Backend:  npm run dev:backend
echo    Both:     npm run dev:full
echo.
echo 🐳 To use Docker:
echo    docker-compose up -d
echo.
echo 📚 Visit http://localhost:3000 for the frontend
echo 📊 Visit http://localhost:8000/docs for API documentation

pause