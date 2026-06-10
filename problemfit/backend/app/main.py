from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes.api import router  # noqa: E402

try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
except Exception:  # pragma: no cover - sentry is optional
    sentry_sdk = None
    FastApiIntegration = None

if sentry_sdk and os.getenv("SENTRY_DSN"):
    sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"), integrations=[FastApiIntegration()])

app = FastAPI(
    title="ProblemFit API",
    version="0.1.0",
    description="Layered coding-problem topic detection and readiness scoring for learners.",
)

origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
}
if os.getenv("FRONTEND_ORIGIN"):
    origins.add(os.getenv("FRONTEND_ORIGIN", ""))

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "ProblemFit API is running", "docs": "/docs"}
