import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FlaskConical, Loader2 } from "lucide-react";
import { api } from "../services/api";
import type { EvaluationResult } from "../types";
import { AccuracyMetricCard } from "../components/AccuracyMetricCard";
import { GlowCard } from "../components/GlowCard";
import { EmptyState } from "../components/EmptyState";
import { SkillBadge } from "../components/SkillBadge";

export function AccuracyLabPage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await api.evaluate());
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.topic_breakdown.slice().sort((a, b) => a.f1 - b.f1).slice(0, 12) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-aqua">Accuracy Lab</p>
          <h1 className="mt-2 font-display text-4xl font-black text-white">Measure analyzer quality.</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">Runs the analyzer against original labeled problems and calculates precision, recall, F1, exact match, false positives, and misses.</p>
        </div>
        <button onClick={run} disabled={loading} className="inline-flex items-center rounded-md bg-aqua px-5 py-3 font-bold text-ink transition hover:bg-mint disabled:opacity-60">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FlaskConical className="mr-2 h-5 w-5" />}
          Run Evaluation
        </button>
      </div>
      {!result ? (
        <EmptyState title="Evaluation not run yet" body="Run Evaluation to calculate real metrics from the built-in labeled test set." />
      ) : (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <AccuracyMetricCard label="Total test problems" value={String(result.total_problems)} detail="Original labeled problems" />
            <AccuracyMetricCard label="Precision" value={result.precision} detail="How often predicted topics are correct" />
            <AccuracyMetricCard label="Recall" value={result.recall} detail="How many expected topics were found" />
            <AccuracyMetricCard label="F1 score" value={result.f1} detail="Balance of precision and recall" />
            <AccuracyMetricCard label="Exact match" value={result.exact_match_rate} detail="Whole-label set match rate" />
          </section>
          <GlowCard>
            <h2 className="mb-4 font-display text-xl font-bold text-white">Weak Topics To Improve</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                  <XAxis dataKey="topic" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={90} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#09111f", border: "1px solid rgba(148,163,184,0.18)" }} />
                  <Bar dataKey="f1" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
          <section className="grid gap-6 lg:grid-cols-2">
            <GlowCard>
              <h2 className="mb-4 font-display text-xl font-bold text-white">Common Misses</h2>
              <div className="flex flex-wrap gap-2">
                {result.missed_topics.length ? result.missed_topics.map((item) => <SkillBadge key={item.topic} label={`${item.topic.replace("_", " ")} x${item.count}`} />) : <span className="text-sm text-slate-400">No misses in this run.</span>}
              </div>
            </GlowCard>
            <GlowCard>
              <h2 className="mb-4 font-display text-xl font-bold text-white">False Positives</h2>
              <div className="flex flex-wrap gap-2">
                {result.false_positives.length ? result.false_positives.map((item) => <SkillBadge key={item.topic} label={`${item.topic.replace("_", " ")} x${item.count}`} />) : <span className="text-sm text-slate-400">No false positives in this run.</span>}
              </div>
            </GlowCard>
          </section>
        </div>
      )}
    </main>
  );
}
