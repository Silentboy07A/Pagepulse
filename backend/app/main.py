from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import time
import traceback

from app.models import AnalyzeRequest, AnalyzeResponse
from app.analyzer import analyze_page
from app.utils import logger

app = FastAPI(
    title="PagePulse API",
    description=(
        "Production-grade backend for the PagePulse performance and SEO auditor. "
        "Crawls targets, parses HTML DOM elements, calculates alt-attribute accessibility compliance, and scores health parameters."
    ),
    version="1.0.0",
    openapi_tags=[
        {"name": "General", "description": "Operational health and general backend status check endpoints."},
        {"name": "Analyzer", "description": "Core webpage crawler and SEO/accessibility audit logic endpoints."},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    tags=["General"],
    summary="API Health Check",
    description="Confirms that the PagePulse API backend server is operational."
)
def home():
    """
    Operational status check endpoint returning simple heartbeat indicator.
    """
    logger.info("Health check endpoint accessed.")
    return {"message": "Page Pulse API is running"}


@app.post(
    "/analyze",
    response_model=AnalyzeResponse,
    tags=["Analyzer"],
    summary="Perform Page SEO Audit",
    description="Accepts a target URL, crawls the HTML, evaluates metrics, and returns a detailed diagnostics report."
)
async def analyze(request: AnalyzeRequest):
    """
    Primary analysis router endpoint. Enforces schema validation and handles crawler exceptions safely.
    """
    target_url = str(request.url)
    logger.info(f"Incoming audit request received for URL: {target_url}")
    start_time = time.perf_counter()

    try:
        result = await analyze_page(target_url)
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        logger.info(f"Audit successfully completed for {target_url} in {elapsed_ms:.2f}ms. Target response: {result['status_code']}")
        return result

    except httpx.TimeoutException as exc:
        logger.warning(f"Timeout occurred while attempting to crawl {target_url}: {str(exc)}")
        raise HTTPException(
            status_code=408,
            detail="Website timed out."
        )

    except httpx.ConnectError as exc:
        logger.warning(f"Connection failure or SSL validation error while crawling {target_url}: {str(exc)}")
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to website."
        )

    except httpx.HTTPError as exc:
        logger.warning(f"HTTP client error encountered while crawling {target_url}: {str(exc)}")
        raise HTTPException(
            status_code=500,
            detail="An HTTP error occurred during webpage crawl."
        )

    except Exception as exc:
        # Log complete stack trace internally, return clean error to user
        logger.error(f"Unexpected exception raised during audit for {target_url}: {str(exc)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during analysis."
        )