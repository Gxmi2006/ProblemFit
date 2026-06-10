import { useEffect, useState } from "react";
import { api } from "../services/api";
import { GlowCard } from "../components/GlowCard";
import { getProfile, saveProfile } from "../utils/storage";
import type { Language } from "../types";

const languages: Language[] = ["Python", "C", "Java", "C++", "JavaScript"];

export function SettingsPage() {
  const [health, setHealth] = useState<{ status: string; database: string; demo_mode: boolean } | null>(null);
  const [language, setLanguage] = useState<Language>(getProfile().preferred_language ?? "Python");

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth(null));
  }, []);

  const updateLanguage = (next: Language) => {
    setLanguage(next);
    saveProfile(getProfile().known_topics, next);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-bold uppercase text-aqua">Settings</p>
      <h1 className="mt-2 font-display text-4xl font-black text-white">Demo mode controls.</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlowCard>
          <h2 className="font-display text-xl font-bold text-white">Backend status</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-400">API</dt><dd className="font-bold text-white">{health?.status ?? "offline"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-400">Storage</dt><dd className="font-bold text-white">{health?.database ?? "localStorage fallback"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-400">Auth</dt><dd className="font-bold text-white">{health?.demo_mode ? "demo user" : "configured"}</dd></div>
          </dl>
        </GlowCard>
        <GlowCard>
          <h2 className="font-display text-xl font-bold text-white">Preferred language</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {languages.map((item) => (
              <button
                key={item}
                onClick={() => updateLanguage(item)}
                className={`rounded-md border px-3 py-2 text-sm font-bold ${language === item ? "border-aqua bg-aqua text-ink" : "border-white/10 text-slate-300 hover:border-aqua/50"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </GlowCard>
      </div>
    </main>
  );
}
