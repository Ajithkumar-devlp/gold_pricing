Write-Host "🚀 Starting GoldSight Development Environment" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.9+ first." -ForegroundColor Red
    Write-Host "Download from: https://python.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Setup backend
Write-Host "🐍 Setting up backend..." -ForegroundColor Blue
Set-Location backend

# Create virtual environment if it doesn't exist
if (!(Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}

# Go back to root directory
Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌟 To start the development servers:" -ForegroundColor Cyan
Write-Host "   Frontend only: npm run dev" -ForegroundColor White
Write-Host "   Backend only:  npm run dev:backend" -ForegroundColor White
Write-Host "   Both servers:  npm run dev:full" -ForegroundColor White
Write-Host ""
Write-Host "🐳 To use Docker:" -ForegroundColor Cyan
Write-Host "   docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "📚 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "📊 API Docs: http://localhost:8000/docs" -ForegroundColor Yellow

Read-Host "Press Enter to continue"