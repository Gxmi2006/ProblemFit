import { Clock, Sparkles } from "lucide-react";
import type { Problem } from "../types";
import { SkillBadge } from "./SkillBadge";

type ProblemCardProps = {
  problem: Problem;
  onAnalyze?: (problem: Problem) => void;
};

export function ProblemCard({ problem, onAnalyze }: ProblemCardProps) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.035] p-5 transition hover:border-aqua/35">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white">{problem.title}</h3>
          <p className="text-sm text-slate-400">{problem.difficulty}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300">
          <Clock className="h-3.5 w-3.5" />
          {problem.estimated_time}
        </span>
      </div>
      <p className="mb-4 line-clamp-4 text-sm leading-6 text-slate-300">{problem.statement}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {problem.required_topics.slice(0, 5).map((topic) => (
          <SkillBadge key={topic} label={topic.replace("_", " ")} active />
        ))}
      </div>
      {onAnalyze ? (
        <button
          onClick={() => onAnalyze(problem)}
          className="inline-flex items-center rounded-md bg-aqua px-3 py-2 text-sm font-bold text-ink transition hover:bg-mint"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze
        </button>
      ) : null}
    </article>
  );
}
