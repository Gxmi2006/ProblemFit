import type { ReactNode } from "react";
import { motion } from "framer-motion";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function GlowCard({ children, className = "", delay = 0 }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`glass rounded-md p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
