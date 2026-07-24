# PagePulse

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)]()
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)]()

PagePulse is a modern, premium full-stack website auditing platform designed to parse website metadata, verify response speeds, evaluate heading structures, check image accessibility alt-tags, and output a structured diagnostic report.

Built with a beautiful **SaaS-style React + TypeScript frontend** (inspired by Stripe and Linear) and a **FastAPI backend parser engine** (utilizing HTTPX and BeautifulSoup4).

---

## Features

- **HTTP Status Code Verification**: Assesses the status returned by target crawlers (Healthy 2xx, Redirect 3xx, Client Error 4xx, Server Error 5xx).
- **Response Time Latency**: Measures round-trip webpage loading speeds (Excellent <500ms, Good 500-1000ms, Slow >1000ms).
- **DOM Meta Extraction**: Automatically parses HTML `<title>` tags and meta descriptions, highlighting warning states when empty or missing.
- **H1 Header Audit**: Identifies heading hierarchies (Good H1 usage, Multiple headers, Missing tags).
- **ALT Image Accessibility Audit**: Audits `<img>` tags missing accessibility text (0 Missing, Warning 1-5, Critical >5 missing).
- **SEO Content Depth**: Counts visible content words (Good Content, Average Content, Thin Content).
- **0–100 SEO Health Score**: Aggregates all structural markers into an animated horizontal score indicator (Green 90-100, Amber 70-89, Red 0-69).
- **Priority Fix Cards**: Displays issues in individual warning panels containing warning icons, descriptive notes, and color-coded priority badges.
- **Engineering Notes**: Displays informational Technical observations inside separate info panels.
- **Dark & Light Mode**: Toggles theme seamlessly, saving selection to `localStorage`.
- **Responsive Layout**: Designed with a fluid CSS grid supporting Desktop, Tablet, and Mobile viewport scales.

---

## Screenshots

Below are visual states of the PagePulse workspace:

### 1. Landing Page (Light Mode)
![Landing Page](docs/screenshots/home.png)

### 2. Live Stepper Loader
![Stepper Loader](docs/screenshots/loader.png)

### 3. Analytics Dashboard (Dark Mode)
![Analytics Dashboard](docs/screenshots/dashboard.png)

---

## Tech Stack

### Frontend
- **Framework**: React 18 & Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **HTTP Client**: Axios & Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **HTML Parser**: BeautifulSoup4 & Lxml
- **HTTP Client**: HTTPX AsyncClient
- **Validation**: Pydantic v2
- **Testing**: Pytest & TestClient

### Hosting & Deployment
- **Frontend**: Vercel
- **Backend**: Render

---

## Project Structure

```text
pagepulse/
├── .github/                 # GitHub workflows and template issues
├── backend/                 # FastAPI crawler source code
│   ├── app/
│   │   ├── analyzer.py      # DOM parsing and health audits
│   │   ├── main.py          # App routes and HTTP exceptions
│   │   ├── models.py        # Pydantic schemas and scheme validation
│   │   └── utils.py         # Logger overrides and formatters
│   ├── tests/
│   │   └── test_api.py      # Pytest API validation mock suite
│   ├── requirements.txt     # Python packages
│   └── README.md            # Backend developer setup manual
├── frontend/                # React SPA source code
│   ├── src/
│   │   ├── components/      # UI components (cards, forms, loaders)
│   │   ├── services/        # Axios API handlers
│   │   ├── types/           # Type definitions
│   │   ├── App.tsx          # Dashboard orchestrator
│   │   └── index.css        # Main tailwind imports and custom scrollbars
│   ├── package.json         # Node scripts and dependencies
│   └── tailwind.config.js   # Tailwind custom theme definitions
├── docs/                    # Architecture, API, and deployment documentation
├── LICENSE                  # MIT open-source terms
└── README.md                # Main repository documentation
```

---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/Silentboy07A/Pagepulse.git
cd pagepulse
```

### 2. Configure Environment Variables
Copy the sample env settings to create your local config files:
```bash
cp .env.example .env
```

### 3. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend will start on [http://localhost:8000](http://localhost:8000).

### 4. Frontend Setup
```bash
# Open a new terminal window at the project root
cd frontend

# Install packages
npm install

# Run the Vite dev server
npm run dev
```
Frontend will start on [http://localhost:5173](http://localhost:5173).

---

## API Documentation

### 1. Health Heartbeat
- **URL**: `GET /`
- **Response**:
  ```json
  { "message": "Page Pulse API is running" }
  ```

### 2. Analyze URL
- **URL**: `POST /analyze`
- **Body**:
  ```json
  { "url": "https://example.com" }
  ```
- **Response**:
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
    "priority_fixes": ["Add a meta description"],
    "engineering_notes": ["Low content volume"]
  }
  ```

For detail on HTTP error ranges (408 website timeouts, 503 connection errors, etc.), review the [docs/api.md](docs/api.md) specs.

---

## Testing

### Backend Tests
Execute Python mock tests inside the `backend/` directory:
```bash
venv\Scripts\python -m pytest
```

### Frontend Compilation
Verify TypeScript and Vite bundle compiles correctly inside the `frontend/` directory:
```bash
npm run build
```

---

## Deployment

### Frontend (Vercel)
- Create a Vercel project linking your GitHub repo.
- Configure `Build Command` as `npm run build` and `Output Directory` as `dist`.
- Set Environment Variables: `VITE_API_URL` pointing to your deployed backend URL.

### Backend (Render)
- Deploy a Web Service on Render linking your GitHub repo.
- Environment: `Python 3`. Build command: `pip install -r requirements.txt`.
- Start Command: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000`.

Review the complete [docs/deployment.md](docs/deployment.md) guide for environment variable mappings.

---

## Future Improvements

- **Database Auditing History**: Persist completed scan metrics to MongoDB/PostgreSQL to allow charting visual history over time.
- **Deep Web Crawler**: Recursively follow domain links to audit nested site pages instead of just single landing pages.
- **SEO Keyword Performance**: Integrate keyword analysis comparing content tags to top Google search terms.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

- **Name** - [Silentboy07A](https://github.com/Silentboy07A)
- **LinkedIn** - [Profile](https://linkedin.com/in/silentboy07a)
- **GitHub** - [@Silentboy07A](https://github.com/Silentboy07A)
