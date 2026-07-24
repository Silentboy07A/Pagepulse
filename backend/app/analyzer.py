import time
import httpx
from bs4 import BeautifulSoup


async def analyze_page(url: str):
    start = time.perf_counter()

    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        response = await client.get(url)

    response_time = (time.perf_counter() - start) * 1000

    soup = BeautifulSoup(response.text, "lxml")

    title = soup.title.string.strip() if soup.title and soup.title.string else "No title"

    meta = soup.find("meta", attrs={"name": "description"})
    meta_description = (
        meta.get("content", "").strip()
        if meta and meta.get("content")
        else "No meta description"
    )

    h1_count = len(soup.find_all("h1"))

    images = soup.find_all("img")
    missing_alt = sum(1 for img in images if not img.get("alt"))

    words = soup.get_text(separator=" ", strip=True).split()
    word_count = len(words)

    health_score = 10

    fixes = []
    notes = []

    if title == "No title":
        health_score -= 2
        fixes.append("Add a page title")

    if meta_description == "No meta description":
        health_score -= 2
        fixes.append("Add a meta description")

    if h1_count == 0:
        health_score -= 2
        fixes.append("Add at least one H1 heading")

    if missing_alt > 0:
        health_score -= 2
        fixes.append(f"Add alt text to {missing_alt} image(s)")

    if word_count < 300:
        health_score -= 2
        notes.append("Low content volume")

    if not notes:
        notes.append("Page looks healthy")

    return {
        "url": url,
        "status_code": response.status_code,
        "response_time_ms": round(response_time, 2),
        "title": title,
        "meta_description": meta_description,
        "h1_count": h1_count,
        "missing_alt_images": missing_alt,
        "word_count": word_count,
        "health_score": max(0, health_score),
        "priority_fixes": fixes,
        "engineering_notes": notes,
    }