import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { api } from "../services/api";
import type { Topic } from "../types";
import { TopicSelector } from "../components/TopicSelector";
import { GlowCard } from "../components/GlowCard";
import { LoadingState } from "../components/LoadingState";
import { getProfile } from "../utils/storage";
import { ONBOARDING_KEY } from "./OnboardingPage";

export function SkillProfilePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<string[]>(() => getProfile().known_topics);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .topics()
      .then(setTopics)
      .finally(() => setLoading(false));
  }, []);

  const completeness = useMemo(() => Math.round((selected.length / Math.max(1, topics.length)) * 100), [selected.length, topics.length]);

  const save = async () => {
    await api.saveProfile(selected, getProfile().preferred_language ?? "Python");
    localStorage.setItem(ONBOARDING_KEY, "true");
    setSaved(true);
    window.setTimeout(() => navigate("/analyze"), 450);
  };

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading topics" /></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-bold uppercase text-aqua">Skill profile</p>
          <h1 className="mt-2 font-display text-4xl font-black text-white">Select what you already know.</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">ProblemFit uses this profile to separate a hard problem from a problem with one missing prerequisite.</p>
        </div>
        <GlowCard>
          <p className="text-sm text-slate-400">Profile completeness</p>
          <p className="mt-2 font-display text-4xl font-black text-white">{completeness}%</p>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-aqua" style={{ width: `${completeness}%` }} />
          </div>
          <button onClick={save} className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-aqua px-4 py-3 font-bold text-ink transition hover:bg-mint">
            <Save className="mr-2 h-5 w-5" />
            {saved ? "Saved" : "Save & Continue"}
          </button>
        </GlowCard>
      </div>
      <TopicSelector topics={topics} selected={selected} onChange={setSelected} />
    </main>
  );
}
