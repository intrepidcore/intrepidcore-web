"use client";

import { FadeIn } from "./FadeIn";

const collaborations = [
  {
    role:
      "Classification des contextes géologiques nationaux — référence de la dérive hiérarchique KED-H (79 unités BRGM).",
    author: "BRGM",
    org: "Bureau de Recherches Géologiques et Minières",
    tag: "Géologie",
  },
  {
    role:
      "Essais de laboratoire sur échantillons argileux du bassin sédimentaire de la Lama, région Maritime.",
    author: "TREC",
    org: "Laboratoire d'essais",
    tag: "Laboratoire",
  },
  {
    role:
      "Sondages géotechniques et essais de portance (CBR) sur le réseau routier national togolais.",
    author: "LNBTP",
    org: "Laboratoire National du Bâtiment et des Travaux Publics",
    tag: "Géotechnique",
  },
  {
    role:
      "Données de terrain et essais complémentaires intégrés à la base Atlas — 573 sondages géoréférencés.",
    author: "LAB TP · GeoTech · Institut FORMATEC",
    org: "Contributeurs terrain",
    tag: "Terrain",
  },
];

export function TestimonialsCarousel() {
  return (
    <section className="py-24 md:py-36 bg-[#F4F4F4] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8 md:px-12 mb-12 md:mb-16">
        <FadeIn>
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#999] uppercase mb-4">
            / Sources & Collaborations
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black">
            Les données qui nourrissent Atlas
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
        {collaborations.map((t, i) => (
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

            <p className="text-sm md:text-base text-[#1a1a1a] leading-relaxed mb-8 font-medium flex-1">
              {t.role}
            </p>

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
      <div className="max-w-[1280px] mx-auto px-8 md:px-12 mt-8">
        <p className="font-mono text-[9px] tracking-[0.25em] text-[#ccc] uppercase">
          ← Faire défiler →
        </p>
      </div>
    </section>
  );
}
