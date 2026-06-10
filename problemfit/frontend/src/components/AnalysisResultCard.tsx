import { Bookmark, RotateCcw, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { AnalysisResult } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ReadinessMeter } from "./ReadinessMeter";
import { SkillBadge } from "./SkillBadge";
import { SimilarProblemCard } from "./SimilarProblemCard";
import { TopicEvidenceCard } from "./TopicEvidenceCard";

type AnalysisResultCardProps = {
  result: AnalysisResult;
  onSave?: () => void;
};

export function AnalysisResultCard({ result, onSave }: AnalysisResultCardProps) {
  return (
    <div className="space-y-6">
      <section className="glass grid gap-6 rounded-md p-6 lg:grid-cols-[220px_1fr]">
        <div className="flex justify-center">
          <ReadinessMeter score={result.readiness_score} />
        </div>
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <ConfidenceBadge confidence={result.overall_confidence} />
            <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300">{result.estimated_difficulty}</span>
            <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300">{result.estimated_time}</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white md:text-4xl">{result.verdict}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.missing_topics.length ? (
              result.missing_topics.map((topic) => <SkillBadge key={topic} label={topic.replace("_", " ")} />)
            ) : (
              <SkillBadge label="No required gaps found" active />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {onSave ? (
              <button onClick={onSave} className="inline-flex items-center rounded-md bg-aqua px-4 py-2 text-sm font-bold text-ink transition hover:bg-mint">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </button>
            ) : null}
            <Link to="/skills" className="inline-flex items-center rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-white transition hover:border-aqua/50">
              <UserRound className="mr-2 h-4 w-4" />
              Update Skills
            </Link>
            <Link to="/analyze" className="inline-flex items-center rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-white transition hover:border-aqua/50">
              <RotateCcw className="mr-2 h-4 w-4" />
              Analyze Another
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {result.score_explanation.slice(0, 3).map((item) => (
          <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
            {item}
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-xl font-bold text-white">Required Topics</h2>
          <div className="space-y-3">
            {result.required_topics.map((topic) => (
              <TopicEvidenceCard key={topic.topic} topic={topic} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 font-display text-xl font-bold text-white">Possible Hidden Topics</h2>
          <div className="space-y-3">
            {result.possible_hidden_topics.length ? (
              result.possible_hidden_topics.map((topic) => <TopicEvidenceCard key={topic.topic} topic={topic} />)
            ) : (
              <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">No strong hidden-topic signals were found.</div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-xl font-bold text-white">Learning Roadmap</h2>
          <div className="space-y-3">
            {result.learning_path.length ? (
              result.learning_path.map((step) => (
                <div key={step.step} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs font-bold uppercase text-aqua">Step {step.step}</p>
                  <h3 className="mt-1 font-bold text-white">{step.topic}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.reason}</p>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">Your current profile covers the detected path.</div>
            )}
          </div>
        </div>
        <div>
          <h2 className="mb-3 font-display text-xl font-bold text-white">Similar Evidence</h2>
          <div className="space-y-3">
            {result.similar_problems.map((problem) => (
              <SimilarProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
