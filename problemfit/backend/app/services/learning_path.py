from __future__ import annotations

from typing import Any

from app.data.problems import PROBLEMS
from app.data.topics import TOPICS


ROADMAP_GROUPS = [
    "Programming basics",
    "Arrays and strings",
    "Searching and sorting",
    "Hash maps and sets",
    "Recursion",
    "Two pointers and sliding window",
    "Stacks and queues",
    "Trees",
    "Graphs",
    "Dynamic programming",
]


def build_learning_path(known_topics: list[str]) -> dict[str, Any]:
    known = set(known_topics)
    groups: list[dict[str, Any]] = []
    for group in ROADMAP_GROUPS:
        topics = [topic for topic in TOPICS if topic["category"] == group or _group_alias(topic["id"]) == group]
        items = []
        for topic in topics:
            prereqs = topic["prerequisites"]
            if topic["id"] in known:
                status = "known"
            elif all(prereq in known for prereq in prereqs):
                status = "learning"
            else:
                status = "locked"
            recommended = [
                {"id": problem["id"], "title": problem["title"], "difficulty": problem["difficulty"]}
                for problem in PROBLEMS
                if topic["id"] in problem["required_topics"]
            ][:4]
            items.append({**topic, "status": status, "recommended_problems": recommended})
        if items:
            groups.append({"group": group, "items": items})
    return {"groups": groups, "known_count": len(known), "total_topics": len(TOPICS)}


def _group_alias(topic_id: str) -> str:
    if topic_id in {"recursion"}:
        return "Recursion"
    if topic_id in {"dynamic_programming"}:
        return "Dynamic programming"
    if topic_id in {"two_pointers", "sliding_window"}:
        return "Two pointers and sliding window"
    if topic_id in {"graphs", "bfs", "dfs"}:
        return "Graphs"
    if topic_id in {"trees", "binary_search_trees", "heaps"}:
        return "Trees"
    return ""
