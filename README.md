# AURUM - Intelligent Gold Rate Analysis & Buying Guide

AURUM is a comprehensive web-based platform that helps users make smart gold-buying decisions by comparing physical gold and digital gold prices across multiple platforms, analyzing gold rate growth, and visualizing profitability over time.

## 🌟 Features

- **Real-time Price Comparison**: Compare gold prices across 15+ platforms (Paytm, PhonePe, Google Pay, Amazon Pay, MMTC-PAMP, SafeGold, Tanishq, Kalyan Jewellers, Malabar Gold, SBI, HDFC, etc.)
- **Physical vs Digital Gold Analysis**: Side-by-side comparison of physical and digital gold investments
- **Interactive Charts**: Visualize gold price trends and growth patterns
- **Profit Calculator**: Calculate potential profits based on investment timeline
- **Smart Recommendations**: AI-powered suggestions for optimal gold investment strategies
- **Historical Data Analysis**: Track gold price movements over different time periods
- **Weight-based Calculations**: Compare costs for different gold quantities

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Interactive charts and data visualization

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **SQLAlchemy** - Database ORM
- **Celery + Redis** - Background task processing
- **BeautifulSoup + Selenium** - Web scraping

### Infrastructure
- **Docker** - Containerization
- **AWS/Vercel** - Deployment platforms
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Windows Users (Recommended)

**Option 1: Command Prompt (No Policy Issues)**
```cmd
start.bat
```

**Option 2: Fix PowerShell Policy & Use Advanced Script**
```powershell
# First, fix the execution policy (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run the setup
powershell -ExecutionPolicy Bypass -File setup.ps1
```

**Option 3: Manual Commands (Command Prompt)**
```cmd
npm install
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
dev.bat
```

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL (optional - for production)
- Redis (optional - for background tasks)

### Access Your Application
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

### Docker Alternative
```bash
docker-compose up -d
```

### Manual Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set environment variables**
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost/goldsight
REDIS_URL=redis://localhost:6379
```

5. **Run the API server**
```bash
uvicorn main:app --reload --port 8000
```

6. **API Documentation**
Visit `http://localhost:8000/docs` for interactive API documentation

## 📊 API Endpoints

### Gold Prices
- `GET /api/gold-prices` - Get current gold prices
- `POST /api/compare` - Compare gold prices for specific weight
- `GET /api/historical-data` - Get historical price data

### Analysis
- `POST /api/profit-analysis` - Calculate profit/loss analysis
- `GET /api/recommendations` - Get investment recommendations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost/goldsight
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
SCRAPING_DELAY=2
MAX_CONCURRENT_SCRAPES=5
```

### Database Setup

1. **Create PostgreSQL database**
```sql
CREATE DATABASE goldsight;
```

2. **Run migrations**
```bash
python -c "from database.db import Base, engine; Base.metadata.create_all(bind=engine)"
```

## 🕷️ Web Scraping

The platform uses ethical web scraping practices:

- **Respectful delays** between requests
- **User-agent rotation** to avoid blocking
- **Error handling** with fallback data
- **Caching** to reduce server load
- **Rate limiting** to prevent abuse

### Supported Platforms

**Digital Gold:**
- Paytm Gold
- PhonePe Gold
- Google Pay Gold
- Amazon Pay Gold
- MobiKwik Gold
- MMTC-PAMP Gold
- SafeGold
- Augmont Gold
- Jar App Gold
- Digital Gold India

**Physical Gold:**
- Tanishq
- Kalyan Jewellers
- Malabar Gold & Diamonds
- Joyalukkas
- PC Jeweller
- HDFC Bank Gold
- SBI Gold
- ICICI Bank Gold
- Axis Bank Gold
- Kotak Mahindra Gold

## 📈 Data Analysis Features

### Price Comparison
- Real-time price fetching
- Total cost calculation (including GST and making charges)
- Best deal identification
- Savings calculation

### Growth Analysis
- Historical price trends
- Moving averages
- Volatility analysis
- Support/resistance levels

### Profit Calculator
- Investment timeline analysis
- Compound growth calculations
- Risk assessment
- Portfolio diversification scoring

## 🔒 Security & Compliance

- **HTTPS enforcement** for all communications
- **Input validation** to prevent scraping abuse
- **Rate limiting** on API endpoints
- **Data privacy** - no personal financial data stored
- **Ethical scraping** following robots.txt guidelines

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Docker)
```bash
docker build -t goldsight-api .
docker run -p 8000:8000 goldsight-api
```

### Full Stack (Docker Compose)
```bash
docker-compose up -d
```

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Gold price data providers
- Open source libraries and frameworks
- Community contributors

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@goldsight.com
- Documentation: [docs.goldsight.com](https://docs.goldsight.com)

---

**Disclaimer**: This platform is for informational purposes only. Gold prices are subject to market fluctuations. Always consult with financial advisors before making investment decisions.