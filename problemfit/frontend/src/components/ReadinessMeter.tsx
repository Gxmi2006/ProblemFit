import { motion } from "framer-motion";

export function ReadinessMeter({ score, size = 180 }: { score: number; size?: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone = score >= 85 ? "#2dd4bf" : score >= 65 ? "#38bdf8" : score >= 40 ? "#f59e0b" : "#fb7185";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={tone}
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl font-black text-white">{score}</div>
        <div className="text-xs font-bold uppercase text-slate-400">readiness</div>
      </div>
    </div>
  );
}
