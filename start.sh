#!/bin/bash

echo "🚀 Starting GoldSight Development Environment"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Setup backend
echo "🐍 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

# Go back to root directory
cd ..

echo "✅ Setup complete!"
echo ""
echo "🌟 To start the development servers:"
echo "   Frontend: npm run dev"
echo "   Backend:  npm run dev:backend"
echo "   Both:     npm run dev:full"
echo ""
echo "🐳 To use Docker:"
echo "   docker-compose up -d"
echo ""
echo "📚 Visit http://localhost:3000 for the frontend"
echo "📊 Visit http://localhost:8000/docs for API documentation"