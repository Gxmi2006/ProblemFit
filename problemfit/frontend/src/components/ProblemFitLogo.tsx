import { motion } from "framer-motion";

type ProblemFitLogoProps = {
  size?: "sm" | "lg";
};

export function ProblemFitLogo({ size = "lg" }: ProblemFitLogoProps) {
  const box = size === "lg" ? "h-28 w-28 md:h-32 md:w-32" : "h-10 w-10";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={`relative ${box}`}
    >
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10%] rounded-full bg-[conic-gradient(from_90deg,transparent,rgba(45,212,191,0.42),rgba(139,92,246,0.28),transparent)] blur-sm"
      />
      <div className="absolute inset-0 rounded-[30%] border border-aqua/45 bg-gradient-to-br from-aqua/18 via-skyfire/10 to-iris/18 shadow-glow backdrop-blur-xl [clip-path:polygon(50%_0%,93%_25%,93%_75%,50%_100%,7%_75%,7%_25%)]" />
      <div className="absolute inset-[11%] rounded-[28%] border border-white/15 bg-ink/72 [clip-path:polygon(50%_0%,93%_25%,93%_75%,50%_100%,7%_75%,7%_25%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 120 120" role="img" aria-label="ProblemFit logo">
        <defs>
          <linearGradient id="pf-path" x1="20" x2="100" y1="100" y2="20">
            <stop stopColor="#2dd4bf" />
            <stop offset="0.55" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="pf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M31 75 C43 47 55 86 69 51 C77 30 90 38 96 28"
          fill="none"
          stroke="url(#pf-path)"
          strokeLinecap="round"
          strokeWidth="5"
          filter="url(#pf-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.35, ease: "easeInOut" }}
        />
        {[31, 55, 69, 96].map((x, index) => {
          const y = [75, 70, 51, 28][index];
          return (
            <motion.circle
              key={x}
              cx={x}
              cy={y}
              r="4.5"
              fill={index % 2 ? "#38bdf8" : "#2dd4bf"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [1, 1.18, 1] }}
              transition={{ delay: 0.32 + index * 0.13, duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
            />
          );
        })}
        <text x="60" y="89" textAnchor="middle" className="fill-white font-display text-[22px] font-black tracking-normal">
          PF
        </text>
      </svg>
      <motion.div
        aria-hidden
        animate={{ opacity: [0.3, 0.75, 0.3], scale: [0.92, 1.05, 0.92] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[31%] rounded-full bg-aqua/20 blur-md"
      />
    </motion.div>
  );
}
