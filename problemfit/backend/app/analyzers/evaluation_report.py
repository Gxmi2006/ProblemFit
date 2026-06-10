from __future__ import annotations

from app.analyzers.evaluation import evaluate_analyzer
from app.data.problems import PROBLEMS
from app.services.analyzer_service import analyze_problem


def main() -> None:
    result = evaluate_analyzer(PROBLEMS, analyze_problem)
    print("ProblemFit Analyzer Evaluation")
    print("==============================")
    print(f"Corpus size: {result['corpus_size']}")
    print(f"Training problems: {result['training_count']}")
    print(f"Calibration problems: {result['calibration_count']}")
    print(f"Evaluation problems: {result['evaluation_count']}")
    print(f"Precision: {result['precision']:.3f}")
    print(f"Recall: {result['recall']:.3f}")
    print(f"F1: {result['f1']:.3f}")
    print(f"Exact match: {result['exact_match_rate']:.3f}")

    print("\nTop false positives:")
    if result["false_positives"]:
        for item in result["false_positives"][:8]:
            print(f"- {item['topic']}: {item['count']}")
    else:
        print("- none")

    print("\nTop false negatives:")
    if result["false_negatives"]:
        for item in result["false_negatives"][:8]:
            print(f"- {item['topic']}: {item['count']}")
    else:
        print("- none")

    print("\nExample mismatches:")
    if result["examples"]:
        for item in result["examples"][:5]:
            print(f"- {item['problem_id']} {item['title']}")
            print(f"  expected: {', '.join(item['expected'])}")
            print(f"  predicted: {', '.join(item['predicted'])}")
    else:
        print("- none")


if __name__ == "__main__":
    main()
