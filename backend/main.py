from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
from datetime import datetime, timedelta
import json

from scrapers.gold_scraper import GoldScraper
from models.gold_price import GoldPrice, GoldPriceResponse
from database.db import get_db_connection
from utils.calculations import calculate_profit, calculate_best_deal

app = FastAPI(title="AURUM API", version="1.0.0", description="Intelligent Gold Rate Analysis & Buying Guide API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://aurum.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scraper
scraper = GoldScraper()

class ComparisonRequest(BaseModel):
    gold_type: str = "both"  # physical, digital, both
    weight: float = 10.0

class ProfitAnalysisRequest(BaseModel):
    investment_amount: float
    investment_date: str
    gold_type: str = "both"
    duration_days: int = 365

@app.get("/")
async def root():
    return {"message": "AURUM API - Intelligent Gold Rate Analysis & Buying Guide"}

@app.get("/api/gold-prices", response_model=List[GoldPriceResponse])
async def get_gold_prices(gold_type: str = "both", fresh: bool = False):
    """
    Get current gold prices from multiple platforms
    """
    try:
        if fresh:
            # Scrape fresh data
            prices = await scraper.scrape_all_platforms()
        else:
            # Get cached data from database
            prices = await get_cached_prices()
            
        if gold_type != "both":
            prices = [p for p in prices if p.type == gold_type]
            
        return prices
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching gold prices: {str(e)}")

@app.post("/api/compare")
async def compare_gold_prices(request: ComparisonRequest):
    """
    Compare gold prices and find the best deal
    """
    try:
        prices = await get_gold_prices(request.gold_type)
        
        comparison_data = []
        for price in prices:
            total_cost = calculate_total_cost(price, request.weight)
            comparison_data.append({
                "platform": price.platform,
                "type": price.type,
                "price_per_gram": price.price_per_gram,
                "making_charges": price.making_charges,
                "gst": price.gst,
                "total_cost": total_cost,
                "features": price.features
            })
        
        # Sort by total cost
        comparison_data.sort(key=lambda x: x["total_cost"])
        
        best_deal = comparison_data[0] if comparison_data else None
        
        return {
            "comparison": comparison_data,
            "best_deal": best_deal,
            "weight": request.weight,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing prices: {str(e)}")

@app.get("/api/historical-data")
async def get_historical_data(period: str = "1y"):
    """
    Get historical gold price data
    """
    try:
        # Map period to days
        period_days = {
            "30d": 30,
            "6m": 180,
            "1y": 365,
            "5y": 1825
        }
        
        days = period_days.get(period, 365)
        
        # In real implementation, fetch from database
        historical_data = await get_historical_prices(days)
        
        return {
            "data": historical_data,
            "period": period,
            "total_points": len(historical_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")

@app.post("/api/profit-analysis")
async def analyze_profit(request: ProfitAnalysisRequest):
    """
    Calculate profit analysis based on investment parameters
    """
    try:
        # Get historical price for investment date
        investment_price = await get_price_for_date(request.investment_date)
        current_price = await get_current_average_price()
        
        # Calculate profit
        profit_data = calculate_profit(
            investment_amount=request.investment_amount,
            investment_price=investment_price,
            current_price=current_price,
            duration_days=request.duration_days
        )
        
        return profit_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing profit: {str(e)}")

@app.get("/api/recommendations")
async def get_recommendations(investment_goal: str = "long_term"):
    """
    Get AI-powered investment recommendations
    """
    try:
        current_prices = await get_gold_prices()
        
        recommendations = {
            "best_for_beginners": find_best_for_beginners(current_prices),
            "best_for_long_term": find_best_for_long_term(current_prices),
            "best_for_liquidity": find_best_for_liquidity(current_prices),
            "market_insights": generate_market_insights(),
            "tips": [
                "Consider SIP (Systematic Investment Plan) for regular gold investment",
                "Digital gold offers better liquidity compared to physical gold",
                "Physical gold is better for long-term wealth preservation",
                "Monitor gold prices during festival seasons for better deals"
            ]
        }
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

# Helper functions
def calculate_total_cost(price: GoldPrice, weight: float) -> float:
    """Calculate total cost including all charges"""
    base_cost = price.price_per_gram * weight
    making_cost = price.making_charges * weight
    gst_amount = (base_cost + making_cost) * (price.gst / 100)
    return base_cost + making_cost + gst_amount

async def get_cached_prices() -> List[GoldPrice]:
    """Get cached prices from database"""
    # Mock data for now - in real implementation, query database
    return [
        # Digital Gold Platforms
        GoldPrice(
            platform="MMTC-PAMP Gold",
            type="digital",
            price_per_gram=6695.0,
            making_charges=0.0,
            gst=3.0,
            features=["Government backed", "999.9 purity", "Swiss technology"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="SafeGold",
            type="digital",
            price_per_gram=6700.0,
            making_charges=0.0,
            gst=3.0,
            features=["MMTC-PAMP partnership", "Blockchain secured", "Instant liquidity"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Amazon Pay Gold",
            type="digital",
            price_per_gram=6705.0,
            making_charges=0.0,
            gst=3.0,
            features=["Amazon ecosystem", "Easy redemption", "Secure storage"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Google Pay Gold",
            type="digital",
            price_per_gram=6710.0,
            making_charges=0.0,
            gst=3.0,
            features=["Secure storage", "Easy redemption", "Real-time prices"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Jar App Gold",
            type="digital",
            price_per_gram=6714.0,
            making_charges=0.0,
            gst=3.0,
            features=["Round-up savings", "Auto-invest", "Goal-based saving"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="PhonePe Gold",
            type="digital",
            price_per_gram=6715.0,
            making_charges=0.0,
            gst=3.0,
            features=["24/7 trading", "No minimum amount", "Digital certificate"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="MobiKwik Gold",
            type="digital",
            price_per_gram=6718.0,
            making_charges=0.0,
            gst=3.0,
            features=["Wallet integration", "Instant purchase", "24/7 trading"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Paytm Gold",
            type="digital",
            price_per_gram=6720.0,
            making_charges=0.0,
            gst=3.0,
            features=["No storage cost", "Instant liquidity", "SIP available"],
            timestamp=datetime.now()
        ),
        # Physical Gold Platforms
        GoldPrice(
            platform="Kalyan Jewellers",
            type="physical",
            price_per_gram=6750.0,
            making_charges=450.0,
            gst=3.0,
            features=["BIS hallmark", "Exchange policy", "Store pickup"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Malabar Gold",
            type="physical",
            price_per_gram=6760.0,
            making_charges=480.0,
            gst=3.0,
            features=["International presence", "Designer jewelry", "Exchange policy"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Joyalukkas",
            type="physical",
            price_per_gram=6765.0,
            making_charges=470.0,
            gst=3.0,
            features=["Global brand", "Traditional designs", "Buyback policy"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="SBI Gold",
            type="physical",
            price_per_gram=6775.0,
            making_charges=380.0,
            gst=3.0,
            features=["Government bank", "Trusted brand", "Pan-India presence"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="HDFC Bank Gold",
            type="physical",
            price_per_gram=6780.0,
            making_charges=400.0,
            gst=3.0,
            features=["Bank guarantee", "Locker facility", "Insurance covered"],
            timestamp=datetime.now()
        ),
        GoldPrice(
            platform="Tanishq",
            type="physical",
            price_per_gram=6800.0,
            making_charges=500.0,
            gst=3.0,
            features=["Certified purity", "Buyback guarantee", "Physical delivery"],
            timestamp=datetime.now()
        )
    ]

async def get_historical_prices(days: int) -> List[dict]:
    """Get historical price data"""
    # Mock historical data
    data = []
    base_price = 6500
    
    for i in range(days):
        date = datetime.now() - timedelta(days=days-i)
        price = base_price + (i * 0.5) + ((-1)**i * 50)  # Simulate fluctuation
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": round(price, 2),
            "change": round(price - base_price, 2)
        })
    
    return data

async def get_price_for_date(date_str: str) -> float:
    """Get gold price for specific date"""
    # Mock implementation
    return 6200.0

async def get_current_average_price() -> float:
    """Get current average gold price"""
    prices = await get_cached_prices()
    return sum(p.price_per_gram for p in prices) / len(prices)

def find_best_for_beginners(prices: List[GoldPrice]) -> dict:
    """Find best platform for beginners"""
    digital_prices = [p for p in prices if p.type == "digital"]
    if digital_prices:
        best = min(digital_prices, key=lambda x: x.price_per_gram)
        return {
            "platform": best.platform,
            "reason": "Low entry barrier and easy to start",
            "price": best.price_per_gram
        }
    return {}

def find_best_for_long_term(prices: List[GoldPrice]) -> dict:
    """Find best platform for long-term investment"""
    physical_prices = [p for p in prices if p.type == "physical"]
    if physical_prices:
        best = min(physical_prices, key=lambda x: x.price_per_gram + x.making_charges)
        return {
            "platform": best.platform,
            "reason": "Better for wealth preservation",
            "price": best.price_per_gram
        }
    return {}

def find_best_for_liquidity(prices: List[GoldPrice]) -> dict:
    """Find best platform for liquidity"""
    digital_prices = [p for p in prices if p.type == "digital"]
    if digital_prices:
        best = min(digital_prices, key=lambda x: x.price_per_gram)
        return {
            "platform": best.platform,
            "reason": "Instant buying/selling capability",
            "price": best.price_per_gram
        }
    return {}

def generate_market_insights() -> List[str]:
    """Generate market insights"""
    return [
        "Gold prices are showing an upward trend this month",
        "Digital gold platforms are offering competitive rates",
        "Physical gold demand is high during wedding season",
        "Consider dollar-cost averaging for regular investments"
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)