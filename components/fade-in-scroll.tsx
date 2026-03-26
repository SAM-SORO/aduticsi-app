"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export function FadeInScroll({ children, delay = 0, duration = 0.6, className = "" }: FadeInScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
