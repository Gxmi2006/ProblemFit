import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { GlowCard } from "../components/GlowCard";
import { HeroSection } from "../components/HeroSection";

const sections = [
  {
    title: "Why Easy is not always easy",
    body: "Difficulty labels hide prerequisites. A learner can know loops and arrays but still get stuck if the problem quietly expects hash maps or sliding windows.",
    icon: ShieldCheck,
  },
  {
    title: "How ProblemFit works",
    body: "Paste a problem, select your known topics, and the analyzer compares rule evidence, local ML signals, tagged examples, and optional structured AI signals.",
    icon: Layers3,
  },
  {
    title: "Multi-layer accuracy engine",
    body: "Each topic gets detector votes, confidence, evidence, and a label. Weak signals are shown as uncertainty instead of being oversold.",
    icon: CheckCircle2,
  },
  {
    title: "Built for learners",
    body: "The result is a readiness score, missing topics, prerequisite gaps, easier problems, and a learning path that meets your current range.",
    icon: Sparkles,
  },
];

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-2">
        {sections.map(({ title, body, icon: Icon }, index) => (
          <GlowCard key={title} delay={index * 0.05}>
            <Icon className="mb-4 h-6 w-6 text-aqua" />
            <h2 className="font-display text-xl font-bold text-white">{title}</h2>
            <p className="mt-3 leading-7 text-slate-400">{body}</p>
          </GlowCard>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="glass rounded-md p-8">
          <p className="text-sm font-bold uppercase text-aqua">Start learning smarter</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-black text-white">Analyze one problem before you spend an hour guessing what you are missing.</h2>
          <Link to="/analyze" className="mt-6 inline-flex items-center rounded-md bg-aqua px-5 py-3 font-bold text-ink transition hover:bg-mint">
            Open Analyzer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
