# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-24

### Added
- **Initial Release** containing both the React frontend dashboard and FastAPI backend crawler engine.
- **Frontend Dashboard**:
  - Implemented modern SaaS dashboard layout with Indigo/Purple theme.
  - Added count-up animations for numeric metric nodes (`AnimatedNumber.tsx`).
  - Added individual, color-coded priority warning cards for SEO fixes.
  - Added responsive grid structures for desktop, tablet, and mobile layouts.
  - Configured persistent Dark/Light mode theme state.
- **Backend Crawler Engine**:
  - Structured FastAPI routes for health checks (`/`) and site auditing (`/analyze`).
  - Implemented async webpage crawling via `httpx.AsyncClient` with safety timeouts.
  - Added Pydantic schema validation for target URL schemes (`http` and `https` strictly).
  - Cleaned up error responses (408 website timeouts, 503 connection errors, and 500 server errors) to avoid exposing python tracebacks to clients.
  - Configured structured console logging.
  - Added pytest unit tests covering network mock errors.
- **Repository Documentation**:
  - Added detailed architectural maps, API specification guides, and deployment workflows.
  - Added open-source community guidelines, code of conduct, security rules, and contributing policies.
