import type { AnalysisResult, Language, Profile, SavedAnalysis } from "../types";

export const DEMO_USER_ID = "demo-user";

const PROFILE_KEY = "problemfit_profile";
const SAVED_KEY = "problemfit_saved_analyses";
const LAST_ANALYSIS_KEY = "problemfit_last_analysis";
const LAST_PROBLEM_KEY = "problemfit_last_problem_text";

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

export function getProfile(): Profile {
  if (!canUseStorage()) return { user_id: DEMO_USER_ID, known_topics: [], preferred_language: "Python" };
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return { user_id: DEMO_USER_ID, known_topics: [], preferred_language: "Python" };
  return JSON.parse(raw) as Profile;
}

export function saveProfile(knownTopics: string[], preferredLanguage: Language = "Python"): Profile {
  const profile: Profile = {
    user_id: DEMO_USER_ID,
    known_topics: Array.from(new Set(knownTopics)).sort(),
    preferred_language: preferredLanguage,
    updated_at: new Date().toISOString(),
  };
  if (canUseStorage()) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function getSavedAnalyses(): SavedAnalysis[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(SAVED_KEY);
  return raw ? (JSON.parse(raw) as SavedAnalysis[]) : [];
}

export function saveAnalysis(title: string, problemText: string, analysis: AnalysisResult): SavedAnalysis {
  const saved: SavedAnalysis = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    user_id: DEMO_USER_ID,
    title,
    problem_text: problemText,
    analysis,
    created_at: new Date().toISOString(),
  };
  const next = [saved, ...getSavedAnalyses()];
  if (canUseStorage()) localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return saved;
}

export function removeSavedAnalysis(id: string): SavedAnalysis[] {
  const next = getSavedAnalyses().filter((item) => item.id !== id);
  if (canUseStorage()) localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
}

export function rememberAnalysis(problemText: string, analysis: AnalysisResult) {
  if (!canUseStorage()) return;
  localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(analysis));
  localStorage.setItem(LAST_PROBLEM_KEY, problemText);
}

export function getRememberedAnalysis(): { problemText: string; analysis: AnalysisResult } | null {
  if (!canUseStorage()) return null;
  const analysis = localStorage.getItem(LAST_ANALYSIS_KEY);
  if (!analysis) return null;
  return {
    problemText: localStorage.getItem(LAST_PROBLEM_KEY) ?? "",
    analysis: JSON.parse(analysis) as AnalysisResult,
  };
}
