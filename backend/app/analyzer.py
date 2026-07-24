import time
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any, List

# Named constants to replace magic numbers
INITIAL_HEALTH_SCORE = 10
SCORE_DEDUCTION = 2
WORD_COUNT_THRESHOLD = 300
CLIENT_TIMEOUT_SECS = 15
USER_AGENT = "PagePulse-Auditor/1.0.0"


async def analyze_page(url: str) -> Dict[str, Any]:
    """
    Crawls the target URL and performs SEO, performance, and accessibility checks.

    Args:
        url: The webpage target HTTP/HTTPS URL.

    Returns:
        A dictionary containing status codes, response time, and audit results.
    """
    start_time = time.perf_counter()

    headers = {"User-Agent": USER_AGENT}
    async with httpx.AsyncClient(timeout=CLIENT_TIMEOUT_SECS, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    # Parse and extract metrics from HTML DOM
    metrics = _parse_html_metrics(response.text)

    # Calculate audit checks and scores
    audit_results = _run_audits(metrics)

    return {
        "url": url,
        "status_code": response.status_code,
        "response_time_ms": round(elapsed_ms, 2),
        **metrics,
        **audit_results,
    }


def _parse_html_metrics(html_content: str) -> Dict[str, Any]:
    """
    Extracts relevant tags, headings, and images from HTML using BeautifulSoup.

    Args:
        html_content: The HTML text of the page.

    Returns:
        A dict containing parsed title, meta description, and tag counts.
    """
    soup = BeautifulSoup(html_content, "lxml")

    # Extract title
    title = soup.title.string.strip() if soup.title and soup.title.string else "No title"

    # Extract meta description
    meta = soup.find("meta", attrs={"name": "description"})
    meta_description = (
        meta.get("content", "").strip()
        if meta and meta.get("content")
        else "No meta description"
    )

    # Extract heading and image counts
    h1_count = len(soup.find_all("h1"))
    images = soup.find_all("img")
    missing_alt_images = sum(1 for img in images if not img.get("alt"))

    # Estimate word count
    words = soup.get_text(separator=" ", strip=True).split()
    word_count = len(words)

    return {
        "title": title,
        "meta_description": meta_description,
        "h1_count": h1_count,
        "missing_alt_images": missing_alt_images,
        "word_count": word_count,
    }


def _run_audits(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates the health score and compiles lists of suggested fixes and notes.

    Scoring details:
    - Initial baseline health score starts at 10.
    - Subtracts 2 points for missing Title, missing Meta description, zero H1 headings,
      and any missing image alt tags.
    - Deducts 2 points if the word count falls below 300 words.
    - The final health score is bounded to a minimum of 0.

    Args:
        metrics: The parsed DOM metric details.

    Returns:
        A dict containing health_score, priority_fixes, and engineering_notes.
    """
    health_score = INITIAL_HEALTH_SCORE
    priority_fixes: List[str] = []
    engineering_notes: List[str] = []

    # Title check
    if metrics["title"] == "No title":
        health_score -= SCORE_DEDUCTION
        priority_fixes.append("Add a page title")

    # Meta description check
    if metrics["meta_description"] == "No meta description":
        health_score -= SCORE_DEDUCTION
        priority_fixes.append("Add a meta description")

    # Heading check
    if metrics["h1_count"] == 0:
        health_score -= SCORE_DEDUCTION
        priority_fixes.append("Add at least one H1 heading")

    # Image alt checks
    missing_alt = metrics["missing_alt_images"]
    if missing_alt > 0:
        health_score -= SCORE_DEDUCTION
        priority_fixes.append(f"Add alt text to {missing_alt} image(s)")

    # Content length check
    if metrics["word_count"] < WORD_COUNT_THRESHOLD:
        health_score -= SCORE_DEDUCTION
        engineering_notes.append("Low content volume")

    if not engineering_notes:
        engineering_notes.append("Page looks healthy")

    return {
        "health_score": max(0, health_score),
        "priority_fixes": priority_fixes,
        "engineering_notes": engineering_notes,
    }