# Deployment Guide

## Frontend

ProblemFit frontend can deploy to Vercel, Cloudflare Pages, Netlify, or GitHub Pages.

### Recommended Free Frontend: Vercel

1. Set the project root to `problemfit/frontend`.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add `VITE_API_BASE_URL` with the deployed backend URL, for example `https://api.problemfit.example`.

### Cloudflare Pages or Netlify

Use the same frontend settings:

- Project root: `problemfit/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL`

### GitHub Pages

1. Build locally or in GitHub Actions with `npm run build`.
2. Publish `problemfit/frontend/dist`.
3. Configure `VITE_API_BASE_URL` before building.
4. If deploying under a subpath, add a Vite `base` setting for that repository path.

## Backend

The recommended free starter backend is Render. The FastAPI service can also run on any Python web host that exposes a `$PORT` environment variable.

### Render

1. Create a Web Service from the repository.
2. Root directory: `problemfit/backend`.
3. Build command: `pip install -r requirements.txt`.
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Add environment variables from `.env.example`.
6. Set `FRONTEND_ORIGIN` to the deployed frontend URL, for example `https://problemfit.example`.

### Other Python Hosts

Use the same install and start commands as Render. Make sure the platform exposes `$PORT` and that `FRONTEND_ORIGIN` matches the frontend domain.

## MongoDB Atlas

Set `MONGODB_URI` and `MONGODB_DB`. If MongoDB is not reachable, the backend falls back to local JSON so demo mode remains usable.

## Recommended Free Public Setup

- Frontend: Vercel Hobby
- Backend: Render free web service
- Database: MongoDB Atlas free/shared cluster
- Domain: GitHub Student Developer Pack domain

## Student Pack Domain

Claim a domain from a GitHub Student Developer Pack provider first. Then:

- Point the main domain to the frontend host.
- Point `api.<domain>` to the backend host.
- Set `VITE_API_BASE_URL=https://api.<domain>` in the frontend host.
- Set `FRONTEND_ORIGIN=https://<domain>` in the backend host.

Use `problemfit/frontend/public/CNAME.example` as the template if you publish with GitHub Pages.

## Sentry

Set `SENTRY_DSN` in the backend. Frontend Sentry is documented in `.env.example` but not required for the first version.
