from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


Language = Literal["C", "Python", "Java", "C++", "JavaScript"]


class ProfileRequest(BaseModel):
    user_id: str = "demo-user"
    known_topics: list[str] = Field(default_factory=list)
    preferred_language: Language | None = None


class AnalyzeRequest(BaseModel):
    problem_text: str = Field(min_length=8)
    known_topics: list[str] = Field(default_factory=list)
    language: Language = "Python"


class SaveAnalysisRequest(BaseModel):
    user_id: str = "demo-user"
    title: str = "Saved analysis"
    problem_text: str
    analysis: dict[str, Any]


class SavedAnalysis(BaseModel):
    id: str
    user_id: str
    title: str
    problem_text: str
    analysis: dict[str, Any]
    created_at: str
