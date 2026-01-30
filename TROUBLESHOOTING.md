# GoldSight Troubleshooting Guide

## 🚨 Common Windows Issues & Solutions

### 1. PowerShell Execution Policy Error
**Error**: `running scripts is disabled on this system`

**Solutions**:

**A. Use Command Prompt Instead (Easiest)**
- Use `cmd` instead of PowerShell
- Run `start.bat` or `dev.bat`

**B. Fix PowerShell Policy**
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` to confirm

**C. Bypass Policy for Single Command**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### 2. Node.js Not Found
**Error**: `'node' is not recognized as an internal or external command`

**Solution**:
1. Download and install [Node.js](https://nodejs.org/)
2. Restart Command Prompt/PowerShell
3. Verify: `node --version`

### 3. Python Not Found
**Error**: `'python' is not recognized as an internal or external command`

**Solution**:
1. Download and install [Python](https://python.org/)
2. During installation, check "Add Python to PATH"
3. Restart Command Prompt/PowerShell
4. Verify: `python --version`

### 4. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID_NUMBER> /F

# For port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### 5. Virtual Environment Issues
**Error**: Issues activating Python virtual environment

**Solution**:
```cmd
# Delete existing venv and recreate
cd backend
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 6. Permission Denied Errors
**Error**: Permission denied when installing packages

**Solutions**:
- Run Command Prompt as Administrator
- Or use: `npm install --no-optional`
- For Python: `pip install --user -r requirements.txt`

## 🔧 Alternative Setup Methods

### Method 1: Docker (Recommended for Complex Issues)
```cmd
# Install Docker Desktop first
docker-compose up -d
```

### Method 2: Manual Step-by-Step
```cmd
# 1. Install frontend dependencies
npm install

# 2. Setup backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 3. Start frontend (new window)
cd ..
npm run dev

# 4. Start backend (another new window)
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000
```

### Method 3: Use Different Terminals
- **Git Bash**: Often works better than PowerShell
- **Windows Terminal**: Modern alternative
- **VS Code Terminal**: Integrated development environment

## 🌐 Verify Installation

After setup, check these URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📞 Still Having Issues?

1. **Check Prerequisites**:
   - Node.js 18+ installed
   - Python 3.9+ installed
   - Both added to PATH

2. **Try Docker Alternative**:
   ```cmd
   docker-compose up -d
   ```

3. **Create GitHub Issue**:
   - Include error messages
   - Mention your Windows version
   - Include Node.js and Python versions

## 🎯 Quick Commands Reference

```cmd
# Check versions
node --version
npm --version
python --version

# Kill processes on ports
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# Restart services
npm run dev:servers
```

## 💡 Pro Tips

1. **Use Command Prompt** instead of PowerShell to avoid policy issues
2. **Run as Administrator** if you get permission errors
3. **Restart your terminal** after installing Node.js or Python
4. **Use Docker** if you want to avoid local setup complexity
5. **Check Windows Defender** - it might block some operations