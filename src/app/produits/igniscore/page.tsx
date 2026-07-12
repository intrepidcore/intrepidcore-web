"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { HeroAbstraction } from "@/components/ui/HeroAbstraction";
import { ModuleVisual } from "@/components/ui/ModuleVisual";

const allBiomasses = [
  { name: "Coques de cajou (CNSL)", pci: "18–22 MJ/kg", humidite: "6–10%",  route: "CNSL · Carbonisation",           region: "Côte d'Ivoire · Bénin",      tier: "high" },
  { name: "Coques de coco",         pci: "17–19 MJ/kg", humidite: "8–15%",  route: "Carbonisation · Charbon actif",   region: "Côte d'Ivoire · Ghana",      tier: "high" },
  { name: "Coques d'arachide",      pci: "16–19 MJ/kg", humidite: "8–12%",  route: "Briquettage · Pyrolyse",         region: "Sahel",                       tier: "high" },
  { name: "Bois de feu",            pci: "14–18 MJ/kg", humidite: "15–40%", route: "Carbonisation · Gazéification",  region: "Pan-Afrique",                 tier: "mid"  },
  { name: "Rafles de maïs",         pci: "15–18 MJ/kg", humidite: "12–20%", route: "Pellets · Pyrolyse",             region: "Togo · Ghana",                tier: "mid"  },
  { name: "Déchets de palmier",     pci: "15–18 MJ/kg", humidite: "10–18%", route: "Briquettage · Gazéification",   region: "Côte d'Ivoire · Bénin",      tier: "mid"  },
  { name: "Tiges de sorgho",        pci: "14–17 MJ/kg", humidite: "10–20%", route: "Briquettage · Gazéification",   region: "Burkina · Mali",              tier: "mid"  },
  { name: "Résidus de mil",         pci: "13–16 MJ/kg", humidite: "10–18%", route: "Méthanisation · Compost",        region: "Sahel · Togo",                tier: "mid"  },
  { name: "Pailles de riz",         pci: "13–15 MJ/kg", humidite: "12–22%", route: "Briquettage · Gazéification",   region: "Guinée · Sierra Leone",       tier: "mid"  },
  { name: "Fientes de volaille",    pci: "10–14 MJ/kg", humidite: "20–35%", route: "Méthanisation",                  region: "Pan-Afrique",                 tier: "low"  },
  { name: "Bagasse de canne",       pci: "7–10 MJ/kg*", humidite: "45–55%", route: "Cogénération directe",           region: "Côte d'Ivoire · Ghana",      tier: "low"  },
  { name: "Fumier bovin",           pci: "8–12 MJ/kg",  humidite: "30–50%", route: "Méthanisation · Biogaz",         region: "Pan-Afrique",                 tier: "low"  },
];

const modules = [
  {
    num: "01",
    quarter: "Q3 2026",
    name: "BioCore Engine",
    status: "En développement",
    statusColor: "text-[#E85D04]",
    statusBorder: "border-[#E85D04]/30",
    desc: "Le moteur de caractérisation et dimensionnement thermochimique. PCI Dulong (ASTM D5865), correction humidité ISO 18125, optimisation mix NSGA-II multi-objectif, dimensionnement séchoirs, carbonisateurs, méthaniseurs. Calcul ROI/VAN/TRI automatique.",
    specs: [
      { label: "Formule", val: "PCI = 33.83·C + 121.4·(H−O/8) + 10.47·S − 2.44·(9H+W)" },
      { label: "Optimisation", val: "NSGA-II · 200 générations · front de Pareto" },
      { label: "Standards", val: "ASTM D5865 · ISO 18125 · ISO 17225 · NF EN 14918" },
      { label: "Output", val: "PCI brut / PCI net / PCS / Route valorisation / ROI" },
    ],
    code: [
      "# Coques d'arachide",
      "PCI_brut = 33.83×0.472 + 121.4×(0.058 − 0.351/8)",
      "        + 10.47×0.001 − 2.44×(9×0.058 + 0.12)",
      "PCI_brut = 17.4 MJ/kg",
      "PCI_net  = 14.2 MJ/kg  ← ISO 18125",
      "",
      "# NSGA-II mix optimal",
      "coques 40% · bois 35% · mil 25%",
      "PCI_mix  = 15.8 MJ/kg",
      "ROI      = 34%  · VAN = 2.1M FCFA",
    ],
    dotColor: "bg-[#E85D04]",
    accentLine: "border-l-[#E85D04]",
  },
  {
    num: "02",
    quarter: "Q1 2027",
    name: "EnergyMap AI",
    status: "Roadmap",
    statusColor: "text-[var(--ignis-dim)]",
    statusBorder: "border-[var(--ignis-border-2)]",
    desc: "Planification territoriale des infrastructures énergétiques biomasse. H3 hexagon indexing (résolution 8/9), OR-Tools facility location, modélisation ressources/demande à l'échelle village/commune. Export dossiers bankables BAD/AFD.",
    specs: [
      { label: "Indexation", val: "Uber H3 résolution 8–9 · hexagones ~0.5 km²" },
      { label: "Optimisation", val: "Google OR-Tools MILP · facility location" },
      { label: "Modélisation", val: "Offre biomasse · Demande énergétique · Coût transport" },
      { label: "Export", val: "PDF institutionnel · Format BAD/AFD/Banque Mondiale" },
    ],
    code: [
      "# H3 hexagon indexing — Togo",
      "zone = h3.geo_to_h3(6.137, 1.212, resolution=8)",
      "biomasse_dispo = atlas.query(zone, 'biomasse')",
      "demande_kwh    = 1240  # kWh/mois/village",
      "",
      "# OR-Tools facility location",
      "solver = pywraplp.Solver('FacilityLocation')",
      "# → 3 sites optimaux · économie 34% transport",
    ],
    dotColor: "bg-white/20",
    accentLine: "border-l-white/20",
  },
  {
    num: "03",
    quarter: "Q4 2026",
    name: "PyroSense AI",
    status: "Roadmap",
    statusColor: "text-[var(--ignis-dim)]",
    statusBorder: "border-[var(--ignis-border-2)]",
    desc: "Supervision IoT temps réel des unités biomasse. Architecture LoRaWAN low-cost (~50$/nœud) : ESP32 + SX1276, TimescaleDB, détection anomalies LSTM. Certification carbone automatique Gold Standard, Verra/VCS, REC.",
    specs: [
      { label: "Capteurs", val: "ESP32 + SX1276 · ~50 $/nœud · T°, CO, débit, pression" },
      { label: "Protocole", val: "LoRaWAN TTN · portée 2–15 km · SF7–SF12 adaptatif" },
      { label: "Stockage", val: "TimescaleDB · séries temporelles · compression 90%" },
      { label: "Certification", val: "Gold Standard GS4GG · Verra VCS · REC marché volontaire" },
    ],
    code: [
      "# TimescaleDB — lecture capteur",
      "SELECT time_bucket('1h', ts) as heure,",
      "       avg(temperature) as T_moy,",
      "       avg(co_ppm) as CO_moy",
      "FROM pyrosense_data",
      "WHERE node_id = 'IGNIS-TG-001'",
      "  AND ts > NOW() - INTERVAL '24h'",
      "GROUP BY heure ORDER BY heure;",
    ],
    dotColor: "bg-white/20",
    accentLine: "border-l-white/20",
  },
  {
    num: "04",
    quarter: "2027–2028",
    name: "AgroCore",
    status: "Vision",
    statusColor: "text-[var(--ignis-ghost)]",
    statusBorder: "border-[var(--ignis-border-1)]",
    desc: "La boucle agricole fermée. CarboSoil : application biochar et suivi carbone sol. DigestMap : valorisation agronomique des digestats. YieldPredict : prédiction rendements par culture intégrant données Atlas, biochar et climatologie.",
    specs: [
      { label: "CarboSoil", val: "Biochar · Carbone sol · Gold Standard agricole" },
      { label: "DigestMap", val: "Digestats · Épandage · Cartographie disponibilité" },
      { label: "YieldPredict", val: "ML prédictif · Données Atlas sol · Climatologie" },
      { label: "Extension", val: "15 pays CEDEAO · v3.0 2028" },
    ],
    code: [
      "# YieldPredict — inference",
      "soil = atlas.get_params(lat=6.23, lon=1.18)",
      "# VBS=2.1, IP=18, CBR=42%",
      "",
      "model = YieldModel.load('mais_togo_v1')",
      "pred  = model.predict(",
      "    soil=soil, biochar_t_ha=2.0,",
      "    pluie_mm=1150, variete='OPV'",
      ")",
      "# → 3.4 t/ha (+28% vs baseline)",
    ],
    dotColor: "bg-white/10",
    accentLine: "border-l-white/10",
  },
];

/* ── Focus-tracked module card ────────────────────────────── */
function ModuleCard({
  mod,
  onActive,
}: {
  mod: (typeof modules)[0];
  onActive: (num: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useInView(ref, { margin: "0px 0px -75% 0px" });

  useEffect(() => {
    if (isActive) onActive(mod.num);
  }, [isActive, mod.num, onActive]);

  return (
    <motion.div
      ref={ref}
      className="border-l-2 border-[#E85D04]/20 pl-8 min-h-screen flex flex-col justify-center py-[12vh] border-b border-white/5 last:border-b-0"
      animate={{ opacity: isActive ? 1 : 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="grid xl:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">
      <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[9px] text-[var(--ignis-dim)] uppercase">/{mod.num}</span>
            <span className={`font-mono text-[9px] tracking-[0.15em] uppercase border ${mod.statusBorder} px-2 py-0.5 ${mod.statusColor}`}>
              [ {mod.status.toUpperCase()} ]
            </span>
          </div>
          <h3
            className="font-medium text-[var(--ignis-text)] tracking-tight"
            style={{ fontSize: "clamp(22px, 2.8vw, 40px)" }}
          >
            {mod.name}
          </h3>
          <p className="font-mono text-[9px] text-[var(--ignis-dim)] mt-1 tracking-wider">{mod.quarter}</p>
        </div>
      </div>

      <p className="font-mono text-[11px] text-[var(--ignis-mid)] leading-[1.95] tracking-[0.02em] mb-10 max-w-xl">{mod.desc}</p>

      {/* Specs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--ignis-border-1)] mb-8">
        {mod.specs.map((s) => (
          <div key={s.label} className="bg-[var(--ignis-bg)] p-4">
            <p className="font-mono text-[8px] text-[var(--ignis-dim)] uppercase mb-1.5 tracking-[0.3em]">{s.label}</p>
            <p className="font-mono text-[10px] text-[var(--ignis-text-2)]">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Code — terminal inside right card (detail view) */}
      <div className="border border-[var(--ignis-border-2)] font-mono text-[10px]">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--ignis-border-2)] bg-[var(--ignis-bg-2)]">
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          <div className="w-2 h-2 rounded-full bg-[#E85D04]/40" />
          <span className="ml-2 text-[var(--ignis-dim)] text-[9px] tracking-[0.2em] uppercase">
            ignis — {mod.name.toLowerCase()}
          </span>
        </div>
        <div className="px-5 py-4 space-y-0.5 bg-black leading-loose">
          {mod.code.map((line, j) => (
            <p
              key={j}
              className={
                line.startsWith("#")
                  ? "text-[var(--ignis-dim)] text-[9px]"
                  : line === ""
                  ? "h-2"
                  : "text-[var(--ignis-mid-2)] text-[10px]"
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      </div>{/* end left text column */}
      {/* RIGHT — visual asset */}
      <div className="hidden xl:flex items-center justify-center py-8 border border-[var(--ignis-border-1)]">
        <ModuleVisual num={mod.num} />
      </div>
      </div>{/* end grid */}
    </motion.div>
  );
}

/* ── Reactive terminal for left column ───────────────────── */
function IgnisTerminal({ mod }: { mod: (typeof modules)[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mod.num}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="border border-[var(--ignis-border-2)] font-mono overflow-hidden"
      >
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--ignis-border-2)] bg-[var(--ignis-bg-2)]">
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          <div className="w-2 h-2 rounded-full bg-[#E85D04]/40" />
          <span className="ml-2 text-[var(--ignis-dim)] text-[9px] tracking-[0.2em] uppercase">
            MOD_{mod.num} · {mod.quarter}
          </span>
        </div>
        <div className="px-5 py-4 space-y-px bg-black">
          {mod.code.slice(0, 5).map((line, i) => (
            <motion.p
              key={`${mod.num}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className={
                line === ""
                  ? "h-2"
                  : line.startsWith("#")
                  ? "text-[var(--ignis-dim)] text-[9px] leading-5"
                  : "text-[var(--ignis-mid-2)] text-[10px] leading-5"
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

export default function IgnisCorePage() {
  const heroRef = useRef<HTMLElement>(null);
  const certRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: certProgress } = useScroll({
    target: certRef,
    offset: ["start start", "end end"],
  });
  const certX = useTransform(certProgress, [0, 1], ["0vw", "-200vw"]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.55], [0, -70]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.35], [0, -30]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [activeModNum, setActiveModNum] = useState("01");
  const handleActiveMod = useCallback((num: string) => {
    setActiveModNum(num);
  }, []);
  const activeMod = modules.find((m) => m.num === activeModNum) ?? modules[0];

  return (
    <main className="min-h-screen bg-[var(--ignis-bg)] text-[var(--ignis-text)]">

      {/* ── HERO — SCRUBBED — BLACK ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end pb-24 px-8 md:px-16 bg-black overflow-hidden"
      >
        <HeroAbstraction color="#E85D04" />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full pt-40">
          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[9px] tracking-[0.35em] text-[#E85D04] uppercase border border-[#E85D04]/30 px-3 py-1.5">BioCore MVP · Q3 2026</span>
              <span className="font-mono text-[9px] tracking-[0.35em] text-white/25 uppercase">/ Énergie & Thermochimie</span>
            </div>
          </motion.div>

          {/* SCRUBBED TITLE */}
          <motion.h1
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-[12vw] md:text-[10vw] font-medium tracking-tighter leading-none text-white"
          >
            IgnisCore
          </motion.h1>

          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-t border-white/10 pt-8 mt-4 gap-8">
              <div className="max-w-xl">
                <p className="text-xl text-white/50 leading-relaxed mb-2">Valorisation Énergétique de la Biomasse</p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">4 modules · 20 biomasses · IoT LoRaWAN · Certification carbone</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <a href="#waitlist" className="border border-[var(--ignis-border-2)] text-white/60 px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-[#E85D04]/50 hover:text-white transition-colors">Rejoindre la liste d&apos;attente</a>
                <a href="#modules" className="border border-[var(--ignis-border-1)] text-white/30 px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-white/20 hover:text-white/60 transition-colors">Découvrir →</a>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.35em] text-white/15 uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ── STATS — DARK GRID ── */}
      <section className="border-t border-[var(--ignis-border-1)] bg-[var(--ignis-bg)]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--ignis-border-1)]">
          {[
            { val: "20", label: "Biomasses africaines caractérisées", tag: "/ BASE DE DONNÉES" },
            { val: "4", label: "Modules spécialisés actifs", tag: "/ ARCHITECTURE" },
            { val: "~50$", label: "par nœud IoT LoRaWAN déployé", tag: "/ COÛT UNITAIRE" },
            { val: "3", label: "Standards carbone certifiés", tag: "/ CERTIFICATION" },
          ].map((s, i) => (
            <FadeIn key={s.tag} delay={i * 0.06} className="bg-[var(--ignis-bg)] py-12 px-8 md:px-10">
              <p className="font-mono text-[8px] tracking-[0.4em] text-[var(--ignis-dim)] uppercase mb-5">{s.tag}</p>
              <p className="text-6xl md:text-7xl font-medium tracking-tighter text-[var(--ignis-text)] leading-none mb-3">{s.val}</p>
              <p className="font-mono text-[9px] text-[var(--ignis-dim)] tracking-[0.15em] leading-relaxed">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── MODULES — TACTICAL DARK STICKY — BLACK ── */}
      <section id="modules" className="bg-[var(--ignis-bg)] border-t border-[var(--ignis-border-1)]">
        {/* Top bar */}
        <div className="px-8 md:px-16 py-4 border-b border-[var(--ignis-border-1)] flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-[0.45em] text-[var(--ignis-dim)] uppercase">
            / 4 Modules · Biomasse → Crédit Carbone
          </p>
          <motion.p
            key={activeModNum}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[9px] tracking-[0.3em] text-[#E85D04] uppercase"
          >
            MODULE {activeModNum} / 04
          </motion.p>
        </div>

        <div className="flex">
          {/* LEFT — STICKY COCKPIT */}
          <div className="hidden md:flex w-[40%] xl:w-[38%] sticky top-0 h-screen flex-col justify-between px-10 xl:px-14 py-10 border-r border-[var(--ignis-border-1)]">

            {/* TOP: macro number + sub-title */}
            <div>
              <div
                className="font-medium tracking-tighter leading-none text-[var(--ignis-text)] select-none"
                style={{ fontSize: "clamp(110px, 15vw, 200px)", lineHeight: 0.82 }}
              >
                4
              </div>
              <p
                className="font-medium tracking-tighter text-[var(--ignis-ghost)] uppercase leading-tight mt-3 select-none"
                style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}
              >
                MODULES<br />DE LA BIOMASSE<br />À L&apos;ÉNERGIE
              </p>
            </div>

            {/* MIDDLE: module navigator */}
            <div className="space-y-3">
              {modules.map((m) => (
                <div key={m.num} className="flex items-center gap-3">
                  <motion.div
                    className="h-px flex-shrink-0"
                    animate={{
                      width: m.num === activeModNum ? 20 : 8,
                      backgroundColor: m.num === activeModNum ? "var(--ignis-accent)" : "var(--ignis-ghost)",
                    }}
                    transition={{ duration: 0.35 }}
                  />
                  <motion.span
                    className="font-mono text-[9px] tracking-[0.2em] uppercase truncate"
                    animate={{ color: m.num === activeModNum ? "var(--ignis-accent)" : "var(--ignis-dim)" }}
                    transition={{ duration: 0.35 }}
                  >
                    /{m.num} {m.name}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* BOTTOM: reactive terminal */}
            <div>
              <p className="font-mono text-[8px] text-[var(--ignis-ghost)] tracking-[0.35em] uppercase mb-2">
                ACTIVE_MOD = {activeMod.num} · {activeMod.quarter}
              </p>
              <IgnisTerminal mod={activeMod} />
            </div>
          </div>

          {/* RIGHT — SCROLLING */}
          <div className="flex-1 min-w-0 px-8 md:px-14 xl:px-16">
            {modules.map((mod) => (
              <ModuleCard key={mod.num} mod={mod} onActive={handleActiveMod} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BIOMASSES — DARK DATA GRID ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-[var(--ignis-bg)] border-t border-[var(--ignis-border-1)]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[var(--ignis-dim)] uppercase mb-4">/ Base de Données Biomasses</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[var(--ignis-text)] mb-4">
              20 biomasses africaines.<br />
              <span className="text-[var(--ignis-dim)]">Caractérisées. Classifiées.</span>
            </h2>
            <p className="font-mono text-[11px] text-[var(--ignis-dim)] max-w-xl mb-12 leading-[2] tracking-[0.03em]">
              PCI Dulong calculé et mesuré · Taux d&apos;humidité saisonniers · Routes de valorisation optimales<br />
              Première base de données dédiée à l&apos;Afrique de l&apos;Ouest — IgnisCore Research v1.0
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="border border-[var(--ignis-border-2)] overflow-x-auto">
              <div className="grid grid-cols-5 border-b border-[var(--ignis-border-1)] bg-[var(--ignis-bg-2)] min-w-[700px]">
                {["Biomasse", "PCI (MJ/kg)", "Humidité", "Routes de valorisation", "Région"].map((h) => (
                  <div key={h} className="px-5 py-3">
                    <span className="font-mono text-[8px] tracking-[0.3em] text-[var(--ignis-dim)] uppercase">{h}</span>
                  </div>
                ))}
              </div>
              <div className="min-w-[700px]">
                {allBiomasses.map((b, i) => (
                  <div
                    key={b.name}
                    className={`grid grid-cols-5 border-b border-[var(--ignis-border-1)] hover:bg-[var(--ignis-bg-3)] transition-colors ${i === allBiomasses.length - 1 ? "border-0" : ""}`}
                  >
                    <div className="px-5 py-3.5 flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${b.tier === "high" ? "bg-[#E85D04]" : b.tier === "mid" ? "bg-[#3f3f46]" : "bg-[#27272A]"}`} />
                      <span className="font-mono text-[10px] text-[var(--ignis-text-2)]">{b.name}</span>
                    </div>
                    <div className={`px-5 py-3.5 font-mono text-[10px] font-medium ${b.tier === "high" ? "text-[var(--ignis-text)]" : b.tier === "mid" ? "text-[var(--ignis-mid-2)]" : "text-[var(--ignis-dim)]"}`}>{b.pci}</div>
                    <div className="px-5 py-3.5 font-mono text-[10px] text-[var(--ignis-mid)]">{b.humidite}</div>
                    <div className="px-5 py-3.5 font-mono text-[10px] text-[var(--ignis-mid)] tracking-[0.01em]">{b.route}</div>
                    <div className="px-5 py-3.5 font-mono text-[9px] text-[var(--ignis-dim)] uppercase tracking-[0.15em]">{b.region}</div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-[var(--ignis-border-1)] bg-[var(--ignis-bg-2)]">
                <span className="font-mono text-[8px] text-[var(--ignis-ghost)] tracking-[0.15em]">
                  * PCI sur base humide · ● haute densité énergétique ● densité moyenne ● faible densité · + 8 biomasses en cours d&apos;intégration
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STANDARD CARBONE — HORIZONTAL SCROLL-JACKING ── */}
      <section ref={certRef} className="relative bg-[var(--ignis-bg)] border-t border-[var(--ignis-border-1)]" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Top navigation bar */}
          <div className="absolute top-0 left-0 right-0 z-10 px-8 md:px-16 py-4 border-b border-[var(--ignis-border-1)] flex items-center justify-between bg-[var(--ignis-bg)]">
            <p className="font-mono text-[9px] tracking-[0.45em] text-[var(--ignis-dim)] uppercase">/ Certifications Carbone · Standards Mondiaux</p>
            <p className="font-mono text-[9px] tracking-[0.3em] text-[var(--ignis-dim)] uppercase">Scroll →</p>
          </div>
          {/* Horizontal track */}
          <motion.div className="flex h-full" style={{ x: certX }}>
            {[
              {
                badge: "GS4GG", name: "Gold Standard",
                subtitle: "Premium Voluntary Market",
                desc: "Certifie les crédits carbone des projets biomasse énergie. MRV (Measurement, Reporting, Verification) automatisé via PyroSense. Protocole Gold Standard for the Global Goals.",
                price: "8–15 $/tCO₂",
                hash: "sha256:a3f9c2b1e7d4f0…",
                stat: "01 / 03"
              },
              {
                badge: "VCS", name: "Verra / VCS",
                subtitle: "Verified Carbon Standard",
                desc: "Protocoles VM0042 (réduction méthane) et VM0022 (biomasse énergie). Génération automatique des rapports VCS. 1 milliard de crédits émis globalement.",
                price: "5–12 $/tCO₂",
                hash: "sha256:7c1e4d9b3a8f2e…",
                stat: "02 / 03"
              },
              {
                badge: "REC", name: "Renewable Energy Cert.",
                subtitle: "Regional Voluntary Markets",
                desc: "Certifiés par les marchés volontaires régionaux CEDEAO. PyroSense fournit les données de production en temps réel pour audit continu et émission automatisée.",
                price: "Marché régional",
                hash: "sha256:f2b8e1c5d0a7f3…",
                stat: "03 / 03"
              },
            ].map((cert, i) => (
              <div key={cert.badge} className="w-screen h-full flex-shrink-0 flex flex-col justify-center px-8 md:px-24 py-20 border-r border-[var(--ignis-border-1)] relative">
                {/* Giant badge watermark */}
                <div
                  className="absolute right-16 bottom-24 font-black text-[#0f0f0f] select-none pointer-events-none leading-none tracking-tighter"
                  style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
                >
                  {cert.badge}
                </div>
                <div className="max-w-3xl relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--ignis-dim)] uppercase">{cert.stat}</span>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--ignis-ghost)] uppercase">·</span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--ignis-ghost)] uppercase">{cert.subtitle}</span>
                  </div>
                  <p
                    className="font-medium tracking-tighter text-[var(--ignis-text)] leading-none mb-6"
                    style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
                  >
                    {cert.name}
                  </p>
                  <p className="font-mono text-[11px] text-[var(--ignis-dim)] leading-[2] tracking-[0.03em] max-w-xl mb-10">
                    {cert.desc}
                  </p>
                  <div className="flex items-center gap-8 border-t border-[var(--ignis-border-1)] pt-8">
                    <div>
                      <p className="font-mono text-[8px] text-[var(--ignis-ghost)] tracking-[0.3em] uppercase mb-1">Prix marché</p>
                      <p className="font-mono text-[13px] text-[var(--ignis-text)]">{cert.price}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] text-[var(--ignis-ghost)] tracking-[0.3em] uppercase mb-1">Audit hash</p>
                      <p className="font-mono text-[10px] text-[var(--ignis-dim)] tracking-wider">{cert.hash}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ROADMAP — DARK VERTICAL TIMELINE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-[var(--ignis-bg)] border-t border-[var(--ignis-border-1)]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[var(--ignis-dim)] uppercase mb-4">/ Roadmap Produit</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[var(--ignis-text)] mb-20">
              De la MVP<br />
              <span className="text-[var(--ignis-dim)]">au déploiement CEDEAO.</span>
            </h2>
          </FadeIn>
          <div className="relative pl-8">
            {/* Ligne de vie verticale */}
            <div className="absolute left-0 top-2 bottom-0 w-px bg-[var(--ignis-border-1)]" />
            <div className="space-y-0">
              {modules.map((item, i) => (
                <FadeIn key={item.num} delay={i * 0.1}>
                  <div className="relative pb-16 last:pb-0">
                    {/* Nœud */}
                    <div className={`absolute -left-8 top-1.5 w-4 h-4 border flex items-center justify-center ${i === 0 ? "border-[#E85D04]" : i <= 1 ? "border-[var(--ignis-border-2)]" : "border-[var(--ignis-border-1)]"}`}
                      style={{ transform: "translateX(-50%)" }}>
                      {i === 0 && <div className="w-1.5 h-1.5 bg-[#E85D04]" />}
                    </div>
                    <div className="grid md:grid-cols-[180px_1fr] gap-6 md:gap-16">
                      <div className="pt-0.5">
                        <p className={`font-mono text-[10px] tracking-[0.25em] uppercase mb-2.5 ${i === 0 ? "text-[#E85D04]" : "text-[var(--ignis-dim)]"}`}>
                          {item.quarter}
                        </p>
                        <div className={`inline-block font-mono text-[9px] tracking-[0.15em] uppercase border px-2 py-0.5 ${item.statusBorder} ${item.statusColor}`}>
                          {item.status}
                        </div>
                      </div>
                      <div>
                        <h3 className={`text-base font-medium mb-4 tracking-tight ${i === 0 ? "text-[var(--ignis-text)]" : "text-[var(--ignis-mid)]"}`}>
                          {item.name}
                        </h3>
                        <p className="font-mono text-[11px] text-[var(--ignis-dim)] leading-[1.9] tracking-[0.02em] max-w-2xl">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — BLACK ── */}
      <section id="waitlist" className="py-40 px-8 md:px-16 bg-[var(--ignis-bg)] border-t border-[var(--ignis-border-1)] text-center">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.4em] text-[var(--ignis-ghost)] uppercase mb-6">/ BioCore MVP · Q3 2026</p>
            <h2 className="text-4xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-3xl mx-auto mb-10 text-[var(--ignis-text)] text-balance">
              La biomasse africaine<br /><span className="text-[#E85D04]">a une plateforme.</span>
            </h2>
            <p className="text-base text-[var(--ignis-mid)] max-w-lg mx-auto mb-12 leading-relaxed">
              Rejoignez les producteurs, ingénieurs énergie et planificateurs territoriaux qui attendent le BioCore Engine pour Q3 2026.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/" className="border border-[var(--ignis-border-2)] text-white/60 px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:border-[#E85D04]/40 hover:text-white transition-colors">Rejoindre la liste d&apos;attente</a>
              <a href="/" className="border border-[var(--ignis-border-1)] text-white/25 px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:border-white/15 hover:text-white/50 transition-colors">← Retour à l&apos;accueil</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
