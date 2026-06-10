# Accuracy Methodology

ProblemFit should prove detection quality instead of only claiming it.

## Analyzer Layers

1. Rule-based detector: finds explicit topic signals, phrases, and problem patterns.
2. Local ML detector: trains deterministic topic centroids from the original labeled corpus and predicts only from the fixed topic list.
3. Similarity detector: compares the pasted statement against original tagged examples with TF-IDF cosine similarity when scikit-learn is installed.
4. Optional AI interface: reserved for a structured classifier that must choose only from the fixed topic list.
5. Voting engine: combines detector votes, confidence, evidence, and statement quality.
6. Readiness scorer: compares required and possible hidden topics with the learner profile.

## Evaluation Data

The backend includes 1,220 original labeled problems:

- 260 Beginner
- 390 Easy
- 360 Medium
- 210 Hard

Each problem has required topics and prerequisite topics. Problems are marked for training, demo display, and/or evaluation. The Accuracy Lab uses the evaluation subset as ground truth.

## Metrics

`GET /api/evaluate-analyzer` calculates:

- Precision: predicted required topics that were correct
- Recall: expected topics that were detected
- F1: harmonic mean of precision and recall
- Exact match rate: predicted topic set exactly matched the expected set
- Topic-wise precision, recall, and F1
- False positives and false negatives

Metrics are calculated at runtime from the current analyzer and seed labels. They are not hard-coded.

## Improving Accuracy

Use the weakest topic breakdown to improve rules, local ML feature coverage, and seed coverage. If a topic has low recall, add better phrase coverage or more tagged examples. If a topic has low precision, reduce broad rules, tune local ML thresholds, or require stronger agreement.
