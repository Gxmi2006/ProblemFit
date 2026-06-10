from __future__ import annotations

import os
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.data.problems import PROBLEM_BY_ID, PROBLEMS
from app.data.topics import TOPICS
from app.database.store import build_store
from app.models.schemas import AnalyzeRequest, ProfileRequest, SaveAnalysisRequest
from app.services.learning_path import build_learning_path

router = APIRouter(prefix="/api")
store = build_store()


@router.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "ProblemFit API",
        "demo_mode": not bool(os.getenv("CLERK_SECRET_KEY")),
        "database": store.mode,
        "ai_optional": bool(os.getenv("AI_CLASSIFIER_PROVIDER") and os.getenv("AI_CLASSIFIER_API_KEY")),
    }


@router.get("/topics")
def get_topics() -> list[dict[str, Any]]:
    return TOPICS


@router.get("/problems")
def get_problems(
    difficulty: str | None = Query(default=None),
    topic: str | None = Query(default=None),
) -> list[dict[str, Any]]:
    problems = PROBLEMS
    if difficulty:
        problems = [problem for problem in problems if problem["difficulty"].lower() == difficulty.lower()]
    if topic:
        problems = [problem for problem in problems if topic in problem["required_topics"] or topic in problem["tags"]]
    return problems


@router.get("/problems/{problem_id}")
def get_problem(problem_id: str) -> dict[str, Any]:
    problem = PROBLEM_BY_ID.get(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.post("/profile")
def save_profile(payload: ProfileRequest) -> dict[str, Any]:
    return store.save_profile(payload.user_id, payload.known_topics, payload.preferred_language)


@router.get("/profile/{user_id}")
def get_profile(user_id: str) -> dict[str, Any]:
    return store.get_profile(user_id)


@router.post("/analyze")
def analyze(payload: AnalyzeRequest) -> dict[str, Any]:
    from app.services.analyzer_service import analyze_problem

    return analyze_problem(payload.problem_text, payload.known_topics, payload.language)


@router.post("/save-analysis")
def save_analysis(payload: SaveAnalysisRequest) -> dict[str, Any]:
    return store.save_analysis(payload.user_id, payload.title, payload.problem_text, payload.analysis)


@router.get("/saved-analyses/{user_id}")
def saved_analyses(user_id: str) -> list[dict[str, Any]]:
    return store.list_saved_analyses(user_id)


@router.get("/learning-path/{user_id}")
def learning_path(user_id: str) -> dict[str, Any]:
    profile = store.get_profile(user_id)
    return build_learning_path(profile.get("known_topics", []))


@router.get("/dashboard/{user_id}")
def dashboard(user_id: str) -> dict[str, Any]:
    from app.services.analyzer_service import dashboard_summary

    profile = store.get_profile(user_id)
    saved = store.list_saved_analyses(user_id)
    return dashboard_summary(profile, saved)


@router.get("/evaluate-analyzer")
def evaluate() -> dict[str, Any]:
    from app.analyzers.evaluation import evaluate_analyzer
    from app.services.analyzer_service import analyze_problem

    return evaluate_analyzer(PROBLEMS, analyze_problem)
