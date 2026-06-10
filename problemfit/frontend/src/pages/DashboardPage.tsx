import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bookmark, Brain, Gauge, TrendingUp } from "lucide-react";
import { api } from "../services/api";
import type { DashboardSummary } from "../types";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { GlowCard } from "../components/GlowCard";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { SkillBadge } from "../components/SkillBadge";

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.dashboard().then(setDashboard);
  }, []);

  const levelData = useMemo(() => {
    if (!dashboard) return [];
    return Object.entries(dashboard.level_breakdown).map(([level, count]) => ({ level, count }));
  }, [dashboard]);

  if (!dashboard) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Building dashboard" /></main>;

  const coverage = Math.round(dashboard.coverage * 100);
  const confidenceData = Object.entries(dashboard.confidence_summary).map(([name, value]) => ({ name, value }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-aqua">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-black text-white">Your readiness overview.</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="Skill coverage" value={`${coverage}%`} detail={`${dashboard.known_topics.length} known topics`} icon={<Brain className="h-5 w-5" />} />
        <DashboardStatCard label="Saved analyses" value={`${dashboard.saved_count}`} detail="Stored in demo mode and backend" icon={<Bookmark className="h-5 w-5" />} />
        <DashboardStatCard label="Weekly streak" value="3" detail="Placeholder for learning streaks" icon={<TrendingUp className="h-5 w-5" />} />
        <DashboardStatCard label="Analyzer confidence" value={`${dashboard.confidence_summary.high}`} detail="High-confidence saved results" icon={<Gauge className="h-5 w-5" />} />
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlowCard>
          <h2 className="mb-4 font-display text-xl font-bold text-white">Skill Coverage Chart</h2>
          {levelData.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                  <XAxis dataKey="level" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#09111f", border: "1px solid rgba(148,163,184,0.18)" }} />
                  <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No skills selected" body="Build your skill profile to see topic coverage by level." />
          )}
        </GlowCard>
        <GlowCard>
          <h2 className="mb-4 font-display text-xl font-bold text-white">Confidence Summary</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={confidenceData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={entry.name} fill={["#2dd4bf", "#f59e0b", "#fb7185"][index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#09111f", border: "1px solid rgba(148,163,184,0.18)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlowCard>
          <h2 className="mb-4 font-display text-xl font-bold text-white">Topics Blocking You</h2>
          <div className="flex flex-wrap gap-2">
            {dashboard.top_blockers.length ? dashboard.top_blockers.map((item) => <SkillBadge key={item.topic} label={`${item.topic.replace("_", " ")} x${item.count}`} />) : <span className="text-sm text-slate-400">No blockers yet.</span>}
          </div>
        </GlowCard>
        <GlowCard className="lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-bold text-white">Problems You Are Close To Solving</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {dashboard.close_problems.slice(0, 4).map((problem) => (
              <div key={problem.id} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                <p className="font-bold text-white">{problem.title}</p>
                <p className="text-sm text-slate-400">{problem.difficulty}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.missing_topics.map((topic) => <SkillBadge key={topic} label={topic.replace("_", " ")} />)}
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </section>
    </main>
  );
}
