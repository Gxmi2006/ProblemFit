from __future__ import annotations

from collections import Counter
from typing import Any

from app.analyzers.ai_optional import classify_with_optional_ai
from app.analyzers.readiness import score_readiness
from app.analyzers.rule_based import detect_rules
from app.analyzers.similarity import SimilarityDetector
from app.analyzers.voting import combine_votes
from app.data.problems import PROBLEMS
from app.data.topics import TOPIC_BY_ID, display_name


similarity_detector = SimilarityDetector(PROBLEMS)


def analyze_problem(problem_text: str, known_topics: list[str] | None = None, language: str = "Python") -> dict[str, Any]:
    known_topics = known_topics or []
    rule_detections = detect_rules(problem_text)
    similar_problems = similarity_detector.top_similar(problem_text, limit=5)
    similarity_detections = similarity_detector.topic_votes(problem_text, limit=5)
    ai_result = classify_with_optional_ai(problem_text)
    voted = combine_votes(rule_detections, similarity_detections, ai_result, problem_text)

    prerequisite_topics = _collect_prerequisites(voted["required_topics"], voted["possible_hidden_topics"], similar_problems)
    readiness = score_readiness(
        voted["required_topics"],
        voted["possible_hidden_topics"],
        known_topics,
        prerequisite_topics,
        voted["overall_confidence"],
    )
    estimated_difficulty = _estimate_difficulty(voted["required_topics"], similar_problems)
    estimated_time = _estimate_time(estimated_difficulty, len(readiness["missing_topics"]))
    recommended = _recommended_problems(known_topics, readiness["learning_path"], voted["required_topics"])

    return {
        "required_topics": [_public_topic(item) for item in voted["required_topics"]],
        "possible_hidden_topics": [_public_topic(item) for item in voted["possible_hidden_topics"]],
        "weak_signals": [_public_topic(item) for item in voted["weak_signals"]],
        "known_topics": known_topics,
        "missing_topics": readiness["missing_topics"],
        "weak_prerequisites": readiness["weak_prerequisites"],
        "readiness_score": readiness["readiness_score"],
        "estimated_difficulty": estimated_difficulty,
        "estimated_time": estimated_time,
        "overall_confidence": voted["overall_confidence"],
        "verdict": _personalized_verdict(readiness["verdict"], readiness["missing_topics"]),
        "score_explanation": readiness["score_explanation"],
        "learning_path": readiness["learning_path"],
        "recommended_problems": recommended,
        "similar_problems": similar_problems,
        "detector_summary": {
            "rule_based": rule_detections,
            "similarity": similarity_detections,
            "ai_optional": ai_result,
        },
        "language": language,
        "note": "This result is based on rule detection, TF-IDF similarity search, voting, and optional AI verification when configured.",
    }


def _public_topic(item: dict[str, Any]) -> dict[str, Any]:
    topic_info = TOPIC_BY_ID.get(item["topic"], {})
    return {
        **item,
        "display_name": display_name(item["topic"]),
        "category": topic_info.get("category", "Other"),
        "level": topic_info.get("level", "beginner"),
    }


def _collect_prerequisites(required: list[dict[str, Any]], hidden: list[dict[str, Any]], similar: list[dict[str, Any]]) -> list[str]:
    topics = [item["topic"] for item in required] + [item["topic"] for item in hidden if item["confidence"] >= 0.7]
    for match in similar[:3]:
        topics.extend(match["topics"])
    prerequisites: list[str] = []
    for topic_id in topics:
        prerequisites.extend(TOPIC_BY_ID.get(topic_id, {}).get("prerequisites", []))
    return list(dict.fromkeys(prerequisites))


def _estimate_difficulty(required_topics: list[dict[str, Any]], similar_problems: list[dict[str, Any]]) -> str:
    difficulty_rank = {"Beginner": 1, "Easy": 2, "Medium": 3, "Hard": 4}
    topic_weight = {
        "dynamic_programming": 3.5,
        "graphs": 3.2,
        "heaps": 3.0,
        "trees": 2.8,
        "binary_search": 2.4,
        "sliding_window": 2.5,
        "hash_maps": 2.0,
    }
    similar_score = 0.0
    if similar_problems:
        similar_score = sum(difficulty_rank.get(match["difficulty"], 2) * match["similarity"] for match in similar_problems) / max(
            0.01, sum(match["similarity"] for match in similar_problems)
        )
    topic_score = max([topic_weight.get(item["topic"], 1.5) for item in required_topics] or [1.5])
    score = max(similar_score, topic_score)
    if score >= 3.5:
        return "Hard"
    if score >= 2.7:
        return "Medium"
    if score >= 1.8:
        return "Easy-Medium"
    return "Beginner-Easy"


def _estimate_time(difficulty: str, missing_count: int) -> str:
    base = {
        "Beginner-Easy": (15, 30),
        "Easy-Medium": (30, 50),
        "Medium": (45, 75),
        "Hard": (75, 120),
    }.get(difficulty, (30, 50))
    extra = missing_count * 10
    return f"{base[0] + extra}-{base[1] + extra} minutes"


def _recommended_problems(known_topics: list[str], learning_path: list[dict[str, Any]], required_topics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    known = set(known_topics)
    target_topics = [step["topic_id"] for step in learning_path] or [item["topic"] for item in required_topics]
    candidates = []
    for problem in PROBLEMS:
        overlap = len(set(problem["required_topics"]) & set(target_topics))
        missing = len(set(problem["required_topics"]) - known)
        if overlap:
            candidates.append((overlap, -missing, problem))
    candidates.sort(key=lambda item: (-item[0], item[1], item[2]["difficulty"]))
    return [
        {
            "id": problem["id"],
            "title": problem["title"],
            "difficulty": problem["difficulty"],
            "topics": problem["required_topics"],
            "estimated_time": problem["estimated_time"],
        }
        for _, _, problem in candidates[:5]
    ]


def _personalized_verdict(verdict: str, missing_topics: list[str]) -> str:
    if missing_topics:
        missing = ", ".join(display_name(topic) for topic in missing_topics[:3])
        return f"{verdict} Focus first on {missing}."
    return verdict


def dashboard_summary(profile: dict[str, Any], saved: list[dict[str, Any]]) -> dict[str, Any]:
    known = set(profile.get("known_topics", []))
    levels = Counter(TOPIC_BY_ID[topic]["level"] for topic in known if topic in TOPIC_BY_ID)
    blockers = Counter()
    recent = saved[:5]
    for item in saved:
        for topic in item.get("analysis", {}).get("missing_topics", []):
            blockers[topic] += 1
    close = []
    for problem in PROBLEMS:
        missing = set(problem["required_topics"]) - known
        if 0 < len(missing) <= 2:
            close.append({"id": problem["id"], "title": problem["title"], "difficulty": problem["difficulty"], "missing_topics": sorted(missing)})
    return {
        "known_topics": sorted(known),
        "coverage": round(len(known) / max(1, len(TOPIC_BY_ID)), 3),
        "level_breakdown": dict(levels),
        "recent_analyses": recent,
        "saved_count": len(saved),
        "top_blockers": [{"topic": topic, "count": count} for topic, count in blockers.most_common(6)],
        "close_problems": close[:6],
        "confidence_summary": _confidence_summary(saved),
    }


def _confidence_summary(saved: list[dict[str, Any]]) -> dict[str, int]:
    counts = Counter(item.get("analysis", {}).get("overall_confidence", "unknown") for item in saved)
    return {"high": counts["high"], "medium": counts["medium"], "low": counts["low"]}
