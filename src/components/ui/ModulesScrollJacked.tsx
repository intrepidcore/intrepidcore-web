"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/* ── Data ─────────────────────────────────────────────────── */

const MODULES = [
  {
    num: "01",
    category: "Hydraulique",
    shortName: "AEP",
    name: "AEP & Réseaux d'Eau Potable",
    desc: "Hardy-Cross natif, optimisation multi-objectif NSGA-II (diamètres, pressions, coûts). Export EPANET INP. Vérification EN 805.",
    specs: ["Hardy-Cross", "NSGA-II", "EN 805", "EPANET 2.2"],
    status: "Production",
    processes: [
      { name: "Hardy-Cross convergence", pct: 100, dur: 1.8, delay: 0 },
      { name: "NSGA-II génération 200", pct: 100, dur: 2.4, delay: 0.4 },
      { name: "Vérification EN 805 pression", pct: 100, dur: 1.2, delay: 0.8 },
      { name: "Export EPANET INP", pct: 100, dur: 0.7, delay: 1.1 },
    ],
    result: "P_min=2.1 bar · Q_res=12.4 l/s · DN=125mm",
  },
  {
    num: "02",
    category: "Hydraulique",
    shortName: "Hydro",
    name: "Hydraulique Pluviale",
    desc: "Débits de pointe par méthode rationnelle et Crupedix. Bassins versants, dalots, ponceaux, canaux à surface libre. Manning-Strickler.",
    specs: ["Méthode rationnelle", "Crupedix", "Manning-Strickler", "TC Kirpich"],
    status: "Production",
    processes: [
      { name: "Débit de pointe Qp — Crupedix", pct: 100, dur: 1.5, delay: 0 },
      { name: "Manning-Strickler canal ouvert", pct: 100, dur: 1.8, delay: 0.35 },
      { name: "Dimensionnement dalot 2 cellules", pct: 100, dur: 1.4, delay: 0.7 },
      { name: "Vérification v_max submersion", pct: 100, dur: 0.9, delay: 1.0 },
    ],
    result: "Qp=3.8 m³/s · Dalot 1.2×1.0m · V=2.1 m/s",
  },
  {
    num: "03",
    category: "Génie Civil",
    shortName: "Béton",
    name: "Béton Armé BAEL 91 & EC2",
    desc: "Dimensionnement complet : poutres, dalles, poteaux, voiles, radiers, fondations isolées et filantes. Armatures calculées et vérifiées.",
    specs: ["BAEL 91", "Eurocode 2", "Radiers", "Fondations filantes"],
    status: "Production",
    processes: [
      { name: "ELU flexion — section BAEL91", pct: 100, dur: 1.6, delay: 0 },
      { name: "ELS déformation σ_s ≤ 2/3 fe", pct: 100, dur: 1.4, delay: 0.3 },
      { name: "Calcul armatures As_min / As", pct: 100, dur: 1.2, delay: 0.6 },
      { name: "Signature HMAC-SHA256 note", pct: 100, dur: 0.6, delay: 0.9 },
    ],
    result: "As=8.04cm² · 4HA16+4HA14 · Cadres HA8/20cm",
  },
  {
    num: "04",
    category: "Génie Civil",
    shortName: "EC3",
    name: "Charpente Métallique EC3",
    desc: "Portiques industriels, charpentes légères, poutres composées. Flambement, déversement, résistance des sections HEA/IPE/HEB.",
    specs: ["Eurocode 3", "HEA/IPE/HEB", "Flambement", "Déversement"],
    status: "Beta",
    processes: [
      { name: "Classification section classe 1/2", pct: 87, dur: 1.8, delay: 0 },
      { name: "Flambement χ_y · χ_z", pct: 87, dur: 2.0, delay: 0.35 },
      { name: "Déversement LT χ_LT=0.83", pct: 87, dur: 1.6, delay: 0.7 },
    ],
    result: "Beta · IPE 300 · λ̄_LT=0.62 · My,Rd=109 kN.m",
  },
  {
    num: "05",
    category: "Génie Civil",
    shortName: "EC5",
    name: "Construction Bois EC5",
    desc: "Charpentes, planchers, murs à ossature. Lamellé-collé, bois massif, CLT. Connexions mécaniques (boulons, pointes, connecteurs).",
    specs: ["Eurocode 5", "GL28h", "CLT", "Assemblages"],
    status: "Beta",
    processes: [
      { name: "Classe de service CS2 — KDef", pct: 72, dur: 1.5, delay: 0 },
      { name: "ELU flexion f_m,d = 26 N/mm²", pct: 72, dur: 1.6, delay: 0.3 },
      { name: "Assemblage boulonné EC5 Annex K", pct: 72, dur: 1.4, delay: 0.6 },
    ],
    result: "Beta · GL28h · 200×400mm · σ_m=18 N/mm²",
  },
  {
    num: "06",
    category: "Calcul Avancé",
    shortName: "FEA",
    name: "Éléments Finis FEniCS",
    desc: "Analyse non-linéaire avancée, maillage adaptatif automatique, portiques complexes, dalles 2D. Couplage PINN pour réduction de l'espace de calcul.",
    specs: ["FEniCS", "Non-linéaire", "PINN", "Adaptatif"],
    status: "Roadmap",
    processes: [
      { name: "Génération maillage adaptatif 12k", pct: 45, dur: 2.8, delay: 0 },
      { name: "Assemblage K + résidu Newton", pct: 45, dur: 3.2, delay: 0.5 },
      { name: "PINN résiduel PDE — 500 epochs", pct: 45, dur: 2.6, delay: 1.0 },
    ],
    result: "Roadmap 2027 · σ_max=142 MPa · 12k nœuds",
  },
];

const CATEGORIES = [
  { name: "Hydraulique", range: [0, 1] },
  { name: "Génie Civil", range: [2, 4] },
  { name: "Calcul Avancé", range: [5, 5] },
];

/* ── Sub-components ───────────────────────────────────────── */

type Proc = { name: string; pct: number; dur: number; delay: number };

function ProgressBar({ proc, isActive }: { proc: Proc; isActive: boolean }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-[9px] text-white/35 tracking-wide">{proc.name}</span>
        <motion.span
          className="font-mono text-[9px] text-cyan tabular-nums"
          animate={{ opacity: isActive ? 1 : 0.2 }}
          transition={{ duration: 0.2 }}
        >
          {isActive ? `${proc.pct}%` : "—%"}
        </motion.span>
      </div>
      <div className="w-full bg-white/5 h-[2px] overflow-hidden">
        <motion.div
          className="h-full bg-cyan"
          key={String(isActive)}
          initial={{ width: "0%" }}
          animate={{ width: isActive ? `${proc.pct}%` : "0%" }}
          transition={{
            duration: isActive ? proc.dur : 0.15,
            ease: "easeOut",
            delay: isActive ? proc.delay : 0,
          }}
        />
      </div>
    </div>
  );
}

function IntroSlide() {
  return (
    <div className="w-screen h-full flex-shrink-0 flex">
      {/* Left white */}
      <div className="w-1/2 h-full flex flex-col justify-center px-12 xl:px-20 py-16 bg-white">
        <p className="font-mono text-[9px] tracking-[0.4em] text-[#bbb] uppercase mb-10">
          / Modules de Calcul LCPI
        </p>
        <div
          className="font-medium tracking-tighter leading-none text-black select-none mb-10"
          style={{ fontSize: "clamp(80px, 11vw, 180px)" }}
        >
          15
        </div>
        <p className="text-sm text-[#555] max-w-xs leading-relaxed mb-12">
          Moteurs déterministes, chacun auditable, chacun normé. De la goutte de pluie à la structure qui tient.
        </p>
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono text-[9px] tracking-[0.35em] text-[#ccc] uppercase"
        >
          Scroll → Explorer les modules
        </motion.div>
      </div>
      {/* Right black */}
      <div className="w-1/2 h-full flex flex-col justify-center px-10 xl:px-16 py-16 bg-black">
        <div
          className="font-medium tracking-tighter leading-[0.88] text-white select-none uppercase"
          style={{ fontSize: "clamp(36px, 5.5vw, 88px)" }}
        >
          MOTEURS<br />D&apos;INTÉGRATION<br />PHYSIQUE
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
          {[
            { v: "6", l: "Domaines" },
            { v: "100%", l: "Auditable" },
            { v: "10-50×", l: "Moins cher" },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="text-2xl md:text-3xl font-medium text-white tracking-tighter mb-1">{v}</p>
              <p className="font-mono text-[9px] text-white/25 uppercase tracking-[0.25em]">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModuleSlide({
  mod,
  isActive,
}: {
  mod: (typeof MODULES)[0];
  isActive: boolean;
}) {
  const isRoadmap = mod.status === "Roadmap";
  const isBeta = mod.status === "Beta";

  const statusStyle = isRoadmap
    ? "text-[#444] border-[#333]"
    : isBeta
    ? "text-[#666] border-[#555]"
    : "text-cyan border-cyan/30";

  const dotColor = isRoadmap
    ? "bg-white/10"
    : isBeta
    ? "bg-white/30"
    : "bg-cyan/60";

  return (
    <div className="w-screen h-full flex-shrink-0 flex">
      {/* Left white */}
      <div className="w-[44%] h-full flex flex-col justify-center px-10 xl:px-16 py-16 bg-white">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[9px] tracking-[0.35em] text-[#ccc] uppercase">
            / {mod.num}
          </span>
          <span
            className={`font-mono text-[9px] tracking-[0.2em] uppercase border px-2.5 py-1 ${statusStyle}`}
          >
            {mod.status}
          </span>
        </div>
        <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-5">
          {mod.category}
        </p>
        <h2
          className="font-medium tracking-tighter leading-[0.92] text-black mb-7"
          style={{ fontSize: "clamp(28px, 3.8vw, 62px)" }}
        >
          {mod.name}
        </h2>
        <p className="text-sm text-[#555] leading-relaxed max-w-sm mb-8">{mod.desc}</p>
        <div className="flex flex-wrap gap-2">
          {mod.specs.map((s) => (
            <span
              key={s}
              className="font-mono text-[9px] text-[#999] border border-[#e5e5e5] px-2.5 py-1 uppercase tracking-wide"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right black terminal */}
      <div className="w-[56%] h-full flex items-center justify-center p-8 xl:p-14 bg-black">
        <div className="border border-white/10 p-6 xl:p-8 font-mono w-full max-w-lg">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
            <span className="ml-2 text-white/20 text-[9px] tracking-[0.2em] uppercase">
              lcpi.{mod.shortName.toLowerCase()} — simulation
            </span>
          </div>

          {/* Command */}
          <p className="text-[10px] mb-1">
            <span className="text-white/20">$</span>{" "}
            <span className="text-cyan">lcpi</span>{" "}
            <span className="text-white/50">{mod.shortName.toLowerCase()} run</span>
          </p>
          <p className="text-[9px] text-white/20 pl-3 mb-5">
            --norme {mod.specs[0].toLowerCase().replace(/[^a-z0-9]/g, "")} --output note.pdf
          </p>

          <div className="border-t border-white/5 pt-5">
            {mod.processes.map((proc) => (
              <ProgressBar key={proc.name} proc={proc} isActive={isActive} />
            ))}
          </div>

          {/* Result */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-2">Résultat</p>
            <motion.p
              className="text-[10px] text-white/50"
              key={String(isActive)}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ delay: isActive ? 1.6 : 0, duration: 0.4 }}
            >
              {mod.result}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */

export function ModulesScrollJacked() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = intro, 0–5 = modules

  const TOTAL = MODULES.length + 1; // 7 slides (intro + 6)

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
    [0, -(TOTAL - 1) * vw]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const raw = v * (TOTAL - 1);
    setActiveIndex(Math.round(raw) - 1); // -1 for intro offset
  });

  const activeCategoryIndex = CATEGORIES.findIndex(
    (cat) => activeIndex >= cat.range[0] && activeIndex <= cat.range[1]
  );

  /* Mobile fallback: vertical stack */
  return (
    <>
      {/* ── DESKTOP (md+): scroll-jacking ── */}
      <div ref={containerRef} style={{ height: `${TOTAL * 100}vh` }} id="modules" className="hidden md:block">
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Sub-nav bar */}
          <div className="absolute top-0 left-0 right-0 z-20 h-10 bg-white border-b border-[#e5e5e5] flex items-center px-8 md:px-12 gap-6 overflow-x-auto no-scrollbar">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#ccc] uppercase flex-shrink-0">
              / Modules
            </span>
            <div className="w-px h-3.5 bg-[#e5e5e5] flex-shrink-0" />
            {CATEGORIES.map((cat, i) => (
              <span
                key={cat.name}
                className={`font-mono text-[9px] tracking-[0.25em] uppercase transition-colors duration-200 flex-shrink-0 ${
                  i === activeCategoryIndex ? "text-cyan" : "text-[#bbb]"
                }`}
              >
                {cat.name}
              </span>
            ))}
            <div className="ml-auto flex-shrink-0">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#ddd] tabular-nums">
                {activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(MODULES.length).padStart(2, "0")}` : "— / 06"}
              </span>
            </div>
          </div>

          {/* Horizontal track */}
          <motion.div
            className="flex h-full pt-10"
            style={{ x: translateX, width: `${TOTAL * 100}vw` }}
          >
            <IntroSlide />
            {MODULES.map((mod, i) => (
              <ModuleSlide key={mod.num} mod={mod} isActive={activeIndex === i} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE: vertical stack ── */}
      <div className="md:hidden bg-white border-t border-[#e5e5e5]" id="modules-mobile">
        <div className="px-6 pt-14 pb-8">
          <p className="font-mono text-[9px] tracking-[0.4em] text-[#bbb] uppercase mb-4">
            / Modules de Calcul LCPI
          </p>
          <h2 className="text-5xl font-medium tracking-tighter text-black leading-none mb-4">
            15 MOTEURS
          </h2>
          <p className="text-sm text-[#555] leading-relaxed">
            D&apos;intégration physique. De la goutte de pluie à la structure qui tient.
          </p>
        </div>
        <div className="divide-y divide-[#f0f0f0]">
          {MODULES.map((mod) => {
            const isRoadmap = mod.status === "Roadmap";
            const isBeta = mod.status === "Beta";
            const statusStyle = isRoadmap
              ? "text-[#444] border-[#333]"
              : isBeta
              ? "text-[#666] border-[#555]"
              : "text-cyan border-cyan/30";
            return (
              <div key={mod.num} className="px-6 py-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#ccc] uppercase">
                    / {mod.num}
                  </span>
                  <span className={`font-mono text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 ${statusStyle}`}>
                    {mod.status}
                  </span>
                </div>
                <p className="font-mono text-[9px] tracking-[0.3em] text-cyan uppercase mb-3">
                  {mod.category}
                </p>
                <h3 className="text-xl font-medium text-black mb-3">{mod.name}</h3>
                <p className="text-sm text-[#555] leading-relaxed mb-5">{mod.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {mod.specs.map((s) => (
                    <span key={s} className="font-mono text-[9px] text-[#999] border border-[#e5e5e5] px-2.5 py-1 uppercase">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
