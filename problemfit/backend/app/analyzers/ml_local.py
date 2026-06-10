from __future__ import annotations

import math
from collections import Counter, defaultdict
from typing import Any

from app.data.topics import TOPIC_BY_ID
from app.utils.text import normalize_text


def _features(text: str) -> Counter[str]:
    normalized = normalize_text(text)
    tokens = [token for token in normalized.split() if len(token) > 1]
    features: Counter[str] = Counter(tokens)
    for size in (2, 3):
        for index in range(len(tokens) - size + 1):
            features["_".join(tokens[index : index + size])] += 1

    joined = " ".join(tokens)
    if "max nums l r" in joined and "min nums l r" in joined:
        features["feature_subarray_max_min_range"] += 5
        features["feature_monotonic_stack_range"] += 4
    if "all subarrays" in joined or "all chosen subarrays" in joined or "sum of the values of all" in joined:
        features["feature_all_subarray_aggregation"] += 5
    if "previous smaller" in joined or "next smaller" in joined or "next greater" in joined or "previous greater" in joined:
        features["feature_monotonic_boundaries"] += 4
    return features


def _cosine(left: dict[str, float], right: dict[str, float]) -> float:
    shared = set(left) & set(right)
    numerator = sum(left[token] * right[token] for token in shared)
    left_norm = math.sqrt(sum(value * value for value in left.values()))
    right_norm = math.sqrt(sum(value * value for value in right.values()))
    if not left_norm or not right_norm:
        return 0.0
    return numerator / (left_norm * right_norm)


class LocalTopicClassifier:
    def __init__(self, problems: list[dict[str, Any]]):
        self.problems = [problem for problem in problems if problem.get("training", True)]
        self.idf = self._build_idf(self.problems)
        self.topic_centroids = self._build_topic_centroids()

    def classify(self, problem_text: str, limit: int = 10) -> list[dict[str, Any]]:
        query_vector = self._vectorize(problem_text)
        ranked: list[tuple[str, float]] = []
        for topic, centroid in self.topic_centroids.items():
            score = _cosine(query_vector, centroid)
            if score > 0.045:
                ranked.append((topic, score))

        ranked.sort(key=lambda item: item[1], reverse=True)
        detections = []
        for topic, score in ranked[:limit]:
            confidence = min(0.94, 0.34 + score * 2.4)
            if confidence < 0.5:
                continue
            detections.append(
                {
                    "topic": topic,
                    "confidence": round(confidence, 3),
                    "source": "ml_local",
                    "reason": "A local classifier trained on the original labeled corpus found semantic topic overlap.",
                    "evidence": [
                        f"Local ML topic centroid matched {topic.replace('_', ' ')} with score {score:.2f}.",
                        "The classifier uses only the fixed ProblemFit topic list.",
                    ],
                }
            )
        return detections

    def _build_idf(self, problems: list[dict[str, Any]]) -> dict[str, float]:
        document_frequency: Counter[str] = Counter()
        for problem in problems:
            document_frequency.update(_features(self._problem_text(problem)).keys())
        total = max(1, len(problems))
        return {token: math.log((1 + total) / (1 + count)) + 1 for token, count in document_frequency.items()}

    def _build_topic_centroids(self) -> dict[str, dict[str, float]]:
        topic_vectors: dict[str, Counter[str]] = defaultdict(Counter)
        topic_counts: Counter[str] = Counter()
        for problem in self.problems:
            vector = self._vectorize(self._problem_text(problem))
            for topic in problem["required_topics"]:
                if topic not in TOPIC_BY_ID:
                    continue
                topic_counts[topic] += 1
                topic_vectors[topic].update(vector)

        centroids: dict[str, dict[str, float]] = {}
        for topic, vector in topic_vectors.items():
            count = max(1, topic_counts[topic])
            centroids[topic] = {token: value / count for token, value in vector.items()}
        return centroids

    def _vectorize(self, text: str) -> dict[str, float]:
        features = _features(text)
        return {token: count * self.idf.get(token, 1.0) for token, count in features.items()}

    @staticmethod
    def _problem_text(problem: dict[str, Any]) -> str:
        return " ".join(
            [
                problem.get("title", ""),
                problem.get("statement", ""),
                problem.get("focus", ""),
                " ".join(problem.get("required_topics", [])),
                " ".join(problem.get("tags", [])),
            ]
        )
