from __future__ import annotations

import os
from typing import Any

from app.data.topics import ALLOWED_TOPIC_IDS


def classify_with_optional_ai(problem_text: str) -> dict[str, Any]:
    """Interface for an optional structured AI classifier.

    The first version deliberately avoids making a network call. If a provider key is
    configured, this returns a transparent skipped status so callers can see that the
    app is ready for integration without depending on a paid API in demo mode.
    """

    provider = os.getenv("AI_CLASSIFIER_PROVIDER") or ""
    api_key = os.getenv("AI_CLASSIFIER_API_KEY") or ""
    if not provider or not api_key:
        return {
            "enabled": False,
            "topics": [],
            "hidden_topics": [],
            "difficulty_estimate": None,
            "confidence": "skipped",
            "allowed_topics": ALLOWED_TOPIC_IDS,
            "note": "No AI classifier key configured; rule and similarity layers were used.",
        }
    return {
        "enabled": True,
        "topics": [],
        "hidden_topics": [],
        "difficulty_estimate": None,
        "confidence": "skipped",
        "allowed_topics": ALLOWED_TOPIC_IDS,
        "note": f"Provider '{provider}' is configured. Add a provider adapter to enable live AI classification.",
    }
