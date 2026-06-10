import { Lock, Sparkles, CheckCircle2 } from "lucide-react";
import type { Topic } from "../types";

type RoadmapGroup = {
  group: string;
  items: Array<Topic & { status: "known" | "learning" | "locked"; recommended_problems: Array<{ id: string; title: string; difficulty: string }> }>;
};

const iconFor = {
  known: CheckCircle2,
  learning: Sparkles,
  locked: Lock,
};

export function LearningRoadmap({ groups }: { groups: RoadmapGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.group}>
          <h2 className="mb-4 font-display text-xl font-bold text-white">{group.group}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {group.items.map((item) => {
              const Icon = iconFor[item.status];
              const tone =
                item.status === "known"
                  ? "border-aqua/40 bg-aqua/10 text-aqua"
                  : item.status === "learning"
                    ? "border-ember/40 bg-ember/10 text-amber-200"
                    : "border-white/10 bg-white/[0.035] text-slate-500";
              return (
                <article key={item.id} className={`rounded-md border p-4 ${tone}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-white">{item.display_name}</h3>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item.explanation}</p>
                  <p className="mt-3 text-xs uppercase text-slate-500">{item.status}</p>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
