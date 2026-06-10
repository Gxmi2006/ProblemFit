# ProblemFit

ProblemFit is a premium full-stack learning platform for beginner and intermediate programmers. It answers a practical question before a learner burns an hour guessing:

> Is this coding problem actually within what I currently know?

ProblemFit analyzes the concepts behind a coding problem, compares them with the learner's known skills, and returns a readiness score, missing topics, confidence level, detector evidence, easier practice problems, and a learning path.

The app does not scrape or copy protected problem statements. Users paste their own statements, and the demo/training database contains **3,000 original educational problems**.

## Highlights

- Multi-layer topic detection with rule evidence, supervised local multi-label ML, TF-IDF-style similarity, optional AI interface, and voting.
- Readiness scoring against a learner skill profile.
- Accuracy Lab that calculates real precision, recall, F1, exact match, misses, and false positives.
- Built-in original problem database with training, calibration, evaluation, and demo examples across Beginner, Easy, Medium, and Hard coverage.
- Demo mode that works without Clerk, MongoDB, Sentry, or paid AI APIs.
- Polished React UI with animated intro, dashboard, skill roadmap, saved analyses, and responsive pages.

## Screens

- Landing page with animated readiness preview.
- Skill Profile page for selecting known topics.
- Problem Analyzer page for pasted problem statements.
- Analysis Result page with readiness meter, evidence, missing topics, and recommendations.
- Built-in Problems page with 3,000 original problems and pagination.
- Accuracy Lab page with computed analyzer metrics.
- Learning Path, Dashboard, Saved Problems, About, and Settings pages.

## Architecture

```text
User problem text
  -> rule-based detector
  -> local multi-label ML detector
  -> similarity detector over training/calibration tagged examples
  -> optional structured AI classifier interface
  -> voting and confidence engine
  -> readiness scorer
  -> learning path and easier problem recommendations
```

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Recharts
- Backend: FastAPI, Pydantic, Python, local scikit-learn multi-label ML, TF-IDF similarity, deterministic fallback otherwise
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
- Analysis warnings when the statement is ambiguous.
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

The Accuracy Lab runs the analyzer against the labeled evaluation subset and computes metrics at runtime. Metrics are not hard-coded.

Current local evaluation should be regenerated with `GET /api/evaluate-analyzer` after analyzer changes.

- Corpus size: `3,000`
- Training examples: `2,100`
- Calibration examples: `450`
- Held-out evaluation examples: `450`
- Latest local run: precision `0.982`, recall `0.990`, F1 `0.985`, exact match `0.964`

CLI report:

```bash
cd problemfit/backend
python -m app.analyzers.evaluation_report
```

## Tests

```bash
cd problemfit/backend
python -m pytest -q
```

## Code Quality Notes

ProblemFit is intentionally honest about uncertainty. Topic detection combines rule evidence, similarity evidence, optional AI output when configured, and a voting engine. The Accuracy Lab calculates real metrics from the built-in labeled problems.

## License

This first version is provided for educational/demo use. Add a license file before publishing publicly if you want others to reuse or modify it.
