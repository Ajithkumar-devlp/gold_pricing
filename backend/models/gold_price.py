from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GoldPrice(BaseModel):
    platform: str
    type: str  # "physical" or "digital"
    price_per_gram: float
    making_charges: float = 0.0
    gst: float = 3.0  # GST percentage
    features: List[str] = []
    timestamp: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class GoldPriceResponse(BaseModel):
    platform: str
    type: str
    price_per_gram: float
    making_charges: float
    gst: float
    total_price_per_gram: float
    features: List[str]
    timestamp: str
    
    @classmethod
    def from_gold_price(cls, gold_price: GoldPrice):
        total_price = gold_price.price_per_gram + gold_price.making_charges
        total_price_with_gst = total_price * (1 + gold_price.gst / 100)
        
        return cls(
            platform=gold_price.platform,
            type=gold_price.type,
            price_per_gram=gold_price.price_per_gram,
            making_charges=gold_price.making_charges,
            gst=gold_price.gst,
            total_price_per_gram=total_price_with_gst,
            features=gold_price.features,
            timestamp=gold_price.timestamp.isoformat()
        )

class HistoricalPrice(BaseModel):
    date: str
    price: float
    change: float
    change_percentage: float

class ProfitAnalysis(BaseModel):
    investment_amount: float
    investment_date: str
    current_value: float
    profit_loss: float
    profit_percentage: float
    gold_quantity_grams: float
    investment_price_per_gram: float
    current_price_per_gram: float
    duration_days: int

class ComparisonResult(BaseModel):
    platform: str
    type: str
    price_per_gram: float
    making_charges: float
    gst: float
    total_cost: float
    features: List[str]
    rank: int
    savings_vs_highest: float

class MarketInsight(BaseModel):
    title: str
    description: str
    impact: str  # "positive", "negative", "neutral"
    confidence: float  # 0.0 to 1.0

class Recommendation(BaseModel):
    platform: str
    reason: str
    price: float
    type: str
    confidence_score: float
    pros: List[str]
    cons: List[str]