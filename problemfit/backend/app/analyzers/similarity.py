from __future__ import annotations

from collections import defaultdict
from typing import Any

from app.utils.text import normalize_text, tokenize

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except Exception:  # pragma: no cover - exercised only when sklearn is unavailable
    TfidfVectorizer = None
    cosine_similarity = None


class SimilarityDetector:
    def __init__(self, problems: list[dict[str, Any]]):
        self.problems = problems
        self.documents = [
            normalize_text(
                " ".join(
                    [
                        problem["title"],
                        problem["statement"],
                        " ".join(problem["required_topics"]),
                        " ".join(problem["prerequisite_topics"]),
                    ]
                )
            )
            for problem in problems
        ]
        self.vectorizer = None
        self.matrix = None
        if TfidfVectorizer and cosine_similarity:
            self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, stop_words="english")
            self.matrix = self.vectorizer.fit_transform(self.documents)

    def top_similar(self, problem_text: str, limit: int = 5) -> list[dict[str, Any]]:
        if self.vectorizer is not None and self.matrix is not None and cosine_similarity is not None:
            query = self.vectorizer.transform([normalize_text(problem_text)])
            scores = cosine_similarity(query, self.matrix)[0]
            ranked = sorted(enumerate(scores), key=lambda item: item[1], reverse=True)[:limit]
            return [self._format_match(index, float(score)) for index, score in ranked if score > 0.01]
        return self._fallback_similar(problem_text, limit)

    def topic_votes(self, problem_text: str, limit: int = 5) -> list[dict[str, Any]]:
        similar = self.top_similar(problem_text, limit=limit)
        grouped: dict[str, dict[str, Any]] = defaultdict(lambda: {"topic": "", "confidence": 0.0, "evidence": [], "matches": []})
        for match in similar:
            for topic in match["topics"]:
                confidence = min(0.9, 0.38 + match["similarity"] * 0.72)
                record = grouped[topic]
                record["topic"] = topic
                record["confidence"] = max(record["confidence"], confidence)
                record["matches"].append(match["title"])
                record["evidence"].append(
                    f"Similar problem '{match['title']}' shares topic {topic.replace('_', ' ')} (similarity {match['similarity']:.2f})."
                )
        return [
            {
                "topic": topic,
                "confidence": round(record["confidence"], 3),
                "source": "similarity",
                "reason": "Top tagged examples in the built-in knowledge base use this topic.",
                "matched_problems": record["matches"][:3],
                "evidence": record["evidence"][:4],
            }
            for topic, record in grouped.items()
        ]

    def _fallback_similar(self, problem_text: str, limit: int) -> list[dict[str, Any]]:
        query_tokens = tokenize(problem_text)
        ranked: list[tuple[int, float]] = []
        for index, document in enumerate(self.documents):
            doc_tokens = tokenize(document)
            if not query_tokens or not doc_tokens:
                score = 0.0
            else:
                score = len(query_tokens & doc_tokens) / len(query_tokens | doc_tokens)
            ranked.append((index, score))
        ranked.sort(key=lambda item: item[1], reverse=True)
        return [self._format_match(index, score) for index, score in ranked[:limit] if score > 0.01]

    def _format_match(self, index: int, score: float) -> dict[str, Any]:
        problem = self.problems[index]
        return {
            "id": problem["id"],
            "title": problem["title"],
            "similarity": round(score, 3),
            "difficulty": problem["difficulty"],
            "topics": problem["required_topics"],
            "matching_topics": problem["required_topics"],
            "evidence_reason": "TF-IDF similarity compared the pasted statement with original tagged examples.",
        }
