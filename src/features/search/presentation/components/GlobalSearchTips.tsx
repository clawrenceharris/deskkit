"use client";

import { useEffect, useState } from "react";

const tips = [
  "Type Desk name / Notebook name to search inside a desk.",
  "Use arrow keys to focus any suggestion, then press Tab to complete it.",
  "Recent searches appear first when the search box is empty.",
  "Desk-scoped search is ready for chalkboards and study rooms as those records are added.",
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function GlobalSearchTips() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const interval = window.setInterval(() => {
      setTipIndex((current) => (current + 1) % tips.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      key={tipIndex}
      className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-300"
    >
      <span className="font-bold text-primary">Tip:</span>{" "}
      <span>{tips[tipIndex]}</span>
    </span>
  );
}
