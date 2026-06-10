import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-md border border-white/10 bg-white/[0.035] text-slate-300">
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-aqua" />
      {label}
    </div>
  );
}
