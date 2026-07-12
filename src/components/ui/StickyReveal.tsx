"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  tag: string;
  image: string;
  description?: string;
}

interface StickyRevealProps {
  products: Product[];
}

const accentMap: Record<string, { text: string; border: string; bar: string; dot: string }> = {
  lcpi: { text: "text-cyan", border: "border-cyan/30", bar: "bg-cyan", dot: "bg-cyan" },
  atlas: { text: "text-atlas", border: "border-atlas/30", bar: "bg-atlas", dot: "bg-atlas" },
  ignis: { text: "text-ignis", border: "border-ignis/30", bar: "bg-ignis", dot: "bg-ignis" },
};

function ProductCard({
  product,
  index,
  total,
}: {
  product: Product;
  index: number;
  total: number;
}) {
  const colors = accentMap[product.id] || {
    text: "text-white",
    border: "border-white/20",
    bar: "bg-white",
    dot: "bg-white",
  };

  return (
    <div className="relative w-screen h-full flex-shrink-0 flex flex-col md:flex-row items-stretch">
      {/* Left — Mockup image */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-6 md:p-16 bg-[#060606]">
        <div
          className={cn(
            "relative w-full h-full max-w-xl max-h-[560px] bg-[#0d0d0d] border overflow-hidden",
            colors.border
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3 md:p-5"
            priority={index === 0}
          />

          {/* Terminal overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
            <div className="font-mono text-[9px] tracking-[0.18em] text-[#3a3a3a] uppercase">
              <div className="flex justify-between mb-2">
                <span>SYSTEM_STATUS</span>
                <span className={colors.text}>ACTIVE</span>
              </div>
              <div className="w-full bg-[#111] h-[2px] overflow-hidden">
                <motion.div
                  className={cn("h-full", colors.bar)}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span>VALIDATION</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Content */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-6 md:p-16 lg:p-20 bg-white">
        <p className={cn("font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-6", colors.text)}>
          {product.tag}
        </p>
        <h2 className="text-5xl md:text-8xl lg:text-[120px] xl:text-[150px] font-medium tracking-tighter leading-none text-black mb-6 md:mb-8">
          {product.name}
        </h2>
        <p className="text-sm md:text-base text-[#666] leading-relaxed max-w-md">
          {product.description}
        </p>

        {/* Progress dots */}
        <div className="mt-10 md:mt-14 flex items-center gap-3">
          {Array.from({ length: total }).map((_, j) => (
            <div
              key={j}
              className={cn(
                "h-[2px] transition-all duration-500",
                j === index ? cn("w-10", colors.bar) : "w-4 bg-[#ddd]"
              )}
            />
          ))}
          <span className="ml-4 font-mono text-[9px] tracking-[0.2em] text-[#ccc] uppercase">
            / 0{index + 1}
          </span>
        </div>
      </div>
    </div>
  );
}

/* Desktop — True horizontal scroll-jacking */
function DesktopReveal({ products }: StickyRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(products.length - 1) * vw]
  );

  return (
    <div
      ref={containerRef}
      style={{ height: `${products.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x: translateX, width: `${products.length * 100}vw` }}
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              total={products.length}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* Mobile — Vertical stack */
function MobileReveal({ products }: StickyRevealProps) {
  return (
    <div className="bg-white">
      {products.map((product, i) => {
        const colors = accentMap[product.id] || {
          text: "text-white",
          border: "border-white/20",
          bar: "bg-white",
          dot: "bg-white",
        };
        return (
          <div key={product.id} className="border-b border-[#eee]">
            <div className="relative w-full h-64 bg-[#060606] overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
            </div>
            <div className="px-6 py-10">
              <p className={cn("font-mono text-[9px] tracking-[0.3em] uppercase mb-3", colors.text)}>
                {product.tag}
              </p>
              <h2 className="text-5xl font-medium tracking-tighter text-black mb-4">
                {product.name}
              </h2>
              <p className="text-sm text-[#666] leading-relaxed">{product.description}</p>
              <div className="mt-6 flex items-center gap-2">
                {products.map((_, j) => (
                  <div key={j} className={cn("h-[2px]", j === i ? cn("w-8", colors.bar) : "w-3 bg-[#ddd]")} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StickyReveal({ products }: StickyRevealProps) {
  return (
    <>
      <div className="hidden md:block">
        <DesktopReveal products={products} />
      </div>
      <div className="md:hidden">
        <MobileReveal products={products} />
      </div>
    </>
  );
}
