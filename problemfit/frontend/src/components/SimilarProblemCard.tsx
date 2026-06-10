import type { SimilarProblem } from "../types";
import { SkillBadge } from "./SkillBadge";

export function SimilarProblemCard({ problem }: { problem: SimilarProblem }) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">{problem.title}</h3>
          <p className="text-sm text-slate-400">{problem.difficulty}</p>
        </div>
        <span className="rounded-md bg-skyfire/10 px-2.5 py-1 text-sm font-bold text-sky-200">{Math.round(problem.similarity * 100)}%</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {problem.topics.slice(0, 4).map((topic) => (
          <SkillBadge key={topic} label={topic.replace("_", " ")} />
        ))}
      </div>
    </article>
  );
}
