"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const labels = [
  "CONTINUEZ À DÉFILER",
  "KEEP SCROLLING",
  "CONTINUEZ À DÉFILER",
  "KEEP SCROLLING",
  "CONTINUEZ À DÉFILER",
  "KEEP SCROLLING",
  "CONTINUEZ À DÉFILER",
  "KEEP SCROLLING",
];

export function LandingScrollTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: tickerRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-38%"]);

  return (
    <div ref={tickerRef} className="landing-v14-scroll-ticker" aria-hidden="true">
      <motion.div
        className="landing-v14-scroll-track"
        style={reduceMotion ? undefined : { x }}
      >
        {labels.map((label, index) => (
          <span key={`${label}-${index}`}>
            <span>{label}</span>
            <b>»</b>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
