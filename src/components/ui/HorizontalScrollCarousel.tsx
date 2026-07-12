"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CarouselItem {
  title: string;
  description: string;
  progress: number;
  metrics: string[];
  image?: string;
}

interface HorizontalScrollCarouselProps {
  items: CarouselItem[];
  title: string;
  subtitle?: string;
}

const accentMap: Record<string, { text: string; border: string; bar: string }> = {
  "Auditabilité Totale": { text: "text-cyan", border: "border-cyan/40", bar: "bg-cyan" },
  "Ancrage Local": { text: "text-atlas", border: "border-atlas/40", bar: "bg-atlas" },
  "Rigueur Mathématique": { text: "text-ignis", border: "border-ignis/40", bar: "bg-ignis" },
};

export function HorizontalScrollCarousel({ items, title, subtitle }: HorizontalScrollCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[active];
  const colors = accentMap[item.title] || { text: "text-white", border: "border-[#333]", bar: "bg-white" };

  return (
    <section className="relative bg-black text-white py-28 md:py-40 px-8 md:px-12 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          {subtitle && (
            <p className="font-mono text-xs tracking-[0.25em] text-[#666] uppercase mb-3">{subtitle}</p>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white">{title}</h2>
        </div>

        {/* Carousel viewport */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "w-full bg-[#0A0A0A] border p-0 overflow-hidden",
                colors.border
              )}
            >
              {/* Image top */}
              <div className="relative w-full h-56 md:h-72 overflow-hidden border-b border-[#222]">
                {item.image ? (
                  <Image src={item.image} alt="" fill className="object-cover opacity-50 grayscale" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <p className={cn("font-mono text-xs tracking-[0.2em] uppercase mb-4", colors.text)}>
                  {`/ 0.${active + 1}`}
                </p>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-[#666] leading-relaxed max-w-2xl">
                  {item.description}
                </p>

                {/* Terminal progress bar */}
                <div className="mt-8 space-y-3">
                  <div className="flex gap-3 flex-wrap">
                    {item.metrics.map((m, idx) => (
                      <span key={idx} className="font-mono text-[10px] tracking-wider text-[#444] uppercase border border-[#222] px-2.5 py-1">
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="w-full bg-black h-[6px] border border-[#222] overflow-hidden">
                    <motion.div
                      key={`bar-${active}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn("h-full", colors.bar)}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.15em] text-[#444] uppercase">
                    <span>VALIDATION</span>
                    <span>{item.progress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex justify-center gap-3 mt-10">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={cn(
                  "h-1.5 transition-all duration-300",
                  idx === active ? "w-10 bg-white" : "w-4 bg-[#333] hover:bg-[#555]"
                )}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
