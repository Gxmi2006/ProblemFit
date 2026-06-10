import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { LearningPathResponse } from "../types";
import { LearningRoadmap } from "../components/LearningRoadmap";
import { LoadingState } from "../components/LoadingState";
import { SkillConstellation } from "../components/SkillConstellation";

export function LearningPathPage() {
  const [path, setPath] = useState<LearningPathResponse | null>(null);

  useEffect(() => {
    api.learningPath().then(setPath);
  }, []);

  if (!path) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading roadmap" /></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-aqua">Learning path</p>
          <h1 className="mt-2 font-display text-4xl font-black text-white">A roadmap from basics to dynamic programming.</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">{path.known_count} of {path.total_topics} topics are marked known. Locked topics open when prerequisites are covered.</p>
        </div>
        <SkillConstellation />
      </div>
      <LearningRoadmap groups={path.groups} />
    </main>
  );
}
