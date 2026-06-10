from __future__ import annotations

from app.data.problems import PROBLEMS
from app.services.analyzer_service import analyze_problem


def test_problem_database_distribution() -> None:
    counts = {difficulty: 0 for difficulty in ["Beginner", "Easy", "Medium", "Hard"]}
    for problem in PROBLEMS:
        counts[problem["difficulty"]] += 1
    assert len(PROBLEMS) == 260
    assert counts == {"Beginner": 65, "Easy": 85, "Medium": 70, "Hard": 40}
    assert len({problem["id"] for problem in PROBLEMS}) == len(PROBLEMS)


def test_hash_map_pair_detection() -> None:
    result = analyze_problem(
        "Given an array of numbers and a target sum, decide if two numbers form the target using fast lookup.",
        ["arrays", "loops"],
        "Python",
    )
    required = {item["topic"] for item in result["required_topics"]}
    assert "hash_maps" in required
    assert result["readiness_score"] < 100
    assert "hash_maps" in result["missing_topics"]


def test_evaluation_smoke() -> None:
    result = analyze_problem(PROBLEMS[64]["statement"], [], "Python")
    required = {item["topic"] for item in result["required_topics"]}
    assert {"dynamic_programming", "modular_arithmetic"} & required
