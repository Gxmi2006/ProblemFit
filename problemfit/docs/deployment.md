# Deployment Guide

## Frontend

ProblemFit frontend can deploy to GitHub Pages, Vercel, or Netlify.

### Vercel or Netlify

1. Set the project root to `problemfit/frontend`.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add `VITE_API_BASE_URL` with the deployed backend URL.

### GitHub Pages

1. Build locally or in GitHub Actions with `npm run build`.
2. Publish `problemfit/frontend/dist`.
3. Configure `VITE_API_BASE_URL` before building.
4. If deploying under a subpath, add a Vite `base` setting for that repository path.

## Backend

The FastAPI backend can deploy to Render, Heroku, DigitalOcean, or Azure.

### Render

1. Create a Web Service from the repository.
2. Root directory: `problemfit/backend`.
3. Build command: `pip install -r requirements.txt`.
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Add environment variables from `.env.example`.

### Heroku

1. Use root `problemfit/backend`.
2. Add a Procfile with `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT` if deploying there directly.
3. Set config vars for MongoDB, Sentry, and allowed frontend origin.

### DigitalOcean or Azure

Use the same install and start commands as Render. Make sure the platform exposes `$PORT` and that `FRONTEND_ORIGIN` matches the frontend domain.

## MongoDB Atlas

Set `MONGODB_URI` and `MONGODB_DB`. If MongoDB is not reachable, the backend falls back to local JSON so demo mode remains usable.

## Sentry

Set `SENTRY_DSN` in the backend. Frontend Sentry is documented in `.env.example` but not required for the first version.
