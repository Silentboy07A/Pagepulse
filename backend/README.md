# PagePulse API - Backend Engine

The backend for PagePulse is a high-performance, asynchronous web crawler and auditor built with FastAPI, HTTPX, and BeautifulSoup. It analyzes target URLs to evaluate SEO, performance, and accessibility metrics.

---

## Features

- **Heartbeat Check**: Simple, lightweight operational status checks.
- **Asynchronous Crawl Engine**: Non-blocking network requests using `httpx.AsyncClient` with custom timeouts.
- **DOM Parsing**: Extracts metadata, page titles, H1 structures, alt attributes, and word counts.
- **Strict URL Scheme Validation**: Enforces `http` and `https` protocols using Pydantic validators.
- **Sanitized Errors**: Catches network failures, timeouts, and SSL discrepancies to return clean HTTP status codes (408, 503, 500) without exposing tracebacks.
- **Structured Log Output**: Provides request tracking, processed latency logs, and warning details.
- **Comprehensive Mocks**: Modular test coverage for timeout, network error, and validation cases.

---

## Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── analyzer.py   # Web crawling and SEO diagnostic rules
│   ├── main.py       # FastAPI application and route definitions
│   ├── models.py     # Pydantic schemas and URL validators
│   └── utils.py      # Logger setups and basic configurations
├── tests/
│   └── test_api.py   # Pytest suite with AsyncMock cases
├── requirements.txt  # Project library dependencies
└── README.md         # Production documentation
```

---

## Installation & Setup

Ensure Python 3.10+ is installed on your machine.

### 1. Create and Activate Virtual Environment
```bash
# Navigate to the backend directory
cd backend

# Create the virtual environment
python -m venv venv

# Activate on Windows (Command Prompt)
venv\Scripts\activate
# Activate on Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# Activate on macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## Running Locally

To start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
The server will start running at [http://localhost:8000](http://localhost:8000).

- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Redoc Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /`
- **Response**:
  ```json
  {
    "message": "Page Pulse API is running"
  }
  ```

### 2. Analyze Page
- **Endpoint**: `POST /analyze`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response Body**:
  ```json
  {
    "url": "https://example.com",
    "status_code": 200,
    "response_time_ms": 245.67,
    "title": "Example Domain",
    "meta_description": "No meta description",
    "h1_count": 1,
    "missing_alt_images": 0,
    "word_count": 21,
    "health_score": 8,
    "priority_fixes": [
      "Add a meta description"
    ],
    "engineering_notes": [
      "Low content volume"
    ]
  }
  ```

---

## Testing

The backend test suite is powered by `pytest` and mocks out external network requests.

To execute the tests:
```bash
pytest
```
*Tip: Ensure your virtual environment is active before running tests.*

---

## Deployment

For production deployments, it is recommended to run the app using `gunicorn` with `uvicorn` workers:
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
Additionally, ensure to set logging levels to `INFO` or `WARNING` in production environments.
