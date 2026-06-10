import type { DetectedTopic } from "../types";
import { SkillBadge } from "./SkillBadge";

export function TopicEvidenceCard({ topic }: { topic: DetectedTopic }) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">{topic.display_name}</h3>
          <p className="text-xs uppercase tracking-normal text-slate-500">{topic.label.replace("_", " ")}</p>
        </div>
        <span className="rounded-md border border-aqua/30 bg-aqua/10 px-2.5 py-1 text-sm font-bold text-aqua">{Math.round(topic.confidence * 100)}%</span>
      </div>
      <p className="mb-3 text-sm leading-6 text-slate-300">{topic.reason}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {topic.votes.map((vote) => (
          <SkillBadge key={vote} label={vote.replace("_", " ")} active />
        ))}
      </div>
      <ul className="space-y-2 text-sm text-slate-400">
        {topic.evidence.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
