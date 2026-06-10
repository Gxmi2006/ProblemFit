from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any, Callable


def _safe_div(numerator: float, denominator: float) -> float:
    return numerator / denominator if denominator else 0.0


def evaluate_analyzer(problems: list[dict[str, Any]], analyze: Callable[[str, list[str], str], dict[str, Any]]) -> dict[str, Any]:
    test_problems = [problem for problem in problems if problem.get("evaluation")]
    precision_values: list[float] = []
    recall_values: list[float] = []
    f1_values: list[float] = []
    exact_matches = 0
    topic_stats: dict[str, Counter] = defaultdict(Counter)
    missed_topics: Counter = Counter()
    false_positive_topics: Counter = Counter()
    examples: list[dict[str, Any]] = []

    for problem in test_problems:
        result = analyze(problem["statement"], [], "Python")
        expected = set(problem["required_topics"])
        predicted = {item["topic"] for item in result["required_topics"]}

        tp = len(expected & predicted)
        fp = len(predicted - expected)
        fn = len(expected - predicted)
        precision = _safe_div(tp, tp + fp)
        recall = _safe_div(tp, tp + fn)
        f1 = _safe_div(2 * precision * recall, precision + recall)

        precision_values.append(precision)
        recall_values.append(recall)
        f1_values.append(f1)
        if expected == predicted:
            exact_matches += 1

        for topic in expected | predicted:
            topic_stats[topic]["tp"] += int(topic in expected and topic in predicted)
            topic_stats[topic]["fp"] += int(topic not in expected and topic in predicted)
            topic_stats[topic]["fn"] += int(topic in expected and topic not in predicted)
        missed_topics.update(expected - predicted)
        false_positive_topics.update(predicted - expected)
        if fp or fn:
            examples.append(
                {
                    "problem_id": problem["id"],
                    "title": problem["title"],
                    "expected": sorted(expected),
                    "predicted": sorted(predicted),
                    "missed": sorted(expected - predicted),
                    "false_positives": sorted(predicted - expected),
                }
            )

    total = len(test_problems)
    topic_breakdown = []
    for topic, stats in sorted(topic_stats.items()):
        precision = _safe_div(stats["tp"], stats["tp"] + stats["fp"])
        recall = _safe_div(stats["tp"], stats["tp"] + stats["fn"])
        f1 = _safe_div(2 * precision * recall, precision + recall)
        topic_breakdown.append(
            {
                "topic": topic,
                "precision": round(precision, 3),
                "recall": round(recall, 3),
                "f1": round(f1, 3),
                "true_positives": stats["tp"],
                "false_positives": stats["fp"],
                "false_negatives": stats["fn"],
            }
        )

    return {
        "corpus_size": len(problems),
        "training_count": sum(1 for problem in problems if problem.get("training")),
        "calibration_count": sum(1 for problem in problems if problem.get("calibration")),
        "evaluation_count": total,
        "total_problems": total,
        "precision": round(sum(precision_values) / max(1, total), 3),
        "recall": round(sum(recall_values) / max(1, total), 3),
        "f1": round(sum(f1_values) / max(1, total), 3),
        "exact_match_rate": round(exact_matches / max(1, total), 3),
        "topic_breakdown": topic_breakdown,
        "missed_topics": [{"topic": topic, "count": count} for topic, count in missed_topics.most_common(12)],
        "false_negatives": [{"topic": topic, "count": count} for topic, count in missed_topics.most_common(12)],
        "false_positives": [{"topic": topic, "count": count} for topic, count in false_positive_topics.most_common(12)],
        "examples": examples[:20],
    }
