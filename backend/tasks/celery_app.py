from celery import Celery
import os

# Initialize Celery
celery_app = Celery(
    "goldsight",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379"),
    include=["tasks.scraping_tasks"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    beat_schedule={
        "scrape-gold-prices": {
            "task": "tasks.scraping_tasks.scrape_all_gold_prices",
            "schedule": 300.0,  # Every 5 minutes
        },
        "calculate-daily-averages": {
            "task": "tasks.scraping_tasks.calculate_daily_averages",
            "schedule": 3600.0,  # Every hour
        },
        "cleanup-old-data": {
            "task": "tasks.scraping_tasks.cleanup_old_data",
            "schedule": 86400.0,  # Daily
        },
    },
)