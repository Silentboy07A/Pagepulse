# Deployment Guide

This document describes how to deploy the PagePulse full-stack application to production environments.

We will host the **React Frontend on Vercel** and the **FastAPI Backend on Render**.

---

## 1. Environment Variable Setup

Ensure you create corresponding environment variables in your hosting provider's dashboard.

### Frontend Env Variable
- **VITE_API_URL**: The root URL of the deployed backend server.
  - Ex: `https://pagepulse-api.onrender.com` (do not add a trailing slash).

### Backend Env Variable
- **PORT**: The port the backend will bind to (Render automatically sets this, typically `10000`).
- **HOST**: Set to `0.0.0.0` in production to bind to all interfaces.

---

## 2. Deploying FastAPI Backend (Render)

Render is well-suited for hosting Python FastAPI applications.

1. **Sign In**: Log into [Render](https://render.com) and click **New > Web Service**.
2. **Link GitHub**: Link your repository containing the PagePulse source code.
3. **Configure Service**:
   - **Name**: `pagepulse-api`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend` (this ensures Render looks inside the backend subfolder)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:10000`
4. **Environment Variables**: Add your production variables (if any, like custom database tokens or `LOG_LEVEL=WARNING`).
5. **CORS Handling**: PagePulse allows all origins (`*`) by default, allowing Render backends to accept cross-origin requests from Vercel frontends.

---

## 3. Deploying React Frontend (Vercel)

Vercel is optimized for static React and Vite builds.

1. **Sign In**: Log into [Vercel](https://vercel.com) and click **Add New > Project**.
2. **Link GitHub**: Import your PagePulse repository.
3. **Configure Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (crucial so Vercel builds the React workspace)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**: Add the `VITE_API_URL` variable pointing to your Render Web Service URL.
5. **Deploy**: Click **Deploy**. Vercel will install dependencies, compile the Vite app, and provide a public deployment URL (e.g., `https://pagepulse.vercel.app`).
