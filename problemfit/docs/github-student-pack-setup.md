# GitHub Student Developer Pack Setup

ProblemFit works without paid APIs. These optional services are student-friendly upgrades.

## Custom Domains

Use student offers for `.me`, `.tech`, `.dev`, or `.app` domains when available. Point the domain to Vercel, Netlify, GitHub Pages, or the chosen backend host.

## GitHub Pages

Host the frontend demo on GitHub Pages by publishing `problemfit/frontend/dist`. Set `VITE_API_BASE_URL` to a deployed backend before building.

## Render, Heroku, DigitalOcean, or Azure

Deploy the backend with:

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## MongoDB Atlas

Create a free cluster, add a database user, allow your deployment provider IPs, and set `MONGODB_URI` in the backend environment.

## Clerk Authentication

Create a Clerk app with Google and GitHub providers. Add:

- `CLERK_SECRET_KEY` to backend
- `VITE_CLERK_PUBLISHABLE_KEY` to frontend

If keys are missing, ProblemFit stays in demo mode.

## Sentry

Create frontend and backend projects. Add `SENTRY_DSN` and `VITE_SENTRY_DSN` only when you want error tracking.

## BrowserStack Checklist

- Test landing, analyzer, results, and skill profile on mobile widths.
- Confirm intro skip button works.
- Confirm localStorage profile and saved analyses survive reload.
- Confirm backend API errors do not crash the UI.

## IconScout or Similar Assets

Use licensed assets only. Keep decorative assets secondary to the analyzer workflow.

## Future Email Provider

Email reminders can be added later through a provider key in `.env`; do not hard-code credentials.
