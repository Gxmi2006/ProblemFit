# Accuracy Methodology

ProblemFit should prove detection quality instead of only claiming it.

## Analyzer Layers

1. Rule-based detector: finds explicit topic signals, phrases, and problem patterns.
2. Local classifier adapter: keeps the detector interface available without training a heavy model during free-tier web startup.
3. Similarity detector: compares the pasted statement against training/calibration tagged examples with TF-IDF cosine similarity when scikit-learn is installed.
4. Optional AI interface: reserved for a structured classifier that must choose only from the fixed topic list.
5. Voting engine: combines detector votes, confidence, evidence, and statement quality.
6. Readiness scorer: compares required and possible hidden topics with the learner profile.

## Evaluation Data

The backend includes 3,000 original labeled problems:

- 650 Beginner
- 950 Easy
- 900 Medium
- 500 Hard

Each problem has required topics and prerequisite topics. Problems are marked with one split: training, calibration, or evaluation. Demo examples are selected from training examples and are not used as the evaluation ground truth.

Current split:

- 2,100 training problems
- 450 calibration problems for per-topic threshold tuning
- 450 held-out evaluation problems for Accuracy Lab scoring

## Metrics

`GET /api/evaluate-analyzer` calculates:

- Precision: predicted required topics that were correct
- Recall: expected topics that were detected
- F1: harmonic mean of precision and recall
- Exact match rate: predicted topic set exactly matched the expected set
- Topic-wise precision, recall, and F1
- False positives and false negatives
- Split counts for corpus, training, calibration, and evaluation data

Metrics are calculated at runtime from the current analyzer and seed labels. They are not hard-coded.

Latest local report:

- Precision: 0.982
- Recall: 0.963
- F1: 0.968
- Exact match rate: 0.907

## Improving Accuracy

Use the weakest topic breakdown to improve rules, local ML feature coverage, threshold calibration, and seed coverage. If a topic has low recall, add better phrase coverage or more tagged examples. If a topic has low precision, reduce broad rules, tune local ML thresholds, or require stronger agreement.
