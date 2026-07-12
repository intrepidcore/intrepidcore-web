"use client";

import { FadeIn } from "./FadeIn";

const testimonials = [
  {
    quote:
      "IntrepidCore représente exactement le type de solution deeptech dont l'Afrique de l'Ouest a besoin pour réduire sa dépendance aux bureaux d'études étrangers.",
    author: "Direction Technique",
    org: "Bureau d'études — Lomé, Togo",
    tag: "Génie Civil",
  },
  {
    quote:
      "La rigueur du moteur de dimensionnement LCPI nous a permis de valider nos hypothèses hydrauliques en quelques minutes, contre plusieurs jours avec les méthodes manuelles.",
    author: "Ingénieur Senior",
    org: "Infrastructure AEP — Bénin",
    tag: "Hydraulique",
  },
  {
    quote:
      "Le modèle krigeage d'Atlas sur les zones sédimentaires du bassin Lama dépasse en précision tout ce que nous avions utilisé jusqu'à présent pour la prospection géotechnique.",
    author: "Géotechnicien",
    org: "Projet Fondation — Côte d'Ivoire",
    tag: "Géostatistique",
  },
  {
    quote:
      "Un écosystème scientifique cohérent. Pour la première fois, nos rapports structuraux et hydrauliques sont générés depuis la même source de vérité — auditée et traçable.",
    author: "Chef de Projet",
    org: "Ministère des Infrastructures",
    tag: "Institutionnel",
  },
];

export function TestimonialsCarousel() {
  return (
    <section className="py-24 md:py-36 bg-[#F4F4F4] overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 mb-12 md:mb-16">
        <FadeIn>
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#999] uppercase mb-4">
            / Retours Terrain
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black">
            Ce que disent nos partenaires
          </h2>
        </FadeIn>
      </div>

      {/* Scrollable track */}
      <div
        className="flex gap-5 px-8 md:px-12 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[88vw] md:w-[440px] bg-white border border-[#E2E2E2] p-8 md:p-10 flex flex-col"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#bbb] uppercase border border-[#eee] px-2.5 py-1">
                {t.tag}
              </span>
              <span className="font-mono text-[9px] text-[#ddd]">/ 0{i + 1}</span>
            </div>

            <blockquote className="text-sm md:text-base text-[#1a1a1a] leading-relaxed mb-8 font-medium flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="border-t border-[#ececec] pt-6">
              <p className="text-sm font-medium text-black">{t.author}</p>
              <p className="font-mono text-[10px] text-[#bbb] mt-1 tracking-wide uppercase">
                {t.org}
              </p>
            </div>
          </div>
        ))}

        {/* Trailing spacer */}
        <div className="flex-shrink-0 w-8 md:w-12" />
      </div>

      {/* Drag hint */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 mt-8">
        <p className="font-mono text-[9px] tracking-[0.25em] text-[#ccc] uppercase">
          ← Faire défiler →
        </p>
      </div>
    </section>
  );
}
