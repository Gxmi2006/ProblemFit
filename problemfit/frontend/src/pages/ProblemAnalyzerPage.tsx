import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { api } from "../services/api";
import type { Language, Problem } from "../types";
import { ProblemTextBox } from "../components/ProblemTextBox";
import { GlowCard } from "../components/GlowCard";
import { ProblemCard } from "../components/ProblemCard";
import { getProfile, rememberAnalysis } from "../utils/storage";

const sample = "Given an array of numbers and a target sum, decide whether two numbers can form the target. The input can contain up to 100000 values, so the solution should use fast lookup instead of checking every pair.";
const languages: Language[] = ["Python", "C", "Java", "C++", "JavaScript"];

export function ProblemAnalyzerPage() {
  const [text, setText] = useState(sample);
  const [language, setLanguage] = useState<Language>(getProfile().preferred_language ?? "Python");
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.problems().then((items) => setProblems(items.slice(20, 23))).catch(() => setProblems([]));
  }, []);

  const analyze = async () => {
    if (text.trim().length < 8) return;
    setLoading(true);
    try {
      const profile = getProfile();
      const result = await api.analyze(text, profile.known_topics, language);
      rememberAnalysis(text, result);
      navigate("/result");
    } finally {
      setLoading(false);
    }
  };

  const useProblem = (problem: Problem) => setText(problem.statement);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-aqua">Problem analyzer</p>
        <h1 className="mt-2 font-display text-4xl font-black text-white">Paste a problem and check fit.</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-400">The analyzer looks for concepts, hidden prerequisites, confidence, similar examples, and a readiness score against your saved skill profile.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <GlowCard>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-bold text-white" htmlFor="language">Preferred language</label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-aqua/60"
            >
              {languages.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <ProblemTextBox value={text} onChange={setText} />
          <button
            onClick={analyze}
            disabled={loading || text.trim().length < 8}
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-aqua px-5 py-3 font-bold text-ink transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            Analyze Fit
          </button>
        </GlowCard>
        <aside className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Try original demo problems</h2>
          {problems.map((problem) => <ProblemCard key={problem.id} problem={problem} onAnalyze={useProblem} />)}
        </aside>
      </div>
    </main>
  );
}
