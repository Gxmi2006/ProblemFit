import type { AnalysisResult, DashboardSummary, EvaluationResult, Language, LearningPathResponse, Problem, Profile, SavedAnalysis, Topic } from "../types";
import { DEMO_USER_ID, getProfile, getSavedAnalyses, saveAnalysis as saveLocalAnalysis, saveProfile as saveLocalProfile } from "../utils/storage";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function requestHeaders(init?: RequestInit): HeadersInit {
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string> | undefined) };
  if (init?.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

async function apiFetch<T>(path: string, init?: RequestInit, attempt = 0): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: requestHeaders(init),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    const method = init?.method ?? "GET";
    if (attempt < 1 && method === "GET") {
      await wait(1200);
      return apiFetch<T>(path, init, attempt + 1);
    }
    throw error;
  }
}

export const api = {
  health: () => apiFetch<{ status: string; database: string; demo_mode: boolean }>("/api/health"),
  topics: () => apiFetch<Topic[]>("/api/topics"),
  problems: () => apiFetch<Problem[]>("/api/problems"),
  problem: (id: string) => apiFetch<Problem>(`/api/problems/${id}`),
  saveProfile: async (known_topics: string[], preferred_language: Language = "Python") => {
    const local = saveLocalProfile(known_topics, preferred_language);
    try {
      return await apiFetch<Profile>("/api/profile", {
        method: "POST",
        body: JSON.stringify({ user_id: DEMO_USER_ID, known_topics, preferred_language }),
      });
    } catch {
      return local;
    }
  },
  getProfile: async () => {
    try {
      return await apiFetch<Profile>(`/api/profile/${DEMO_USER_ID}`);
    } catch {
      return getProfile();
    }
  },
  analyze: (problem_text: string, known_topics: string[], language: Language) =>
    apiFetch<AnalysisResult>("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ problem_text, known_topics, language }),
    }),
  saveAnalysis: async (title: string, problem_text: string, analysis: AnalysisResult) => {
    const local = saveLocalAnalysis(title, problem_text, analysis);
    try {
      return await apiFetch<SavedAnalysis>("/api/save-analysis", {
        method: "POST",
        body: JSON.stringify({ user_id: DEMO_USER_ID, title, problem_text, analysis }),
      });
    } catch {
      return local;
    }
  },
  savedAnalyses: async () => {
    try {
      const remote = await apiFetch<SavedAnalysis[]>(`/api/saved-analyses/${DEMO_USER_ID}`);
      const local = getSavedAnalyses();
      const byId = new Map([...remote, ...local].map((item) => [item.id, item]));
      return Array.from(byId.values()).sort((a, b) => b.created_at.localeCompare(a.created_at));
    } catch {
      return getSavedAnalyses();
    }
  },
  learningPath: () => apiFetch<LearningPathResponse>(`/api/learning-path/${DEMO_USER_ID}`),
  dashboard: async () => {
    try {
      return await apiFetch<DashboardSummary>(`/api/dashboard/${DEMO_USER_ID}`);
    } catch {
      const profile = getProfile();
      const saved = getSavedAnalyses();
      return {
        known_topics: profile.known_topics,
        coverage: profile.known_topics.length / 33,
        level_breakdown: {},
        recent_analyses: saved.slice(0, 5),
        saved_count: saved.length,
        top_blockers: [],
        close_problems: [],
        confidence_summary: { high: 0, medium: 0, low: 0 },
      } satisfies DashboardSummary;
    }
  },
  evaluate: () => apiFetch<EvaluationResult>("/api/evaluate-analyzer"),
};
