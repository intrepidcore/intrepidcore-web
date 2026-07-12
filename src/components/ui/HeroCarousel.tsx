"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeroCarouselProps {
  images: string[];
  interval?: number;
}

export function HeroCarousel({ images, interval = 4000 }: HeroCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={images[active]}
              alt=""
              fill
              className="object-cover grayscale"
              priority
              style={{ opacity: 0.25 }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-12 left-8 md:left-12 z-20 flex gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-[2px] transition-all duration-500 ${
              idx === active ? "w-8 bg-white" : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
