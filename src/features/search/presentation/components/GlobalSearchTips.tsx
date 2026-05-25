"use client";

import { useEffect, useState } from "react";

const tips = [
  <span key="1">Type <span className="font-bold text-foreground">Desk name </span> <span className="font-bold">/</span> <span className="font-bold text-foreground">Notebook name</span> to search for Notebooks inside a Desk.</span>,
  <span key="2">Press <kbd className="border border-muted-foreground rounded-md px-1 py-0.5 text-primary">Tab</kbd> to auto-fill on a selected search result.</span>,
  <span key="3">Recent searches appear first when the search box is empty.</span>,
  <span key="4">Search inside a Desk to find chalkboards, notebooks and people</span>,
  <span key="5">Type <span className="font-bold text-foreground">User&apos;s name</span> to search for People inside a Desk.</span>,

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
      className="inline-block "
    >
      <span className="font-bold text-primary">Tip:</span>{" "}
      <span className="animate-in fade-in slide-in-from-bottom-1 duration-300">{tips[tipIndex]}</span>
    </span>
  );
}
