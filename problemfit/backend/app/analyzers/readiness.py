from __future__ import annotations

from typing import Any

from app.data.topics import TOPIC_BY_ID, display_name


def _learning_step(topic_id: str, index: int) -> dict[str, Any]:
    topic = TOPIC_BY_ID.get(topic_id, {})
    return {
        "step": index,
        "topic": display_name(topic_id),
        "topic_id": topic_id,
        "reason": topic.get("explanation", "Learn this concept before attempting the problem."),
        "prerequisites": topic.get("prerequisites", []),
    }


def score_readiness(
    required_topics: list[dict[str, Any]],
    possible_hidden_topics: list[dict[str, Any]],
    known_topics: list[str],
    prerequisite_topics: list[str],
    overall_confidence: str,
) -> dict[str, Any]:
    known = set(known_topics)
    score = 100
    explanations: list[str] = []

    missing_required = [item for item in required_topics if item["topic"] not in known]
    for item in missing_required:
        confidence = item["confidence"]
        penalty = 28 if confidence >= 0.82 else 18 if confidence >= 0.62 else 12
        score -= penalty
        explanations.append(f"Missing {display_name(item['topic'])} reduced the score by {penalty} points.")

    prereq_gaps = []
    for topic_id in prerequisite_topics:
        if topic_id not in known and topic_id not in {item["topic"] for item in missing_required}:
            prereq_gaps.append(topic_id)
            score -= 8
            explanations.append(f"Prerequisite gap {display_name(topic_id)} reduced the score by 8 points.")

    hidden_missing = [item for item in possible_hidden_topics if item["topic"] not in known and item["confidence"] >= 0.72]
    for item in hidden_missing[:2]:
        score -= 6
        explanations.append(f"Possible hidden topic {display_name(item['topic'])} reduced the score by 6 points.")

    if overall_confidence == "low":
        score -= 7
        explanations.append("The statement is unclear or sparse, so the analyzer reduced confidence slightly.")
    elif overall_confidence == "medium":
        score -= 3

    score = max(0, min(100, int(round(score))))

    if score >= 85:
        verdict = "You are ready. Try solving it now."
    elif score >= 65:
        verdict = "You can try, but expect some difficulty."
    elif score >= 40:
        verdict = "Learn the missing topics first."
    else:
        verdict = "This is probably outside your current range."

    missing_topic_ids = [item["topic"] for item in missing_required]
    weak_prerequisites = list(dict.fromkeys(prereq_gaps))
    learning_order = list(dict.fromkeys(weak_prerequisites + missing_topic_ids + [item["topic"] for item in hidden_missing]))

    return {
        "readiness_score": score,
        "verdict": verdict,
        "missing_topics": missing_topic_ids,
        "weak_prerequisites": weak_prerequisites,
        "score_explanation": explanations or ["Your known topics cover the detected required concepts."],
        "learning_path": [_learning_step(topic_id, index + 1) for index, topic_id in enumerate(learning_order[:8])],
    }
