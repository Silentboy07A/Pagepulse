# API Specification Documentation

This document describes the request/response payloads, parameters, status codes, and exception handlings of the PagePulse API.

---

## Global API Headers
All POST requests require:
- `Content-Type: application/json`

---

## Endpoints

### 1. API Health Check

Verifies that the PagePulse API backend server is operational and responding.

- **Route**: `GET /`
- **Authentication**: None
- **Query Parameters**: None
- **Response Headers**: `Content-Type: application/json`
- **Example Response**:
  ```json
  {
    "message": "Page Pulse API is running"
  }
  ```

---

### 2. Analyze Webpage URL

Crawls a webpage, extracts HTML meta elements, counts DOM properties, and returns a detailed diagnostics report.

- **Route**: `POST /analyze`
- **Authentication**: None
- **Request Body Parameters**:
  | Field | Type | Description | Mandatory | Example |
  | ----- | ---- | ----------- | --------- | ------- |
  | `url` | string (HTTPUrl) | The target HTTP/HTTPS webpage URL to crawl. | Yes | `https://example.com` |

- **Validation Rules**:
  - Must be a syntactically valid URL.
  - Protocol scheme must strictly be `http` or `https` (other schemes like `ftp` or `mailto` will fail).

- **Success Response (HTTP 200)**:
  ```json
  {
    "url": "https://example.com/",
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

## Errors & Exception Handling

If the crawler fails, the API does not expose tracebacks. Instead, it returns standard HTTP error codes:

### 1. Request Validation Failure (HTTP 422)
Occurs when the payload misses the `url` field or supplies an invalid url or unsupported scheme.
- **Example Payload**:
  ```json
  {
    "detail": [
      {
        "loc": ["body", "url"],
        "msg": "URL scheme must be http or https",
        "type": "value_error"
      }
    ]
  }
  ```

### 2. Website Timeout (HTTP 408)
Occurs when the target URL fails to respond within 15 seconds.
- **Example Payload**:
  ```json
  {
    "detail": "Website timed out."
  }
  ```

### 3. Connection Failure (HTTP 503)
Occurs when the target server cannot be reached, DNS resolution fails, or SSL validation errors are encountered.
- **Example Payload**:
  ```json
  {
    "detail": "Unable to connect to website."
  }
  ```

### 4. Unexpected Backend Failure (HTTP 500)
Occurs when a runtime parse crash occurs. Tracebacks are printed to python logs and hidden from the customer.
- **Example Payload**:
  ```json
  {
    "detail": "An unexpected error occurred during analysis."
  }
  ```
