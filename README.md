# 🥇 AURUM - Intelligent Precious Metals Investment Platform

AURUM is a comprehensive web-based platform that empowers users to make informed investment decisions in gold and silver. With real-time price tracking, advanced analysis tools, and portfolio management features, AURUM provides everything needed for smart precious metals investing.

## ✨ Key Features

### 📊 Real-Time Market Data
- **Live Price Updates**: Gold and silver prices updated every minute from multiple APIs
- **25+ Platform Coverage**: Compare prices across digital and physical platforms
- **Real-Time Price Tracker**: Monitor genuine price changes as they happen
- **Market Trend Analysis**: Bullish/bearish indicators with risk assessment

### 💰 Investment Management
- **SIP Investment Planning**: Systematic Investment Plan calculator with projections
- **Single Investment Analysis**: Lump sum investment calculator with 6-month projections
- **Portfolio Tracking**: Real-time portfolio value and returns monitoring
- **Investment History**: Track all investments with profit/loss analysis

### 🔍 Advanced Analysis Tools
- **Market Analysis**: Trend analysis with investment recommendations
- **Platform Comparison**: Find best deals across 25+ platforms
- **Profit Calculators**: Calculate returns for different investment strategies
- **Price Alerts**: Get notified of significant price movements

### 🏦 Platform Integration
**Digital Platforms** (No Making Charges):
- MMTC-PAMP Gold, SafeGold, Amazon Pay Gold, Google Pay Gold
- Groww Gold, Zerodha Coin, PhonePe Gold, Paytm Gold
- Upstox Gold, Angel One Gold, ICICI Direct Gold, Jar App

**Physical Platforms** (With Making Charges):
- Tanishq, Kalyan Jewellers, Malabar Gold, CaratLane
- PC Jeweller, Senco Gold, Candere, BlueStone
- Joyalukkas, Reliance Jewels, Local Jewellers

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication and real-time database
- **Context API** - State management for prices and portfolio

### Backend
- **FastAPI** - Modern Python web framework
- **Real-time APIs** - Multiple gold/silver price data sources
- **Web Scraping** - BeautifulSoup for platform price extraction
- **Celery + Redis** - Background task processing for price updates

### Key Libraries
- **Recharts** - Data visualization (removed in favor of functional analysis)
- **Axios** - HTTP client for API requests
- **Firebase SDK** - User authentication and data storage

## 🚀 Quick Start

### Windows Users (Recommended)

**Option 1: Quick Start (Command Prompt)**
```cmd
start.bat
```

**Option 2: Development Mode**
```cmd
dev.bat
```

**Option 3: PowerShell Setup (if policies allow)**
```powershell
# Fix execution policy first (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run setup
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.9+** (for backend)
- **Firebase Account** (for authentication)

### Manual Setup

1. **Install frontend dependencies**
```cmd
npm install
```

2. **Setup backend** (optional - for price scraping)
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your config to `lib/firebase.ts`

4. **Start development servers**
```cmd
npm run dev
```

### Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000 (if running)
- **API Documentation**: http://localhost:8000/docs

## 📱 Application Pages

### 🏠 Home Page (`/`)
- Welcome screen with feature overview
- Quick navigation to main sections
- Current market status display

### 📊 Dashboard (`/dashboard`)
- Real-time gold and silver prices
- Portfolio overview with returns
- Investment history management
- Quick investment actions

### 📈 Analysis Page (`/analysis`)
- **Market Analysis**: Trend analysis with recommendations
- **SIP Analysis**: Systematic investment planning with projections
- **Single Investment**: Lump sum investment calculator
- **Portfolio Review**: Current holdings analysis
- **Platform Comparison**: Best deals across all platforms

### 🔍 Compare Page (`/compare`)
- Side-by-side platform comparison
- Filter by digital/physical platforms
- Total cost calculation including making charges
- Best deal identification

### 👤 User Management
- **Login/Register**: Firebase authentication
- **Profile Management**: User preferences and settings
- **Investment Tracking**: Personal investment history

## 🔧 Key Components

### Real-Time Price System
```typescript
// Automatic price updates every minute
const { currentGoldPrice, currentSilverPrice } = usePortfolio()
const { baseGoldPrice, baseSilverPrice } = usePlatformPrices()
```

### Investment Calculators
- **SIP Calculator**: Monthly investments with compound growth
- **Single Investment**: Lump sum with projected returns
- **Portfolio Tracker**: Real-time value and profit/loss

### Platform Price Integration
- **25+ Platforms**: Digital and physical gold/silver dealers
- **Making Charges**: Realistic charges for physical platforms
- **Real-time Updates**: Prices updated every minute
- **Best Deal Finder**: Automatic identification of lowest prices

## ⚙️ Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Get your config and update `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

### Environment Variables (Backend)
Create `.env` file in backend directory:
```env
# Database (optional)
DATABASE_URL=postgresql://user:password@localhost/aurum

# Redis for caching (optional)
REDIS_URL=redis://localhost:6379

# API Keys (optional - for enhanced data)
GOLD_API_KEY=your-gold-api-key
METALS_API_KEY=your-metals-api-key
```

### Price Data Sources
The application uses multiple fallback APIs:
1. **Gold-API.com** - Primary source
2. **Metals-API.com** - Secondary source  
3. **Commodities-API.com** - Tertiary source
4. **Market-based simulation** - Fallback with realistic variations

## 💎 Investment Features

### SIP (Systematic Investment Plan)
- **Flexible Amount**: ₹1,000 to ₹1,00,000+ monthly
- **Duration**: 6 months to 5 years
- **Metal Choice**: Gold only, Silver only, or Both (60:40 ratio)
- **Projections**: Real-time calculations with 10% gold, 15% silver annual growth
- **Tracking**: Monitor accumulated quantities and projected returns

### Single Investment Analysis
- **Investment Range**: ₹10,000 to ₹10,00,000+
- **Metal Selection**: Choose between gold or silver
- **6-Month Projections**: Expected value and returns
- **Break-even Analysis**: Calculate break-even price points
- **Risk Assessment**: Understand investment risks

### Portfolio Management
- **Real-time Tracking**: Live portfolio value updates
- **Profit/Loss Analysis**: Detailed returns calculation
- **Investment History**: Complete transaction history
- **Performance Metrics**: ROI, absolute returns, percentage gains
- **Asset Allocation**: Gold vs Silver distribution

### Platform Comparison
- **25+ Platforms**: Comprehensive coverage of Indian market
- **Making Charges**: Realistic charges (Gold: ₹600-₹1300/g, Silver: ₹50-₹120/g)
- **Total Cost Calculation**: Including GST and all charges
- **Best Deal Identification**: Automatic lowest price detection
- **Platform Types**: Digital (0% making charges) vs Physical platforms

## 🔒 Security & Data

### Authentication
- **Firebase Authentication**: Secure user management
- **Email/Password**: Standard authentication method
- **Session Management**: Secure session handling
- **Protected Routes**: Authentication-required pages

### Data Privacy
- **No Financial Data Storage**: Investment data stored locally/Firebase
- **Real-time Prices**: No historical price data stored permanently
- **User Privacy**: Minimal personal data collection
- **Secure Communication**: HTTPS enforcement

### Price Data Integrity
- **Multiple API Sources**: Redundant data sources for reliability
- **Real-time Validation**: Price reasonableness checks
- **Fallback Systems**: Market-based simulation when APIs fail
- **Cache Management**: 1-minute cache for optimal performance

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npm run build && netlify deploy --prod --dir=.next
```

### Backend Deployment (Optional)
```bash
# Docker deployment
docker build -t aurum-backend ./backend
docker run -p 8000:8000 aurum-backend

# Or direct deployment
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Environment Setup for Production
```env
# Frontend (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Backend (.env)
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-domain.com
```

## 📱 User Experience

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop**: Full-featured desktop interface
- **PWA Ready**: Progressive Web App capabilities

### Key User Flows
1. **New User**: Register → Dashboard → Add Investment → Track Portfolio
2. **Analysis**: Dashboard → Analysis Page → Choose Analysis Type → Get Insights
3. **Comparison**: Compare Page → Filter Platforms → Find Best Deals
4. **Investment**: Dashboard → Investment Form → SIP/Single → Track Returns

### Performance Features
- **Real-time Updates**: Prices update every minute
- **Instant Calculations**: No loading delays for analysis
- **Cached Data**: Optimized API calls with smart caching
- **Error Handling**: Graceful fallbacks for API failures

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/aurum.git
cd aurum
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Follow TypeScript best practices
   - Add proper error handling
   - Update documentation if needed

4. **Test your changes**
```bash
npm run build
npm run type-check
```

5. **Submit a Pull Request**
   - Describe your changes clearly
   - Include screenshots for UI changes
   - Reference any related issues

### Development Guidelines
- **Code Style**: Follow existing TypeScript/React patterns
- **Components**: Create reusable, well-documented components
- **State Management**: Use Context API for global state
- **Error Handling**: Implement proper error boundaries
- **Performance**: Optimize for mobile and slow connections

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Gold Price APIs**: Gold-API.com, Metals-API.com, Commodities-API.com
- **Firebase**: Authentication and real-time database services
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Open Source Community**: All the amazing libraries and tools

## 📞 Support & Contact

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check this README for setup instructions
- **Community**: Join discussions in GitHub Discussions

### Project Status
- ✅ **Production Ready**: Fully functional application
- ✅ **Real-time Data**: Live price updates every minute
- ✅ **25+ Platforms**: Comprehensive platform coverage
- ✅ **Mobile Optimized**: Works perfectly on all devices
- ✅ **Investment Tools**: SIP, single investment, portfolio tracking

### Roadmap
- 🔄 **Enhanced Analytics**: More detailed market analysis
- 🔄 **Price Alerts**: SMS/Email notifications for price changes
- 🔄 **API Integration**: More data sources for better accuracy
- 🔄 **Advanced Charts**: Historical price visualization
- 🔄 **Investment Recommendations**: AI-powered suggestions

---

## ⚠️ Important Disclaimers

**Investment Risk**: 
- Precious metals investments carry market risk
- Past performance doesn't guarantee future results
- Prices can fluctuate significantly
- Always consult financial advisors before investing

**Data Accuracy**:
- Prices are indicative and may vary from actual market rates
- Platform prices are estimates based on available data
- Always verify prices directly with platforms before investing
- Making charges and GST may vary by location and quantity

**Platform Independence**:
- AURUM is not affiliated with any gold/silver platform
- We provide comparison data for informational purposes only
- Users should verify all details independently
- No endorsement of any particular platform is implied

---

**Built with ❤️ for smart precious metals investing**