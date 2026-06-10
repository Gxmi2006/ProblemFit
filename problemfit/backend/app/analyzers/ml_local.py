from __future__ import annotations

from typing import Any


class LocalTopicClassifier:
    """Production-safe local classifier adapter.

    The heavier supervised classifier was accurate but too slow for Render's
    free CPU budget because it trained at request startup. ProblemFit now keeps
    the API fast by relying on deterministic rules plus held-out TF-IDF
    similarity for production analysis. This adapter preserves the detector
    interface so a prebuilt model can be plugged in later without changing the
    API response shape.
    """

    def __init__(self, problems: list[dict[str, Any]]):
        self.training_count = sum(1 for problem in problems if problem.get("training", True))

    def classify(self, problem_text: str, limit: int = 10) -> list[dict[str, Any]]:
        return []
