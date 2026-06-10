# ProblemFit

ProblemFit is a premium full-stack learning platform for beginner and intermediate programmers. It answers a practical question before a learner burns an hour guessing:

> Is this coding problem actually within what I currently know?

ProblemFit analyzes the concepts behind a coding problem, compares them with the learner's known skills, and returns a readiness score, missing topics, confidence level, detector evidence, easier practice problems, and a learning path.

The app does not scrape or copy protected problem statements. Users paste their own statements, and the demo database contains **260 original educational problems**.

## Highlights

- Multi-layer topic detection with rule evidence, TF-IDF-style similarity, optional AI interface, and voting.
- Readiness scoring against a learner skill profile.
- Accuracy Lab that calculates real precision, recall, F1, exact match, misses, and false positives.
- Built-in original problem database with Beginner, Easy, Medium, and Hard coverage.
- Demo mode that works without Clerk, MongoDB, Sentry, or paid AI APIs.
- Polished React UI with animated intro, dashboard, skill roadmap, saved analyses, and responsive pages.

## Screens

- Landing page with animated readiness preview.
- Skill Profile page for selecting known topics.
- Problem Analyzer page for pasted problem statements.
- Analysis Result page with readiness meter, evidence, missing topics, and recommendations.
- Built-in Problems page with 260 original problems and pagination.
- Accuracy Lab page with computed analyzer metrics.
- Learning Path, Dashboard, Saved Problems, About, and Settings pages.

## Architecture

```text
User problem text
  -> rule-based detector
  -> similarity detector over original tagged examples
  -> optional structured AI classifier interface
  -> voting and confidence engine
  -> readiness scorer
  -> learning path and easier problem recommendations
```

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Recharts
- Backend: FastAPI, Pydantic, Python, TF-IDF similarity with scikit-learn when installed, deterministic fallback otherwise
- Optional services: MongoDB Atlas, Clerk, Sentry, optional AI classifier adapter
- Demo mode: localStorage in the frontend and local JSON fallback in the backend

## Project Structure

```text
problemfit/
  frontend/
  backend/
  docs/
  README.md
```

## Quick Start

Run the backend and frontend in separate terminals.

### Backend

```bash
cd problemfit/backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs open at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd problemfit/frontend
npm install
npm run dev
```

The app opens at `http://127.0.0.1:5174`.

If those ports are already occupied, use alternate ports:

```bash
# Backend
cd problemfit/backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

# Frontend
cd problemfit/frontend
$env:VITE_API_BASE_URL="http://127.0.0.1:8001"
npm run dev -- --host 127.0.0.1 --port 5175
```

## Environment Variables

Copy `.env.example` files in `frontend` and `backend` before deployment. All integrations are optional.

Backend:

- `MONGODB_URI`: enables MongoDB Atlas storage
- `CLERK_SECRET_KEY`: indicates auth is configured
- `SENTRY_DSN`: enables backend error tracking
- `AI_CLASSIFIER_PROVIDER` and `AI_CLASSIFIER_API_KEY`: reserved for a future structured AI classifier adapter

Frontend:

- `VITE_API_BASE_URL`: backend API origin
- `VITE_CLERK_PUBLISHABLE_KEY`: optional Clerk frontend key
- `VITE_SENTRY_DSN`: optional frontend Sentry key

## Analyzer Output

`POST /api/analyze`

```json
{
  "problem_text": "Given an array and a target sum, decide whether two numbers form the target.",
  "known_topics": ["arrays", "loops"],
  "language": "Python"
}
```

The response includes:

- Required topics and confidence.
- Possible hidden topics.
- Missing topics and prerequisite gaps.
- Readiness score and verdict.
- Detector evidence and similar tagged examples.
- Learning path and recommended easier problems.

## API Endpoints

- `GET /api/health`
- `GET /api/topics`
- `GET /api/problems`
- `GET /api/problems/{id}`
- `POST /api/profile`
- `GET /api/profile/{user_id}`
- `POST /api/analyze`
- `POST /api/save-analysis`
- `GET /api/saved-analyses/{user_id}`
- `GET /api/learning-path/{user_id}`
- `GET /api/evaluate-analyzer`

## Accuracy Lab

The Accuracy Lab runs the analyzer against the 260 original labeled problems and computes metrics at runtime. Metrics are not hard-coded.

Current local evaluation after the 260-problem expansion:

- Precision: `0.884`
- Recall: `1.0`
- F1: `0.93`
- Exact match: `0.635`

## Tests

```bash
cd problemfit/backend
python -m pytest -q
```

## Deployment

Frontend deployment works on Vercel, Netlify, or GitHub Pages. Backend deployment works on Render, Heroku, DigitalOcean, or Azure.

See:

- [Deployment guide](docs/deployment.md)
- [GitHub Student Developer Pack setup](docs/github-student-pack-setup.md)
- [Custom domain setup](docs/custom-domain-setup.md)
- [Accuracy methodology](docs/accuracy-methodology.md)

## Custom Domain

After you claim a free Student Developer Pack domain, set it in your host dashboard and DNS provider. For GitHub Pages, copy `frontend/public/CNAME.example` to `frontend/public/CNAME` and replace the placeholder with your domain.

Example:

```text
learnproblemfit.example
```

Do not commit secrets or provider API keys. DNS records must be configured in the domain provider account.

## Code Quality Notes

ProblemFit is intentionally honest about uncertainty. Topic detection combines rule evidence, similarity evidence, optional AI output when configured, and a voting engine. The Accuracy Lab calculates real metrics from the built-in labeled problems.

## License

This first version is provided for educational/demo use. Add a license file before publishing publicly if you want others to reuse or modify it.
