import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { api } from "../services/api";
import type { SavedAnalysis } from "../types";
import { EmptyState } from "../components/EmptyState";
import { ReadinessMeter } from "../components/ReadinessMeter";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { SkillBadge } from "../components/SkillBadge";
import { removeSavedAnalysis, rememberAnalysis } from "../utils/storage";

export function SavedProblemsPage() {
  const [items, setItems] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    api.savedAnalyses().then(setItems);
  }, []);

  const remove = (id: string) => setItems(removeSavedAnalysis(id));

  if (!items.length) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <EmptyState
          title="No saved analyses"
          body="Save a readiness result after analyzing a problem and it will show up here."
          action={<Link to="/analyze" className="rounded-md bg-aqua px-4 py-2 font-bold text-ink">Analyze a Problem</Link>}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-aqua">Saved problems</p>
        <h1 className="mt-2 font-display text-4xl font-black text-white">Reopen previous fit checks.</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="glass grid gap-4 rounded-md p-5 sm:grid-cols-[120px_1fr]">
            <ReadinessMeter score={item.analysis.readiness_score} size={112} />
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <ConfidenceBadge confidence={item.analysis.overall_confidence} />
                <span className="text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <h2 className="font-display text-xl font-bold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.analysis.estimated_difficulty} · {item.analysis.estimated_time}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.analysis.missing_topics.slice(0, 4).map((topic) => <SkillBadge key={topic} label={topic.replace("_", " ")} />)}
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/result"
                  onClick={() => rememberAnalysis(item.problem_text, item.analysis)}
                  className="rounded-md bg-aqua px-3 py-2 text-sm font-bold text-ink"
                >
                  Reopen
                </Link>
                <button onClick={() => remove(item.id)} className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-coral/50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
