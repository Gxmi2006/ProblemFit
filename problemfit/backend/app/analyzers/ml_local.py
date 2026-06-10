from __future__ import annotations

import re
from collections import Counter
from typing import Any

from app.data.topics import ALLOWED_TOPIC_IDS
from app.utils.text import normalize_text

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.multiclass import OneVsRestClassifier
    from sklearn.pipeline import FeatureUnion
    from sklearn.preprocessing import MultiLabelBinarizer
except Exception:  # pragma: no cover - exercised only when sklearn is unavailable
    FeatureUnion = None
    LogisticRegression = None
    MultiLabelBinarizer = None
    OneVsRestClassifier = None
    TfidfVectorizer = None


DEFAULT_THRESHOLD = 0.55
GENERIC_TOPIC_FLOORS = {
    "variables": 0.78,
    "conditions": 0.72,
    "loops": 0.67,
    "math_basics": 0.72,
    "time_complexity": 0.74,
    "searching": 0.68,
    "hash_maps": 0.64,
}
HIGH_SIGNAL_TOPICS = {
    "binary_search",
    "bit_manipulation",
    "dynamic_programming",
    "graphs",
    "heaps",
    "modular_arithmetic",
    "sliding_window",
    "space_complexity",
    "stacks",
    "trees",
}


def _prepare_text(text: str) -> str:
    normalized = normalize_text(text)
    signal_tokens: list[str] = []

    if re.search(r"max\s*nums\s*l\s*r", normalized) and re.search(r"min\s*nums\s*l\s*r", normalized):
        signal_tokens.extend(["signal_subarray_range", "signal_monotonic_stack", "signal_all_subarrays"])
    if "all subarrays" in normalized or "sum of the values of all" in normalized:
        signal_tokens.extend(["signal_all_subarrays", "signal_contribution_counting"])
    if any(phrase in normalized for phrase in ("previous smaller", "next smaller", "previous greater", "next greater")):
        signal_tokens.extend(["signal_monotonic_stack", "signal_nearest_boundary"])
    if "monotonic answer" in normalized or "minimum possible largest" in normalized or "first value at least" in normalized:
        signal_tokens.extend(["signal_answer_space_search", "signal_binary_search"])
    if "auxiliary memory" in normalized or "constant auxiliary" in normalized or "memory limit" in normalized:
        signal_tokens.append("signal_space_complexity")
    if "number of ways" in normalized or "minimum cost" in normalized or "edit distance" in normalized:
        signal_tokens.append("signal_dynamic_programming")

    return " ".join([normalized, *signal_tokens])


def _problem_text(problem: dict[str, Any]) -> str:
    return _prepare_text(
        " ".join(
            [
                problem.get("title", ""),
                problem.get("focus", ""),
                problem.get("statement", ""),
                problem.get("input_format", ""),
                problem.get("output_format", ""),
            ]
        )
    )


def _safe_div(numerator: float, denominator: float) -> float:
    return numerator / denominator if denominator else 0.0


def _f1(tp: int, fp: int, fn: int) -> float:
    precision = _safe_div(tp, tp + fp)
    recall = _safe_div(tp, tp + fn)
    return _safe_div(2 * precision * recall, precision + recall)


class LocalTopicClassifier:
    def __init__(self, problems: list[dict[str, Any]]):
        self.training_problems = [problem for problem in problems if problem.get("training", True)]
        self.calibration_problems = [problem for problem in problems if problem.get("calibration")]
        self.model = None
        self.vectorizer = None
        self.labeler = None
        self.thresholds = {topic: GENERIC_TOPIC_FLOORS.get(topic, DEFAULT_THRESHOLD) for topic in ALLOWED_TOPIC_IDS}
        self.topic_counts: Counter[str] = Counter()
        self.available = False

        if not all([FeatureUnion, LogisticRegression, MultiLabelBinarizer, OneVsRestClassifier, TfidfVectorizer]):
            return
        if not self.training_problems:
            return
        self._train()

    def classify(self, problem_text: str, limit: int = 10) -> list[dict[str, Any]]:
        if not self.available or self.model is None or self.vectorizer is None or self.labeler is None:
            return []

        matrix = self.vectorizer.transform([_prepare_text(problem_text)])
        probabilities = self.model.predict_proba(matrix)[0]
        ranked: list[tuple[str, float]] = []
        for topic, probability in zip(self.labeler.classes_, probabilities):
            threshold = self.thresholds.get(topic, DEFAULT_THRESHOLD)
            if probability >= threshold:
                ranked.append((topic, float(probability)))

        ranked.sort(key=lambda item: item[1], reverse=True)
        detections = []
        for topic, probability in ranked[:limit]:
            threshold = self.thresholds.get(topic, DEFAULT_THRESHOLD)
            detections.append(
                {
                    "topic": topic,
                    "confidence": round(min(0.96, 0.42 + probability * 0.58), 3),
                    "source": "ml_local",
                    "reason": "A local multi-label classifier trained on the held-out split corpus selected this topic.",
                    "evidence": [
                        f"Local classifier probability for {topic.replace('_', ' ')}: {probability:.2f}.",
                        f"Calibrated threshold for this topic: {threshold:.2f}.",
                    ],
                }
            )
        return detections

    def _train(self) -> None:
        texts = [_problem_text(problem) for problem in self.training_problems]
        labels = [problem["required_topics"] for problem in self.training_problems]
        self.topic_counts = Counter(topic for row in labels for topic in row)
        self.labeler = MultiLabelBinarizer(classes=ALLOWED_TOPIC_IDS)
        encoded_labels = self.labeler.fit_transform(labels)
        self.vectorizer = FeatureUnion(
            [
                (
                    "word",
                    TfidfVectorizer(
                        ngram_range=(1, 3),
                        min_df=1,
                        max_features=18000,
                        sublinear_tf=True,
                        stop_words="english",
                    ),
                ),
                (
                    "char",
                    TfidfVectorizer(
                        analyzer="char_wb",
                        ngram_range=(3, 5),
                        min_df=2,
                        max_features=12000,
                        sublinear_tf=True,
                    ),
                ),
            ]
        )
        matrix = self.vectorizer.fit_transform(texts)
        self.model = OneVsRestClassifier(
            LogisticRegression(
                class_weight="balanced",
                max_iter=1500,
                solver="liblinear",
            )
        )
        self.model.fit(matrix, encoded_labels)
        self.available = True
        self._calibrate_thresholds()

    def _calibrate_thresholds(self) -> None:
        calibration = self.calibration_problems or self.training_problems
        if not calibration or self.model is None or self.vectorizer is None or self.labeler is None:
            return

        matrix = self.vectorizer.transform([_problem_text(problem) for problem in calibration])
        probabilities = self.model.predict_proba(matrix)
        expected_by_topic = {
            topic: [topic in problem["required_topics"] for problem in calibration] for topic in self.labeler.classes_
        }
        candidates = [round(value / 100, 2) for value in range(30, 91, 2)]

        for index, topic in enumerate(self.labeler.classes_):
            expected = expected_by_topic[topic]
            if not any(expected):
                continue
            floor = GENERIC_TOPIC_FLOORS.get(topic, 0.44 if topic in HIGH_SIGNAL_TOPICS else DEFAULT_THRESHOLD)
            best_threshold = floor
            best_score = -1.0
            best_precision = -1.0

            for threshold in candidates:
                threshold = max(threshold, floor)
                predictions = [probability >= threshold for probability in probabilities[:, index]]
                tp = sum(1 for truth, pred in zip(expected, predictions) if truth and pred)
                fp = sum(1 for truth, pred in zip(expected, predictions) if not truth and pred)
                fn = sum(1 for truth, pred in zip(expected, predictions) if truth and not pred)
                score = _f1(tp, fp, fn)
                precision = _safe_div(tp, tp + fp)
                if score > best_score or (score == best_score and precision > best_precision):
                    best_threshold = threshold
                    best_score = score
                    best_precision = precision

            self.thresholds[topic] = round(best_threshold, 2)
