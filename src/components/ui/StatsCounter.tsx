"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeIn } from "./FadeIn";

const stats = [
  {
    value: 573,
    suffix: "",
    label: "Sondages géoréférencés",
    tag: "/ ATLAS",
    accentClass: "text-cyan",
  },
  {
    value: 56600,
    suffix: " km²",
    label: "Couverts par modélisation",
    tag: "/ GÉOLOGIE",
    accentClass: "text-atlas",
  },
  {
    value: 29407,
    suffix: "",
    label: "Mailles prédictives",
    tag: "/ KRIGEAGE",
    accentClass: "text-cyan",
  },
  {
    value: 3,
    suffix: "",
    label: "Produits deeptech déployés",
    tag: "/ ÉCOSYSTÈME",
    accentClass: "text-ignis",
  },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const fps = 60;
    const steps = (duration / 1000) * fps;
    const increment = value / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current += increment;
      if (current >= value || frame >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="py-16 md:py-24 px-8 md:px-12 bg-black text-white border-t border-[#111]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 0.07}
              className={`px-0 md:px-10 py-8 md:py-0 ${
                i > 0 ? "border-t md:border-t-0 md:border-l border-[#1a1a1a]" : ""
              } ${i === 1 ? "md:border-l border-[#1a1a1a]" : ""}`}
            >
              <p
                className={`font-mono text-[9px] tracking-[0.35em] uppercase mb-3 ${stat.accentClass}`}
              >
                {stat.tag}
              </p>
              <p className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white mb-2 leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs md:text-sm text-[#444] leading-relaxed mt-2">
                {stat.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
