import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingTopicBadge } from "./FloatingTopicBadge";

const INTRO_KEY = "problemfit_intro_seen";
const topics = ["Arrays", "Recursion", "Hash Maps", "Graphs", "DP"];

export function AnimatedIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(INTRO_KEY);
    if (seen) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      localStorage.setItem(INTRO_KEY, "true");
      setVisible(false);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, []);

  const skip = () => {
    localStorage.setItem(INTRO_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ink"
        >
          <div className="absolute inset-0 bg-radial-field" />
          <div className="grid-bg absolute inset-0 opacity-70" />
          <button
            onClick={skip}
            className="absolute right-5 top-5 rounded-md border border-white/15 px-3 py-2 text-sm text-slate-300 transition hover:border-aqua/60 hover:text-white"
          >
            Skip
          </button>
          <div className="relative flex w-full max-w-xl flex-col items-center px-6 text-center">
            <div className="mb-8 flex w-full justify-between gap-2">
              {topics.map((topic, index) => (
                <FloatingTopicBadge key={topic} label={topic} index={index} />
              ))}
            </div>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55 }}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-aqua/40 bg-aqua/10 text-xl font-black text-aqua shadow-glow"
            >
              PF
            </motion.div>
            <h1 className="font-display text-4xl font-black tracking-normal text-white">ProblemFit</h1>
            <p className="mt-3 text-sm font-medium text-slate-300">Mapping your skills...</p>
            <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.45, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-aqua via-skyfire to-iris"
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
