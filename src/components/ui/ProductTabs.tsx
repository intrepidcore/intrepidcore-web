"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "lcpi", label: "LCPI", activeColor: "text-cyan border-cyan" },
  { id: "atlas", label: "Atlas", activeColor: "text-atlas border-atlas" },
  { id: "ignis", label: "IgnisCore", activeColor: "text-ignis border-ignis" },
  { id: "doctrines", label: "Doctrines", activeColor: "text-white border-white" },
];

const NUM_PRODUCTS = 3;

export function ProductTabs() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("hero");
      const productsEl = document.getElementById("products");
      const doctrinesEl = document.getElementById("doctrines");

      const standardsEl = document.getElementById("standards");
      const heroHeight = heroEl?.offsetHeight ?? window.innerHeight;
      const standardsTop = standardsEl?.offsetTop ?? Infinity;

      const scrollY = window.scrollY;

      const inProductsZone =
        scrollY > heroHeight * 0.8 && scrollY < standardsTop - 60;
      setVisible(inProductsZone);

      if (!productsEl) return;
      const productsTop = productsEl.offsetTop;
      const productsHeight = productsEl.scrollHeight;
      const scrollRange = productsHeight - window.innerHeight;

      if (doctrinesEl && scrollY >= doctrinesEl.offsetTop - 120) {
        setActive(3);
        return;
      }

      if (scrollY >= productsTop && scrollRange > 0) {
        const progress = Math.max(0, Math.min(1, (scrollY - productsTop) / scrollRange));
        const idx = Math.min(NUM_PRODUCTS - 1, Math.floor(progress * NUM_PRODUCTS));
        setActive(idx);
      } else if (scrollY < productsTop) {
        setActive(0);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToProduct = (index: number) => {
    if (index === 3) {
      document.getElementById("doctrines")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const productsEl = document.getElementById("products");
    if (!productsEl) return;
    const scrollRange = productsEl.scrollHeight - window.innerHeight;
    const fraction = index / NUM_PRODUCTS;
    const targetScroll = productsEl.offsetTop + fraction * scrollRange;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-[1280px] mx-auto px-8 md:px-12">
        <div className="flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => scrollToProduct(i)}
              className={cn(
                "flex-shrink-0 px-5 md:px-7 py-3.5 font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase whitespace-nowrap transition-all duration-300 border-b-2",
                i === active
                  ? `${tab.activeColor} opacity-100`
                  : "text-[#3a3a3a] border-transparent hover:text-[#666]"
              )}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex-shrink-0 pl-6 hidden md:flex items-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#2a2a2a] uppercase">
              {active < 3 ? `/ 0${active + 1} — Plateforme` : "/ DOCTRINES"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
