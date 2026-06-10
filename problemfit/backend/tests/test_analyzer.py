from __future__ import annotations

from app.data.problems import PROBLEMS
from app.data.topics import ALLOWED_TOPIC_IDS
from app.services.analyzer_service import analyze_problem


def test_problem_database_distribution() -> None:
    counts = {difficulty: 0 for difficulty in ["Beginner", "Easy", "Medium", "Hard"]}
    for problem in PROBLEMS:
        counts[problem["difficulty"]] += 1
    assert len(PROBLEMS) == 3000
    assert counts == {"Beginner": 650, "Easy": 950, "Medium": 900, "Hard": 500}
    assert len({problem["id"] for problem in PROBLEMS}) == len(PROBLEMS)
    assert sum(1 for problem in PROBLEMS if problem["training"]) == 2100
    assert sum(1 for problem in PROBLEMS if problem["calibration"]) == 450
    assert sum(1 for problem in PROBLEMS if problem["evaluation"]) == 450
    training_topics = {topic for problem in PROBLEMS if problem["training"] for topic in problem["required_topics"]}
    assert set(ALLOWED_TOPIC_IDS) <= training_topics


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


def test_simple_beginner_loop_does_not_overrequire_time_complexity() -> None:
    result = analyze_problem("Given a small list of scores, scan each score and print how many are positive.", [], "Python")
    required = {item["topic"] for item in result["required_topics"]}
    assert "time_complexity" not in required


def test_maximum_possible_alone_is_not_binary_search() -> None:
    result = analyze_problem("Given three prize values, return the maximum possible value after choosing exactly one prize.", [], "Python")
    detected = {item["topic"] for item in result["required_topics"] + result["possible_hidden_topics"]}
    assert "binary_search" not in detected
