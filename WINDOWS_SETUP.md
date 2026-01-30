# Windows Setup Guide for GoldSight

## 🚀 Quick Setup Options

### Option 1: Command Prompt (Recommended - No Policy Issues)
1. Open **Command Prompt** (cmd) - not PowerShell
2. Run the batch script:
```cmd
start.bat
```

### Option 2: Fix PowerShell Policy First
1. Open **PowerShell as Administrator**
2. Run this command to allow scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
3. Then run:
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### Option 3: Manual Step-by-Step (Command Prompt)

1. **Install Prerequisites**
   - [Node.js 18+](https://nodejs.org/)
   - [Python 3.9+](https://python.org/)

2. **Setup Frontend**
```cmd
npm install
```

3. **Setup Backend**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

4. **Start Development Servers**

**Option A: Automatic (Opens 2 separate windows)**
```cmd
dev.bat
```

**Option B: Manual (Single window)**
```cmd
npm run dev
```
Then in a new Command Prompt window:
```cmd
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## 🐳 Docker Alternative (If you have Docker Desktop)

```cmd
docker-compose up -d
```

## ❓ Troubleshooting

### PowerShell Execution Policy Error
If you get "running scripts is disabled" error, fix it with:

**Option A: Enable for Current User (Recommended)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Option B: Use Command Prompt Instead**
Use `cmd` instead of PowerShell:
```cmd
start.bat
```

**Option C: Bypass Policy for Single Command**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev:full"
```

### Python Virtual Environment Issues
If you get permission errors, try:
```cmd
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node.js Issues
Make sure Node.js is in your PATH. Restart Command Prompt after installation.

### Port Already in Use
If ports 3000 or 8000 are busy:
```cmd
# Kill processes on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Kill processes on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

## 🎯 Next Steps

1. Visit http://localhost:3000 to see the GoldSight homepage
2. Try the gold price comparison feature
3. Explore the growth analysis charts
4. Check the API documentation at http://localhost:8000/docs

## 📞 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Create an issue on GitHub if you encounter problems
- Make sure all prerequisites are properly installed