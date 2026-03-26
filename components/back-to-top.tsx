"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // Calculate scroll progress
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      setScrollProgress(scrolled);

      // Show button after 400px
      if (winScroll > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    
    // Initial check
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate SVG circle dash offset based on progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      )}
    >
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center p-3 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--aduti-primary)] focus:ring-offset-2"
        aria-label="Retour en haut"
      >
        {/* Abstract Glow Effect behind button */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--aduti-primary)]/20 to-[var(--aduti-secondary)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 transform"
          viewBox="0 0 50 50"
        >
          {/* Background Ring */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="3"
            fill="none"
          />
          {/* Progress Ring */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            className="stroke-[var(--aduti-primary)] transition-all duration-150 ease-out"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Icon */}
        <div className="relative z-10 w-10 h-10 bg-slate-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center transition-colors">
          <ArrowUp className="w-5 h-5 text-slate-600 group-hover:text-[var(--aduti-primary)] transition-colors group-hover:animate-bounce" />
        </div>
      </button>
    </div>
  );
}
