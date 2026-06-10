# Free Public Launch Checklist

Use this checklist after pushing the repository to GitHub.

## 1. Frontend

Recommended free hosts:

- Vercel Hobby
- Cloudflare Pages
- Netlify Free

Settings:

- Root directory: `problemfit/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://api.your-domain.example`

## 2. Backend

Recommended free starter host:

- Render Web Service

Settings:

- Root directory: `problemfit/backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `FRONTEND_ORIGIN=https://your-domain.example`

## 3. Database

Recommended free starter database:

- MongoDB Atlas free/shared cluster

Environment variables:

- `MONGODB_URI`
- `MONGODB_DB=problemfit`

## 4. Domain

After claiming a Student Developer Pack domain:

- Main domain points to the frontend host.
- `api` subdomain points to the backend host.
- Frontend `VITE_API_BASE_URL` uses the `api` subdomain.
- Backend `FRONTEND_ORIGIN` uses the main domain.

## 5. Final Checks

- Open `https://your-domain.example`.
- Open `https://api.your-domain.example/api/health`.
- Analyze a pasted problem from the public frontend.
- Run Accuracy Lab once after deployment.
