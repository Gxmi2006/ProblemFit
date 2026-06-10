import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Problem } from "../types";
import { ProblemCard } from "../components/ProblemCard";
import { LoadingState } from "../components/LoadingState";
import { getProfile, rememberAnalysis } from "../utils/storage";

const difficulties = ["All", "Beginner", "Easy", "Medium", "Hard"];
const PAGE_SIZE = 48;

export function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [difficulty, setDifficulty] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.problems().then(setProblems).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => problems.filter((problem) => difficulty === "All" || problem.difficulty === difficulty), [problems, difficulty]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleProblems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [difficulty]);

  const analyze = async (problem: Problem) => {
    const profile = getProfile();
    const result = await api.analyze(problem.statement, profile.known_topics, profile.preferred_language ?? "Python");
    rememberAnalysis(problem.statement, result);
    navigate("/result");
  };

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading original problem database" /></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-aqua">Built-in problems</p>
          <h1 className="mt-2 font-display text-4xl font-black text-white">{problems.length} original practice problems.</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">Use the built-in database for demos, testing, and the similarity layer. No protected platform statements are copied.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((item) => (
            <button
              key={item}
              onClick={() => setDifficulty(item)}
              className={`rounded-md border px-3 py-2 text-sm font-bold ${difficulty === item ? "border-aqua bg-aqua text-ink" : "border-white/10 text-slate-300 hover:border-aqua/50"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <span>
          Showing {visibleProblems.length} of {filtered.length} problems
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-md border border-white/10 px-3 py-2 font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <span className="rounded-md border border-white/10 px-3 py-2 text-white">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-white/10 px-3 py-2 font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleProblems.map((problem) => <ProblemCard key={problem.id} problem={problem} onAnalyze={analyze} />)}
      </div>
    </main>
  );
}
