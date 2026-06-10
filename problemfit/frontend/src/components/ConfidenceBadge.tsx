export function ConfidenceBadge({ confidence }: { confidence: string }) {
  const tone =
    confidence === "high"
      ? "border-aqua/40 bg-aqua/10 text-aqua"
      : confidence === "medium"
        ? "border-ember/40 bg-ember/10 text-amber-200"
        : "border-coral/40 bg-coral/10 text-rose-200";
  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${tone}`}>{confidence}</span>;
}
