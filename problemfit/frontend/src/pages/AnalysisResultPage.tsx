import { Link } from "react-router-dom";
import { AnalysisResultCard } from "../components/AnalysisResultCard";
import { EmptyState } from "../components/EmptyState";
import { getRememberedAnalysis } from "../utils/storage";
import { api } from "../services/api";

export function AnalysisResultPage() {
  const remembered = getRememberedAnalysis();

  if (!remembered) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <EmptyState
          title="No analysis yet"
          body="Run the analyzer first, then your readiness result will appear here."
          action={<Link to="/analyze" className="rounded-md bg-aqua px-4 py-2 font-bold text-ink">Analyze a Problem</Link>}
        />
      </main>
    );
  }

  const save = async () => {
    const title = remembered.analysis.similar_problems[0]?.title ? `Fit check near ${remembered.analysis.similar_problems[0].title}` : "ProblemFit analysis";
    await api.saveAnalysis(title, remembered.problemText, remembered.analysis);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <AnalysisResultCard result={remembered.analysis} onSave={save} />
    </main>
  );
}
