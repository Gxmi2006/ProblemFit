type SkillBadgeProps = {
  label: string;
  active?: boolean;
};

export function SkillBadge({ label, active = false }: SkillBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${
        active ? "border-aqua/40 bg-aqua/10 text-aqua" : "border-white/10 bg-white/[0.04] text-slate-300"
      }`}
    >
      {label}
    </span>
  );
}
