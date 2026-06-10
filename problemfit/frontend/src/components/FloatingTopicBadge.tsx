import { motion } from "framer-motion";

type FloatingTopicBadgeProps = {
  label: string;
  index?: number;
};

export function FloatingTopicBadge({ label, index = 0 }: FloatingTopicBadgeProps) {
  return (
    <motion.span
      animate={{ y: [0, -8, 0], opacity: [0.78, 1, 0.78] }}
      transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex rounded-md border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-100 shadow-glow"
    >
      {label}
    </motion.span>
  );
}
