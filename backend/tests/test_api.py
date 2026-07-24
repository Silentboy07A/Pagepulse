from unittest.mock import patch, MagicMock, AsyncMock
import httpx
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_home():
    """
    Test operational backend heartbeat health check endpoint.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Page Pulse API is running"}


@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_analyze_success(mock_get):
    """
    Test successful crawler audit response.
    """
    # Configure mock HTML and attributes
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.text = """
    <html>
      <head>
        <title>SaaS Dashboard Test</title>
        <meta name="description" content="Auditor testing descriptive metadata checks.">
      </head>
      <body>
        <h1>Enterprise Auditor Panel</h1>
        <img src="valid.png" alt="Accurate alt description">
        <img src="invalid_missing.png">
        <p>Paragraph content. We are testing text limits and word counts.</p>
      </body>
    </html>
    """
    mock_get.return_value = mock_resp

    response = client.post("/analyze", json={"url": "https://example.com/"})
    assert response.status_code == 200
    
    data = response.json()
    assert data["url"] == "https://example.com/"
    assert data["status_code"] == 200
    assert data["title"] == "SaaS Dashboard Test"
    assert data["meta_description"] == "Auditor testing descriptive metadata checks."
    assert data["h1_count"] == 1
    assert data["missing_alt_images"] == 1
    assert data["word_count"] > 0
    assert data["health_score"] == 6  # 10 baseline - 2 (missing image alt) - 2 (low content volume)


def test_analyze_invalid_url():
    """
    Test validation failure response for malformed syntax and protocols.
    """
    # Check wrong protocols
    response = client.post("/analyze", json={"url": "ftp://example.com"})
    assert response.status_code == 422
    
    # Check invalid formats
    response = client.post("/analyze", json={"url": "not-a-valid-url"})
    assert response.status_code == 422


@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_analyze_timeout(mock_get):
    """
    Test timeout exception handling returning HTTP 408.
    """
    mock_get.side_effect = httpx.TimeoutException("Audit request read timeout")

    response = client.post("/analyze", json={"url": "https://example.com"})
    assert response.status_code == 408
    assert response.json()["detail"] == "Website timed out."


@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_analyze_connection_error(mock_get):
    """
    Test network resolution/connection error handling returning HTTP 503.
    """
    mock_get.side_effect = httpx.ConnectError("Failed DNS resolution")

    response = client.post("/analyze", json={"url": "https://example.com"})
    assert response.status_code == 503
    assert response.json()["detail"] == "Unable to connect to website."


@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_analyze_unexpected_error(mock_get):
    """
    Test unexpected server crash/runtime handling returning HTTP 500.
    """
    mock_get.side_effect = Exception("General parser system fault")

    response = client.post("/analyze", json={"url": "https://example.com"})
    assert response.status_code == 500
    assert response.json()["detail"] == "An unexpected error occurred during analysis."