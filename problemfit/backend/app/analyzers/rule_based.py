from __future__ import annotations

import re
from dataclasses import dataclass

from app.utils.text import normalize_text


@dataclass(frozen=True)
class Rule:
    topic: str
    confidence: float
    phrases: tuple[str, ...]
    reason: str


RULES: tuple[Rule, ...] = (
    Rule("arrays", 0.8, ("array", "list", "sequence", "values", "numbers", "grid", "matrix"), "The statement works over an indexed collection."),
    Rule("strings", 0.82, ("string", "substring", "character", "word", "palindrome", "anagram", "letters", "parentheses"), "The statement asks about text or character processing."),
    Rule("hash_maps", 0.87, ("frequency", "count occurrences", "appears how many times", "fast lookup", "prefix counts", "target sum", "anagram", "exactly that many distinct"), "Frequency or lookup language suggests a hash map."),
    Rule("sets", 0.78, ("unique", "distinct", "set membership", "intersection", "appears in both", "membership"), "The problem emphasizes uniqueness or membership."),
    Rule("two_pointers", 0.78, ("pair sum", "two numbers", "two pointers", "opposite ends", "sorted positions", "remove repeated", "merge them"), "A pair or sorted scan can often be handled with two pointers."),
    Rule("sliding_window", 0.86, ("subarray window", "substring window", "longest substring", "longest subarray", "shortest substring", "window", "at most", "exactly that many distinct"), "A moving range is likely needed."),
    Rule("binary_search", 0.85, ("binary search", "sorted array", "first day whose value is at least", "lower bound", "minimum possible", "maximum possible", "inserted", "monotonic"), "Sorted data or answer-space search points to binary search."),
    Rule("sorting", 0.77, ("sort", "sorted", "ordering", "ascending", "descending", "finish time"), "Ordering the data is probably part of the solution."),
    Rule("searching", 0.68, ("find", "search", "requested id", "position"), "The task asks for locating a value or state."),
    Rule("stacks", 0.86, ("stack", "parentheses", "brackets", "undo", "next greater", "operators"), "LIFO behavior is signaled."),
    Rule("queues", 0.82, ("queue", "serve", "front", "back", "breadth first", "level distance", "topological"), "FIFO behavior or BFS-style processing is signaled."),
    Rule("trees", 0.86, ("tree", "root", "leaf", "node", "child links", "binary search tree"), "Hierarchical node language points to trees."),
    Rule("binary_search_trees", 0.88, ("binary search tree", "bst", "range counter"), "Ordered tree properties are central."),
    Rule("heaps", 0.86, ("heap", "priority queue", "top k", "k pair", "minimum cost route"), "Priority ordering suggests a heap."),
    Rule("graphs", 0.88, ("graph", "edge", "path", "connected", "component", "building", "station", "friendship", "dependency", "vertices", "roads"), "Edges and connectivity language points to graphs."),
    Rule("bfs", 0.84, ("breadth first", "bfs", "level distance", "shortest unweighted", "queue"), "Level-order or shortest unweighted traversal suggests BFS."),
    Rule("dfs", 0.84, ("depth first", "dfs", "recursive search", "connected land", "component", "reachable", "diameter"), "Recursive traversal or reachability suggests DFS."),
    Rule("greedy", 0.8, ("greedy", "locally", "finish time", "minimum total cost", "schedule", "choose the minimum"), "A choice-ordering optimization may be greedy."),
    Rule("dynamic_programming", 0.9, ("dynamic programming", "minimum cost", "maximum value", "number of ways", "count paths", "optimal", "overlapping", "edit distance", "knapsack", "minimum cuts"), "Optimal/counting subproblems suggest dynamic programming."),
    Rule("bit_manipulation", 0.86, ("xor", "bit", "bits", "and operation", "or operation", "mask", "bit masks"), "Bitwise operations are explicitly mentioned."),
    Rule("modular_arithmetic", 0.86, ("modulo", "modular", "remainder", "10^9+7", "large count"), "The output requires remainder arithmetic."),
    Rule("recursion", 0.82, ("recursion", "recursive", "factorial", "self-similar", "base case", "recursively"), "The problem points to self-calling functions."),
    Rule("linked_lists", 0.84, ("linked list", "node values", "next pointer", "train cars", "insert node"), "Node-link traversal is needed."),
    Rule("pointers", 0.72, ("pointer", "next pointer", "address", "linked list", "null"), "Pointer or reference handling appears."),
    Rule("functions", 0.7, ("function", "returns", "parameters"), "The task asks for reusable function logic."),
    Rule("conditions", 0.68, ("if", "otherwise", "whether", "check", "valid", "blocked", "safe"), "Decision logic is part of the task."),
    Rule("loops", 0.66, ("repeat", "scan", "each", "for every", "count", "iterate", "nested loops"), "Repeated processing is required."),
    Rule("variables", 0.58, ("given", "calculate", "compute", "value"), "Basic value storage is implied."),
    Rule("math_basics", 0.72, ("sum", "difference", "average", "minimum", "maximum", "divide", "multiply", "factorial", "digits", "arithmetic"), "Arithmetic appears in the requested result."),
    Rule("time_complexity", 0.82, ("large", "efficient", "10^5", "10^6", "constraints", "time complexity", "avoid nested loops"), "The statement calls out efficiency or constraints."),
    Rule("space_complexity", 0.62, ("memory", "auxiliary", "in-place", "storage"), "The problem may require memory tradeoff reasoning."),
)


def _find_matches(normalized: str, phrase: str) -> list[str]:
    if phrase in {"and operation", "or operation"}:
        return [phrase] if phrase in normalized else []
    if " " in phrase or "^" in phrase or "+" in phrase:
        return [phrase] if phrase in normalized else []
    pattern = rf"\b{re.escape(phrase)}s?\b"
    return re.findall(pattern, normalized)


def detect_rules(problem_text: str) -> list[dict]:
    normalized = normalize_text(problem_text)
    detections: list[dict] = []
    for rule in RULES:
        matched: list[str] = []
        for phrase in rule.phrases:
            if _find_matches(normalized, phrase):
                matched.append(phrase)
        if not matched:
            continue
        coverage_bonus = min(0.12, 0.03 * (len(matched) - 1))
        confidence = min(0.96, rule.confidence + coverage_bonus)
        detections.append(
            {
                "topic": rule.topic,
                "confidence": confidence,
                "source": "rule_based",
                "reason": rule.reason,
                "matched_phrases": matched,
                "evidence": [f"Rule matched phrase: {phrase}" for phrase in matched[:4]],
            }
        )
    return detections
