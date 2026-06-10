import { Check } from "lucide-react";
import type { Topic } from "../types";

type TopicSelectorProps = {
  topics: Topic[];
  selected: string[];
  onChange: (topicIds: string[]) => void;
};

export function TopicSelector({ topics, selected, onChange }: TopicSelectorProps) {
  const selectedSet = new Set(selected);
  const groups = topics.reduce<Record<string, Topic[]>>((acc, topic) => {
    acc[topic.category] = [...(acc[topic.category] ?? []), topic];
    return acc;
  }, {});

  const toggle = (topicId: string) => {
    const next = selectedSet.has(topicId) ? selected.filter((item) => item !== topicId) : [...selected, topicId];
    onChange(next);
  };

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, groupTopics]) => (
        <section key={group}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-white">{group}</h2>
            <span className="text-xs text-slate-400">{groupTopics.filter((topic) => selectedSet.has(topic.id)).length}/{groupTopics.length}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groupTopics.map((topic) => {
              const active = selectedSet.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggle(topic.id)}
                  className={`min-h-32 rounded-md border p-4 text-left transition ${
                    active ? "border-aqua/55 bg-aqua/10 shadow-glow" : "border-white/10 bg-white/[0.035] hover:border-white/25"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-bold text-white">{topic.display_name}</span>
                    <span className={`grid h-6 w-6 place-items-center rounded-md border ${active ? "border-aqua bg-aqua text-ink" : "border-white/15 text-transparent"}`}>
                      <Check className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{topic.explanation}</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
