import logging
import sys

# Configure clean, structured logs for app crawlers
log_format = "%(asctime)s | %(levelname)-7s | app.%(name)s | %(message)s"

logging.basicConfig(
    level=logging.INFO,
    format=log_format,
    handlers=[
        logging.StreamHandler(sys.stdout)
    ],
    force=True  # Safely override FastAPI/uvicorn standard configurations
)

logger = logging.getLogger("pagepulse")