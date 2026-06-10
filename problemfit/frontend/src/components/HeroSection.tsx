import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Gauge, Layers3, Route } from "lucide-react";
import { FloatingTopicBadge } from "./FloatingTopicBadge";
import { ReadinessMeter } from "./ReadinessMeter";
import { SkillConstellation } from "./SkillConstellation";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pt-16">
      <div>
        <div className="mb-5 flex flex-wrap gap-2">
          {["Rule evidence", "TF-IDF similarity", "Honest confidence"].map((label, index) => (
            <FloatingTopicBadge key={label} label={label} index={index} />
          ))}
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-balance font-display text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
        >
          Know if a coding problem is really for your current level.
        </motion.h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          ProblemFit analyzes the concepts behind a problem, compares them with your current skills, and shows your readiness score,
          missing topics, confidence level, and the best path to become ready.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/analyze" className="inline-flex items-center rounded-md bg-aqua px-5 py-3 font-bold text-ink shadow-glow transition hover:bg-mint">
            Analyze a Problem
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/skills" className="inline-flex items-center rounded-md border border-white/15 px-5 py-3 font-bold text-white transition hover:border-aqua/50">
            Build My Skill Profile
          </Link>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }} className="glass rounded-md p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-aqua">Live analysis preview</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">Target Locker Pair</h2>
          </div>
          <ReadinessMeter score={72} size={118} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Layers3, label: "Required topics", value: "Arrays, Hash Maps" },
            { icon: Gauge, label: "Detector confidence", value: "High, 2 layer vote" },
            { icon: Brain, label: "Missing topic", value: "Hash maps" },
            { icon: Route, label: "Next step", value: "Fast lookup practice" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
              <Icon className="mb-3 h-5 w-5 text-aqua" />
              <p className="text-xs uppercase text-slate-500">{label}</p>
              <p className="mt-1 font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <SkillConstellation />
        </div>
      </motion.div>
    </section>
  );
}
