import type { ReactNode } from "react";

export function DashboardStatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-aqua/30 bg-aqua/10 text-aqua">{icon}</div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
