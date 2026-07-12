"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ── Data ─────────────────────────────────────────────────── */

const MODULES = [
  {
    num: "01",
    category: "Hydraulique",
    name: "AEP & Réseaux d'Eau Potable",
    desc: "Hardy-Cross natif, optimisation multi-objectif NSGA-II (diamètres, pressions, coûts). Export EPANET INP. Vérification EN 805. Interopérabilité EPANET 2.2.",
    specs: [
      { k: "Algorithme", v: "Hardy-Cross · NSGA-II" },
      { k: "Standard", v: "EN 805 · EPANET 2.2" },
      { k: "Output", v: "DN · Pressions · Coûts" },
    ],
    statusTag: "[ STATUS: PROD ]",
    statusColor: "text-cyan border-cyan/25",
    code: [
      "$ lcpi aep run --secteur dakar-nord",
      "",
      "✓ Hardy-Cross converge · 8 itérations",
      "✓ P_min = 2.1 bar · Q_res = 12.4 l/s",
      "✓ DN optimisé = 125 mm  [ EN 805 ]",
      "✓ Note Ed25519 → rapport_AEP_001.pdf",
    ],
  },
  {
    num: "02",
    category: "Hydraulique",
    name: "Hydraulique Pluviale",
    desc: "Débits de pointe par méthode rationnelle et Crupedix. Bassins versants, dalots, ponceaux, canaux à surface libre. Manning-Strickler complet.",
    specs: [
      { k: "Méthodes", v: "Rationnelle · Crupedix" },
      { k: "Ouvrages", v: "Dalots · Ponceaux · Canaux" },
      { k: "Vérification", v: "Manning-Strickler · TC Kirpich" },
    ],
    statusTag: "[ STATUS: PROD ]",
    statusColor: "text-cyan border-cyan/25",
    code: [
      "$ lcpi hydro run --bassin BV-23 --periode 10ans",
      "",
      "✓ Superficie = 4.2 km² · Pluie = 82 mm/h",
      "✓ Qp = 3.8 m³/s  [ Crupedix validé ]",
      "✓ Dalot 1.2×1.0 m · V = 2.1 m/s  ✓ Manning",
      "✓ Note signée → rapport_BV23.pdf",
    ],
  },
  {
    num: "03",
    category: "Génie Civil",
    name: "Béton Armé BAEL 91 & EC2",
    desc: "Dimensionnement complet : poutres, dalles, poteaux, voiles, radiers, fondations isolées et filantes. Armatures calculées et vérifiées ELU/ELS.",
    specs: [
      { k: "Normes", v: "BAEL 91 · Eurocode 2" },
      { k: "Éléments", v: "Poutres · Dalles · Radiers" },
      { k: "Vérifications", v: "ELU · ELS · Fissuration" },
    ],
    statusTag: "[ STATUS: PROD ]",
    statusColor: "text-cyan border-cyan/25",
    code: [
      "$ lcpi beton run --section poteau-30x30 --norme bael91",
      "",
      "✓ Nu = 420 kN · Mu = 18 kN.m",
      "✓ As_calc = 8.04 cm²",
      "✓ → 4HA16 + 4HA14 · Cadres HA8/20cm",
      "✓ Note Ed25519 → note_calcul_20260620.pdf",
    ],
  },
  {
    num: "04",
    category: "Génie Civil",
    name: "Charpente Métallique EC3",
    desc: "Portiques industriels, charpentes légères, poutres composées. Flambement, déversement, résistance des sections HEA/IPE/HEB.",
    specs: [
      { k: "Norme", v: "Eurocode 3" },
      { k: "Profilés", v: "HEA · IPE · HEB" },
      { k: "Vérifs", v: "Flambement · Déversement" },
    ],
    statusTag: "/// ROADMAP",
    statusColor: "text-white/20 border-white/8",
    code: [
      "$ lcpi metal run --section IPE300 --portee 8m",
      "",
      "/// Non implémenté à ce jour",
      "/// Noyau EC3 (flambement, déversement) : non démarré",
    ],
  },
  {
    num: "05",
    category: "Génie Civil",
    name: "Construction Bois EC5",
    desc: "Charpentes, planchers, murs à ossature. Lamellé-collé, bois massif, CLT. Connexions mécaniques (boulons, pointes, connecteurs).",
    specs: [
      { k: "Norme", v: "Eurocode 5" },
      { k: "Matériaux", v: "GL28h · Massif · CLT" },
      { k: "Assemblages", v: "Boulons · Pointes · Épingles" },
    ],
    statusTag: "/// ROADMAP",
    statusColor: "text-white/20 border-white/8",
    code: [
      "$ lcpi bois run --section 200x400 --essence GL28h",
      "",
      "/// Non implémenté à ce jour",
      "/// Noyau EC5 (flexion, assemblages) : non démarré",
    ],
  },
  {
    num: "06",
    category: "Calcul Avancé",
    name: "Éléments Finis FEniCS",
    desc: "Analyse non-linéaire avancée, maillage adaptatif automatique, portiques complexes, dalles 2D. Couplage PINN pour réduction de l'espace de calcul.",
    specs: [
      { k: "Solver", v: "FEniCS · Non-linéaire" },
      { k: "Maillage", v: "Adaptatif automatique" },
      { k: "IA", v: "PINN · Réduction espace" },
    ],
    statusTag: "/// ROADMAP",
    statusColor: "text-white/20 border-white/8",
    code: [
      "$ lcpi fem run --model portique-3d --nonlinear",
      "",
      "/// Non implémenté à ce jour",
      "/// Couplage PINN : recherche préliminaire",
    ],
  },
];

/* ── Terminal panel — animates on module change ───────────── */

function TerminalPanel({ mod }: { mod: (typeof MODULES)[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mod.num}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="border border-[#27272A] font-mono overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#27272A] bg-[#0d0d0d]">
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          <div className="w-2 h-2 rounded-full bg-cyan/30" />
          <span className="ml-2 text-[#3f3f46] text-[9px] tracking-[0.2em] uppercase">
            MOD_{mod.num} · {mod.category.toUpperCase()}
          </span>
        </div>
        {/* Code lines — staggered appearance */}
        <div className="px-5 py-4 space-y-px bg-black">
          {mod.code.map((line, i) => (
            <motion.p
              key={`${mod.num}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07, duration: 0.2 }}
              className={
                line === ""
                  ? "h-2"
                  : line.startsWith("$")
                  ? "text-[#f3f4f6] text-[10px] leading-5"
                  : line.startsWith("✓")
                  ? "text-cyan text-[10px] leading-5"
                  : line.startsWith("///")
                  ? "text-[#3f3f46] text-[9px] leading-5 italic"
                  : "text-[#71717a] text-[10px] leading-5"
              }
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Module row — focus lens opacity ─────────────────────── */

function ModuleRow({
  mod,
  onActive,
}: {
  mod: (typeof MODULES)[0];
  onActive: (num: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Activates when the module's top enters the top 20%vh zone
  const isActive = useInView(ref, { margin: "0px 0px -80% 0px" });

  useEffect(() => {
    if (isActive) onActive(mod.num);
  }, [isActive, mod.num, onActive]);

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-[12vh] border-b border-[#1a1a1a] last:border-0"
      animate={{ opacity: isActive ? 1 : 0.18 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="font-mono text-[9px] text-[#3f3f46] tracking-[0.4em] uppercase mb-4">
            {mod.category} · /{mod.num}
          </p>
          <h3
            className="font-medium tracking-tighter text-[#f3f4f6] leading-[1.05]"
            style={{ fontSize: "clamp(24px, 3vw, 48px)" }}
          >
            {mod.name}
          </h3>
        </div>
        <span
          className={`font-mono text-[9px] tracking-[0.2em] border px-2.5 py-1 flex-shrink-0 mt-1 ${mod.statusColor}`}
        >
          {mod.statusTag}
        </span>
      </div>

      {/* Description */}
      <p className="text-[15px] text-[#52525b] leading-relaxed mb-10 max-w-xl">
        {mod.desc}
      </p>

      {/* Specs — 3 cells */}
      <div className="grid grid-cols-3 gap-px bg-[#1a1a1a] mb-10">
        {mod.specs.map((s) => (
          <div key={s.k} className="bg-[#0a0a0b] px-5 py-4">
            <p className="font-mono text-[8px] text-[#3f3f46] uppercase tracking-[0.35em] mb-2">
              {s.k}
            </p>
            <p className="font-mono text-[10px] text-cyan">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Animated progress bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-[160px] h-px bg-[#27272A] overflow-hidden">
          <motion.div
            className={`h-full ${mod.statusTag.startsWith("[") ? "bg-cyan" : "bg-[#3f3f46]"}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            style={{ originX: 0 }}
            transition={{ duration: mod.statusTag.startsWith("[") ? 1.8 : 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="font-mono text-[8px] text-[#3f3f46] tracking-[0.2em] uppercase">
          {mod.statusTag.startsWith("[") ? "MATURITÉ: PROD" : "MATURITÉ: ROADMAP"}
        </span>
      </div>

      {/* Mobile terminal */}
      <div className="md:hidden mt-8">
        <TerminalPanel mod={mod} />
      </div>
    </motion.div>
  );
}

/* ── Main component ───────────────────────────────────────── */

export function ModulesStickyList() {
  const [activeModule, setActiveModule] = useState("01");
  const activeMod = MODULES.find((m) => m.num === activeModule) ?? MODULES[0];

  const handleActive = useCallback((num: string) => {
    setActiveModule(num);
  }, []);

  return (
    <section
      id="modules"
      className="bg-[#0a0a0b] border-t border-[#1a1a1a]"
    >
      {/* Top bar */}
      <div className="px-8 md:px-16 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
        <p className="font-mono text-[9px] tracking-[0.45em] text-[#3f3f46] uppercase">
          / 6 Moteurs d&apos;Intégration Physique
        </p>
        <motion.p
          key={activeModule}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[9px] tracking-[0.3em] text-[#3f3f46] uppercase"
        >
          MODULE {activeModule} / 06 · 03 EN PRODUCTION
        </motion.p>
      </div>

      <div className="flex">
        {/* ── LEFT — STICKY COCKPIT ─────────────── */}
        <div className="hidden md:flex w-[40%] xl:w-[38%] sticky top-0 h-screen flex-col justify-between px-10 xl:px-14 py-10 border-r border-[#1a1a1a] overflow-hidden">

          {/* TOP: Macro number + sub-title */}
          <div className="flex-shrink-0">
            <div
              className="font-medium tracking-tighter leading-none text-[#f3f4f6] select-none"
              style={{ fontSize: "clamp(130px, 17vw, 230px)", lineHeight: 0.82 }}
            >
              6
            </div>
            <p
              className="font-medium tracking-tighter text-[#27272A] uppercase leading-tight select-none mt-3"
              style={{ fontSize: "clamp(10px, 1.15vw, 15px)" }}
            >
              MOTEURS<br />D&apos;INTÉGRATION<br />PHYSIQUE
            </p>
          </div>

          {/* MIDDLE: Module navigator */}
          <div className="flex-shrink-0 space-y-2.5">
            {MODULES.map((m) => (
              <div key={m.num} className="flex items-center gap-3 overflow-hidden">
                <motion.div
                  className="h-px flex-shrink-0"
                  animate={{
                    width: m.num === activeModule ? 20 : 8,
                    backgroundColor:
                      m.num === activeModule ? "#00C4D4" : "#27272A",
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
                <motion.span
                  className="font-mono text-[9px] tracking-[0.2em] uppercase truncate"
                  animate={{
                    color: m.num === activeModule ? "#00C4D4" : "#3f3f46",
                  }}
                  transition={{ duration: 0.35 }}
                >
                  /{m.num} {m.name}
                </motion.span>
              </div>
            ))}
          </div>

          {/* BOTTOM: Reactive terminal */}
          <div className="flex-shrink-0">
            <p className="font-mono text-[8px] text-[#27272A] tracking-[0.35em] uppercase mb-2">
              ACTIVE_MOD = {activeMod.num} · {activeMod.category.toUpperCase()}
            </p>
            <TerminalPanel mod={activeMod} />
          </div>
        </div>

        {/* ── RIGHT — SCROLLING ─────────────────── */}
        <div className="flex-1 min-w-0 px-8 md:px-14 xl:px-16">
          {MODULES.map((mod) => (
            <ModuleRow key={mod.num} mod={mod} onActive={handleActive} />
          ))}

          {/* Trailing note */}
          <div className="py-20 border-t border-[#1a1a1a]">
            <p className="font-mono text-[9px] text-[#27272A] tracking-[0.35em] uppercase">
              3 modules en production · 3 en feuille de route
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
