import { motion } from "framer-motion";

const nodes = [
  { label: "Arrays", x: "12%", y: "30%", tone: "bg-aqua" },
  { label: "Hash Maps", x: "34%", y: "18%", tone: "bg-skyfire" },
  { label: "Recursion", x: "62%", y: "32%", tone: "bg-iris" },
  { label: "Graphs", x: "78%", y: "62%", tone: "bg-ember" },
  { label: "DP", x: "46%", y: "70%", tone: "bg-coral" },
];

export function SkillConstellation() {
  return (
    <div className="relative min-h-72 overflow-hidden rounded-md border border-white/10 bg-black/20">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-45">
        <line x1="12%" y1="30%" x2="34%" y2="18%" stroke="rgba(45,212,191,0.45)" />
        <line x1="34%" y1="18%" x2="62%" y2="32%" stroke="rgba(56,189,248,0.4)" />
        <line x1="62%" y1="32%" x2="78%" y2="62%" stroke="rgba(139,92,246,0.4)" />
        <line x1="46%" y1="70%" x2="78%" y2="62%" stroke="rgba(245,158,11,0.36)" />
        <line x1="12%" y1="30%" x2="46%" y2="70%" stroke="rgba(45,212,191,0.28)" />
      </svg>
      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.x, top: node.y }}
        >
          <div className="rounded-md border border-white/15 bg-ink/85 px-3 py-2 shadow-glow">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${node.tone}`} />
            <span className="text-sm font-bold text-white">{node.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
