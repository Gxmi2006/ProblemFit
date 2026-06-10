import { GlowCard } from "../components/GlowCard";

export function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-bold uppercase text-aqua">About</p>
      <h1 className="mt-2 font-display text-4xl font-black text-white">ProblemFit is a readiness engine, not a coding-platform clone.</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlowCard>
          <h2 className="font-display text-xl font-bold text-white">No scraped statements</h2>
          <p className="mt-3 leading-7 text-slate-400">Users paste their own problems, and the demo database contains original educational problems created for this app.</p>
        </GlowCard>
        <GlowCard>
          <h2 className="font-display text-xl font-bold text-white">Honest confidence</h2>
          <p className="mt-3 leading-7 text-slate-400">The analyzer shows votes, evidence, missing topics, and uncertainty instead of pretending every detection is perfect.</p>
        </GlowCard>
        <GlowCard>
          <h2 className="font-display text-xl font-bold text-white">Demo mode first</h2>
          <p className="mt-3 leading-7 text-slate-400">Clerk, MongoDB, Sentry, and optional AI can be configured through environment variables, but none are required locally.</p>
        </GlowCard>
        <GlowCard>
          <h2 className="font-display text-xl font-bold text-white">Accuracy is testable</h2>
          <p className="mt-3 leading-7 text-slate-400">The Accuracy Lab computes metrics from labels, so improvements can be measured rather than guessed.</p>
        </GlowCard>
      </div>
    </main>
  );
}
