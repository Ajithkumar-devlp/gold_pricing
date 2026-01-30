from celery import Celery
from datetime import datetime, timedelta
import asyncio
import logging

from scrapers.gold_scraper import GoldScraper
from database.db import get_db_connection, save_gold_price, save_historical_price, cleanup_old_prices
from tasks.celery_app import celery_app

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@celery_app.task
def scrape_all_gold_prices():
    """
    Periodic task to scrape gold prices from all platforms
    """
    try:
        logger.info("Starting gold price scraping task")
        
        # Run async scraping in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def run_scraping():
            async with GoldScraper() as scraper:
                prices = await scraper.scrape_all_platforms()
                return prices
        
        prices = loop.run_until_complete(run_scraping())
        loop.close()
        
        # Save to database
        db = get_db_connection()
        saved_count = 0
        
        for price in prices:
            try:
                save_gold_price(db, price)
                saved_count += 1
            except Exception as e:
                logger.error(f"Error saving price for {price.platform}: {e}")
        
        db.close()
        
        logger.info(f"Successfully scraped and saved {saved_count} gold prices")
        return {"status": "success", "prices_saved": saved_count}
        
    except Exception as e:
        logger.error(f"Error in scraping task: {e}")
        return {"status": "error", "message": str(e)}

@celery_app.task
def calculate_daily_averages():
    """
    Calculate and store daily price averages
    """
    try:
        logger.info("Calculating daily averages")
        
        db = get_db_connection()
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Get today's prices
        from database.db import calculate_daily_averages as calc_avg
        avg_data = calc_avg(db, today)
        
        if avg_data:
            save_historical_price(
                db,
                avg_data["date"],
                avg_data["average"],
                avg_data["highest"],
                avg_data["lowest"]
            )
            logger.info(f"Saved daily average for {today}: ₹{avg_data['average']:.2f}")
        
        db.close()
        return {"status": "success", "date": today}
        
    except Exception as e:
        logger.error(f"Error calculating daily averages: {e}")
        return {"status": "error", "message": str(e)}

@celery_app.task
def cleanup_old_data():
    """
    Clean up old price data to manage database size
    """
    try:
        logger.info("Starting data cleanup task")
        
        db = get_db_connection()
        deleted_count = cleanup_old_prices(db, days_to_keep=30)
        db.close()
        
        logger.info(f"Cleaned up {deleted_count} old price records")
        return {"status": "success", "deleted_count": deleted_count}
        
    except Exception as e:
        logger.error(f"Error in cleanup task: {e}")
        return {"status": "error", "message": str(e)}

@celery_app.task
def send_price_alerts():
    """
    Send price alerts to users (future feature)
    """
    try:
        logger.info("Checking for price alerts")
        
        # This would check user alert preferences and send notifications
        # For now, just log that the task ran
        
        return {"status": "success", "alerts_sent": 0}
        
    except Exception as e:
        logger.error(f"Error sending price alerts: {e}")
        return {"status": "error", "message": str(e)}

@celery_app.task
def generate_market_insights():
    """
    Generate AI-powered market insights (future feature)
    """
    try:
        logger.info("Generating market insights")
        
        # This would analyze price trends and generate insights
        # For now, just log that the task ran
        
        insights = [
            "Gold prices showing upward trend this week",
            "Digital gold platforms offering competitive rates",
            "Physical gold demand increasing due to festival season"
        ]
        
        return {"status": "success", "insights": insights}
        
    except Exception as e:
        logger.error(f"Error generating insights: {e}")
        return {"status": "error", "message": str(e)}