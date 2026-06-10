from __future__ import annotations

from collections import defaultdict
from typing import Any

from app.data.topics import TOPIC_BY_ID
from app.utils.text import statement_quality_multiplier


TOPIC_REASONS = {
    "hash_maps": "The problem likely needs fast lookup, grouping, or frequency counting.",
    "sliding_window": "The wording suggests maintaining a moving range instead of trying every range from scratch.",
    "dynamic_programming": "The problem appears to involve overlapping subproblems or an optimal/counting recurrence.",
    "graphs": "The problem is naturally modeled with vertices, edges, paths, or connectivity.",
    "binary_search": "The problem has sorted data or a monotonic answer space.",
    "stacks": "The solution likely needs last-in-first-out behavior.",
    "queues": "The solution likely needs first-in-first-out simulation or breadth-first traversal.",
    "trees": "The problem depends on hierarchical node traversal.",
}


def combine_votes(
    rule_detections: list[dict[str, Any]],
    similarity_detections: list[dict[str, Any]],
    ai_result: dict[str, Any],
    problem_text: str,
) -> dict[str, Any]:
    quality = statement_quality_multiplier(problem_text)
    grouped: dict[str, dict[str, Any]] = defaultdict(lambda: {"votes": [], "confidences": [], "evidence": [], "reasons": []})

    for detection in rule_detections + similarity_detections:
        topic = detection["topic"]
        grouped[topic]["votes"].append(detection["source"])
        grouped[topic]["confidences"].append(float(detection["confidence"]))
        grouped[topic]["evidence"].extend(detection.get("evidence", []))
        grouped[topic]["reasons"].append(detection.get("reason", ""))

    for item in ai_result.get("topics", []):
        topic = item.get("topic")
        if topic not in TOPIC_BY_ID:
            continue
        grouped[topic]["votes"].append("ai_optional")
        grouped[topic]["confidences"].append(float(item.get("confidence", 0.6)))
        grouped[topic]["evidence"].append(f"AI classifier selected {topic}.")
        grouped[topic]["reasons"].append(item.get("reason", "AI classifier signal."))

    final_topics: list[dict[str, Any]] = []
    for topic, record in grouped.items():
        unique_votes = sorted(set(record["votes"]))
        avg_confidence = sum(record["confidences"]) / max(1, len(record["confidences"]))
        vote_bonus = 0.08 * (len(unique_votes) - 1)
        strongest = max(record["confidences"]) if record["confidences"] else 0.0
        confidence = min(0.98, max(avg_confidence + vote_bonus, strongest * 0.94)) * quality
        confidence = round(confidence, 3)

        if confidence >= 0.76 and (len(unique_votes) >= 2 or strongest >= 0.86):
            label = "required"
        elif confidence >= 0.52:
            label = "possible_hidden"
        else:
            label = "weak_signal"

        if len(problem_text.split()) < 18 and label == "required":
            label = "possible_hidden"

        final_topics.append(
            {
                "topic": topic,
                "label": label,
                "confidence": confidence,
                "votes": unique_votes,
                "evidence": list(dict.fromkeys(record["evidence"]))[:6],
                "reason": TOPIC_REASONS.get(topic) or next((reason for reason in record["reasons"] if reason), "Detector evidence supports this topic."),
            }
        )

    final_topics.sort(key=lambda item: (item["label"] != "required", -item["confidence"], item["topic"]))
    required = [topic for topic in final_topics if topic["label"] == "required"]
    hidden = [topic for topic in final_topics if topic["label"] == "possible_hidden"]
    weak = [topic for topic in final_topics if topic["label"] == "weak_signal"]

    detector_count = len({vote for topic in final_topics for vote in topic["votes"]})
    average_required = sum(item["confidence"] for item in required) / max(1, len(required))
    if average_required >= 0.78 and detector_count >= 2:
        overall = "high"
    elif average_required >= 0.58 or detector_count >= 2:
        overall = "medium"
    else:
        overall = "low"
    if quality < 1 and overall == "high":
        overall = "medium"

    return {
        "topics": final_topics,
        "required_topics": required,
        "possible_hidden_topics": hidden,
        "weak_signals": weak,
        "overall_confidence": overall,
    }
