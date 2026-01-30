import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/goldsight")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class GoldPriceDB(Base):
    __tablename__ = "gold_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True)
    type = Column(String)  # physical or digital
    price_per_gram = Column(Float)
    making_charges = Column(Float, default=0.0)
    gst = Column(Float, default=3.0)
    features = Column(Text)  # JSON string
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class HistoricalPriceDB(Base):
    __tablename__ = "historical_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    average_price = Column(Float)
    highest_price = Column(Float)
    lowest_price = Column(Float)
    volume = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserPreferenceDB(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    preferred_type = Column(String)  # physical, digital, both
    preferred_weight = Column(Float, default=10.0)
    investment_goal = Column(String)  # long_term, short_term, liquidity
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Database functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_connection():
    return SessionLocal()

def save_gold_price(db, gold_price_data):
    """Save gold price to database"""
    db_price = GoldPriceDB(
        platform=gold_price_data.platform,
        type=gold_price_data.type,
        price_per_gram=gold_price_data.price_per_gram,
        making_charges=gold_price_data.making_charges,
        gst=gold_price_data.gst,
        features=json.dumps(gold_price_data.features),
        timestamp=gold_price_data.timestamp
    )
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price

def get_latest_prices(db, gold_type="both", limit=10):
    """Get latest gold prices from database"""
    query = db.query(GoldPriceDB).filter(GoldPriceDB.is_active == True)
    
    if gold_type != "both":
        query = query.filter(GoldPriceDB.type == gold_type)
    
    return query.order_by(GoldPriceDB.timestamp.desc()).limit(limit).all()

def save_historical_price(db, date, avg_price, high_price, low_price):
    """Save historical price data"""
    db_historical = HistoricalPriceDB(
        date=date,
        average_price=avg_price,
        highest_price=high_price,
        lowest_price=low_price
    )
    db.add(db_historical)
    db.commit()
    return db_historical

def get_historical_prices(db, days=365):
    """Get historical price data"""
    return db.query(HistoricalPriceDB).order_by(
        HistoricalPriceDB.date.desc()
    ).limit(days).all()

def save_user_preference(db, session_id, preferences):
    """Save user preferences"""
    # Check if preference exists
    existing = db.query(UserPreferenceDB).filter(
        UserPreferenceDB.session_id == session_id
    ).first()
    
    if existing:
        # Update existing
        existing.preferred_type = preferences.get("preferred_type", existing.preferred_type)
        existing.preferred_weight = preferences.get("preferred_weight", existing.preferred_weight)
        existing.investment_goal = preferences.get("investment_goal", existing.investment_goal)
        existing.updated_at = datetime.utcnow()
        db.commit()
        return existing
    else:
        # Create new
        db_preference = UserPreferenceDB(
            session_id=session_id,
            preferred_type=preferences.get("preferred_type", "both"),
            preferred_weight=preferences.get("preferred_weight", 10.0),
            investment_goal=preferences.get("investment_goal", "balanced")
        )
        db.add(db_preference)
        db.commit()
        return db_preference

def get_user_preferences(db, session_id):
    """Get user preferences"""
    return db.query(UserPreferenceDB).filter(
        UserPreferenceDB.session_id == session_id
    ).first()

# Data aggregation functions
def calculate_daily_averages(db, date):
    """Calculate daily price averages"""
    prices = db.query(GoldPriceDB).filter(
        GoldPriceDB.timestamp.like(f"{date}%")
    ).all()
    
    if not prices:
        return None
    
    price_values = [p.price_per_gram for p in prices]
    return {
        "date": date,
        "average": sum(price_values) / len(price_values),
        "highest": max(price_values),
        "lowest": min(price_values),
        "count": len(price_values)
    }

def cleanup_old_prices(db, days_to_keep=30):
    """Clean up old price data to manage database size"""
    cutoff_date = datetime.utcnow() - timedelta(days=days_to_keep)
    
    deleted_count = db.query(GoldPriceDB).filter(
        GoldPriceDB.timestamp < cutoff_date
    ).delete()
    
    db.commit()
    return deleted_count