from __future__ import annotations

from app.data.problems import PROBLEMS
from app.services.analyzer_service import analyze_problem


def test_problem_database_distribution() -> None:
    counts = {difficulty: 0 for difficulty in ["Beginner", "Easy", "Medium", "Hard"]}
    for problem in PROBLEMS:
        counts[problem["difficulty"]] += 1
    assert len(PROBLEMS) == 1220
    assert counts == {"Beginner": 260, "Easy": 390, "Medium": 360, "Hard": 210}
    assert len({problem["id"] for problem in PROBLEMS}) == len(PROBLEMS)
    assert sum(1 for problem in PROBLEMS if problem["evaluation"]) > 260


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


def test_subarray_range_problem_detection() -> None:
    result = analyze_problem(
        """The value of a subarray nums[l..r] is defined as: max(nums[l..r]) - min(nums[l..r]).

The total value is the sum of the values of all chosen subarrays.

Return the maximum possible total value you can achieve.""",
        [],
        "Python",
    )
    required = {item["topic"] for item in result["required_topics"]}
    hidden = {item["topic"] for item in result["possible_hidden_topics"]}
    assert {"arrays", "stacks", "time_complexity"} <= required
    assert "math_basics" in hidden
    assert "binary_search" not in required | hidden
    assert result["estimated_difficulty"] == "Medium"
    assert result["analysis_warnings"]
