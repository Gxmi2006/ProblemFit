export function AccuracyMetricCard({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  const display = typeof value === "number" ? `${Math.round(value * 100)}%` : value;
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-black text-white">{display}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
