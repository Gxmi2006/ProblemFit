export type Language = "C" | "Python" | "Java" | "C++" | "JavaScript";

export type Topic = {
  id: string;
  display_name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  explanation: string;
  prerequisites: string[];
};

export type Problem = {
  id: string;
  title: string;
  statement: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard";
  estimated_time: string;
  required_topics: string[];
  prerequisite_topics: string[];
  hints: string[];
  explanation_summary: string;
  tags: string[];
  training: boolean;
  evaluation: boolean;
  demo: boolean;
};

export type DetectedTopic = {
  topic: string;
  display_name: string;
  category: string;
  level: string;
  label: "required" | "possible_hidden" | "weak_signal";
  confidence: number;
  votes: string[];
  evidence: string[];
  reason: string;
};

export type SimilarProblem = {
  id: string;
  title: string;
  similarity: number;
  difficulty: string;
  topics: string[];
  matching_topics: string[];
  evidence_reason: string;
};

export type LearningStep = {
  step: number;
  topic: string;
  topic_id: string;
  reason: string;
  prerequisites: string[];
};

export type AnalysisResult = {
  required_topics: DetectedTopic[];
  possible_hidden_topics: DetectedTopic[];
  weak_signals: DetectedTopic[];
  known_topics: string[];
  missing_topics: string[];
  weak_prerequisites: string[];
  readiness_score: number;
  estimated_difficulty: string;
  estimated_time: string;
  overall_confidence: "high" | "medium" | "low";
  analysis_warnings: string[];
  verdict: string;
  score_explanation: string[];
  learning_path: LearningStep[];
  recommended_problems: Array<{ id: string; title: string; difficulty: string; topics: string[]; estimated_time: string }>;
  similar_problems: SimilarProblem[];
  detector_summary: Record<string, unknown>;
  language: Language;
  note: string;
};

export type SavedAnalysis = {
  id: string;
  user_id: string;
  title: string;
  problem_text: string;
  analysis: AnalysisResult;
  created_at: string;
};

export type Profile = {
  user_id: string;
  known_topics: string[];
  preferred_language?: Language | null;
  updated_at?: string | null;
};

export type EvaluationResult = {
  total_problems: number;
  precision: number;
  recall: number;
  f1: number;
  exact_match_rate: number;
  topic_breakdown: Array<{
    topic: string;
    precision: number;
    recall: number;
    f1: number;
    true_positives: number;
    false_positives: number;
    false_negatives: number;
  }>;
  missed_topics: Array<{ topic: string; count: number }>;
  false_positives: Array<{ topic: string; count: number }>;
  examples: Array<{
    problem_id: string;
    title: string;
    expected: string[];
    predicted: string[];
    missed: string[];
    false_positives: string[];
  }>;
};

export type DashboardSummary = {
  known_topics: string[];
  coverage: number;
  level_breakdown: Record<string, number>;
  recent_analyses: SavedAnalysis[];
  saved_count: number;
  top_blockers: Array<{ topic: string; count: number }>;
  close_problems: Array<{ id: string; title: string; difficulty: string; missing_topics: string[] }>;
  confidence_summary: Record<"high" | "medium" | "low", number>;
};

export type LearningPathResponse = {
  groups: Array<{
    group: string;
    items: Array<Topic & { status: "known" | "learning" | "locked"; recommended_problems: Array<{ id: string; title: string; difficulty: string }> }>;
  }>;
  known_count: number;
  total_topics: number;
};
