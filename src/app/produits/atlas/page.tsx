"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

const hierarchyLevels = [
  {
    level: "L1",
    name: "KED-H",
    full: "Krigeage avec Dérive Hiérarchique",
    color: "text-[#40916C]",
    border: "border-[#40916C]/40",
    bg: "bg-[#40916C]/5",
    params: "5 niveaux · 79 contextes géologiques",
    metrics: [
      { k: "LOO-RMSE VBS H1", v: "2.933 g/100g" },
      { k: "Portée variogramme", v: "220 km" },
      { k: "Sill (C₀+C)", v: "14.0 (g/100g)²" },
      { k: "Nugget C₀", v: "2.80 (g/100g)²" },
    ],
    desc: "Dérive à 5 niveaux : RGA national → zone géomorphologique → type pédologique (FAO) → contexte géologique (BRGM 79) → moyenne nationale. Capture la structure smectitique des bassins sédimentaires côtiers.",
    status: "Production",
    winner: "KED gagne 8/15 comparaisons H1/H2/H3",
  },
  {
    level: "L2a",
    name: "RK-SCORPAN",
    full: "Régression Ridge + Krigeage résiduel",
    color: "text-[#40916C]",
    border: "border-[#40916C]/30",
    bg: "bg-[#40916C]/3",
    params: "12 covariables · λ* = 0.18",
    metrics: [
      { k: "LOO-RMSE VBS H1", v: "2.378 g/100g ★" },
      { k: "Régularisation Ridge λ*", v: "0.18 (LOO-CV)" },
      { k: "R² régression", v: "0.19–0.24" },
      { k: "Gagnant comparaisons", v: "7/15 horizons" },
    ],
    desc: "12 covariables SCORPAN : DSM altitude, pente α, TPI 5km, HAND, Pann (BIO12), Psèche, σP (BIO15), géologie BRGM, pédologie FAO, RGA, coordonnées UTM. Meilleur modèle pour VBS H1.",
    status: "Production",
    winner: "Meilleur modèle absolu VBS H1",
  },
  {
    level: "L2b",
    name: "Fusion BLUP",
    full: "Best Linear Unbiased Predictor bayésien",
    color: "text-[#40916C]",
    border: "border-[#40916C]/30",
    bg: "bg-[#40916C]/3",
    params: "Pondération 1/σ² · 29 407 mailles",
    metrics: [
      { k: "Réduction variance", v: "46.9% ± 0.6%" },
      { k: "Couverture certifiée", v: "100% des mailles" },
      { k: "Gain vs fusion naïve", v: "+8.9% vs 50/50" },
      { k: "EG réduction max", v: "48.8%" },
    ],
    desc: "σ²_fusion = 1/(1/σ²_KED + 1/σ²_RK). Propriété théorique : σ²_fusion ≤ min(σ²_KED, σ²_RK) garantie. Réduction 44.7–49.8% certifiée mathématiquement dans chaque maille.",
    status: "Production",
    winner: "Radar global : domine tous les axes",
  },
  {
    level: "L3",
    name: "VfS-PLS",
    full: "VBS-from-Sentinel — PLS Spectral",
    color: "text-white/50",
    border: "border-white/10",
    bg: "bg-white/3",
    params: "4 indices Sentinel-2 · 3 composantes PLS",
    metrics: [
      { k: "LOO-RMSE VBS", v: "2.788 g/100g" },
      { k: "Gain vs KED-H", v: "−4.9%" },
      { k: "R² LOO", v: "0.354" },
      { k: "Couverture", v: "24 077 / 29 407 mailles" },
    ],
    desc: "4 indices spectraux Sentinel-2 SR Harmonisé 2023-2024 : clay_index (B11/B12), NDVI (B8/B4), iron_oxide (B4/B8), SWIR_ratio. Géotechnique sans laboratoire. Première preuve de concept en milieu tropical togolais.",
    status: "Beta",
    winner: "Géotechnique sans terrain",
  },
  {
    level: "L4",
    name: "MTGP/ICM",
    full: "Multi-Task Gaussian Process — ICM",
    color: "text-white/40",
    border: "border-white/10",
    bg: "bg-white/2",
    params: "Rang 2/3 · GPflow Adam 500 itr.",
    metrics: [
      { k: "IP amélioration", v: "−12.4% vs KED-H" },
      { k: "WL amélioration", v: "−7.3% vs KED-H" },
      { k: "EG amélioration", v: "−3.8% (rang 2)" },
      { k: "WP (non amélioré)", v: "+14.6% (Levene p=0.039)" },
    ],
    desc: "Co-krigeage multi-paramètres via Intrinsic Coregionalization Model. Groupe 1 plasticité {VBS, IP, EG} — Groupe 2 compactage {CBR, γd, wopt}. Rang 3 optimal pour IP, rang 2 pour EG. WP non stationnaire N-S.",
    status: "Expérimental",
    winner: "IP/WL : gains sélectifs validés",
  },
  {
    level: "L5",
    name: "SGS",
    full: "Simulation Géostatistique Séquentielle",
    color: "text-white/30",
    border: "border-white/8",
    bg: "bg-white/2",
    params: "50 réalisations · Noyau Matérn gstools",
    metrics: [
      { k: "PICP₉₅ VBS", v: "1.000 (sur-couverture)" },
      { k: "PICP₉₅ IP", v: "0.884" },
      { k: "Amplitude CBR P10-P90", v: "51.4%" },
      { k: "Amplitude VBS P10-P90", v: "6.7 g/100g" },
    ],
    desc: "50 réalisations équiprobables par marche aléatoire séquentielle. Percentiles P10/P50/P90 sur 29 407 mailles. Quantification non-paramétrique de l'incertitude. CBR : amplitude 51.4% reflète la forte hétérogénéité Maritime vs Plateaux.",
    status: "Production",
    winner: "Incertitude P10/P50/P90 sur 6 paramètres",
  },
];

const regions = [
  {
    name: "Maritime",
    geo: "Vertisols smectitiques · Dépression de la Lama",
    n: "n = 164 sondages",
    vbs: "VBS > 6 g/100g",
    cbr: "CBR < 15%",
    rmse_ked: "2.52",
    rmse_rk: "2.29",
    sigma2: "8.5",
    rga: "Risque Très Élevé",
    color: "border-red-500/40",
    badge: "bg-red-500/10 text-red-400",
    desc: "Argiles smectitiques Ca-Mg. Retrait-gonflement dominant. Alluvions quaternaires. VBS persistant H1→H3. Fondations profondes obligatoires.",
  },
  {
    name: "Plateaux",
    geo: "Ferralsols kaolinitiques · Bénin/Volta",
    n: "n = 160 sondages",
    vbs: "VBS 2–4 g/100g",
    cbr: "CBR > 50%",
    rmse_ked: "3.11",
    rmse_rk: "2.84",
    sigma2: "14.2",
    rga: "Risque Modéré",
    color: "border-[#F5A623]/40",
    badge: "bg-[#F5A623]/10 text-[#F5A623]",
    desc: "Kaolinite secondaire. Portance élevée, sol latéritique partiellement induré. IP croît de H1 à H3 (accumulation kaolinite). CBR > 50% autorise dimensionnement allégé.",
  },
  {
    name: "Centrale",
    geo: "Gneiss précambrien altéré · 800–900m",
    n: "n = 213 sondages",
    vbs: "VBS 2–4 g/100g",
    cbr: "CBR 20–50%",
    rmse_ked: "2.98",
    rmse_rk: "2.64",
    sigma2: "11.8",
    rga: "Risque Faible–Modéré",
    color: "border-[#40916C]/40",
    badge: "bg-[#40916C]/10 text-[#40916C]",
    desc: "Socle cristallin altéré en kaolinite. Zone de transition géologique abrupte. VBS décroît de H1 à H3 (kaolinitisation progressive). Meilleure couverture (n=213).",
  },
  {
    name: "Kara",
    geo: "Schistes/quartzites Atacora · 9°N–10°N",
    n: "n = 18 sondages",
    vbs: "VBS < 2 g/100g",
    cbr: "CBR 30–60%",
    rmse_ked: "3.38",
    rmse_rk: "3.05",
    sigma2: "16.5",
    rga: "Risque Faible",
    color: "border-white/20",
    badge: "bg-white/5 text-white/50",
    desc: "Cuirasses latéritiques, Rd > 40 MPa en surface. Forte rugosité, signal optique Sentinel-2 saturé (SAR planifié). Priorité échantillonnage adaptatif : Δσ² ≈ 3.5 par sondage.",
  },
  {
    name: "Savanes",
    geo: "Grès voltaïens · 10°N–11°N",
    n: "n = 14 sondages",
    vbs: "VBS < 2 g/100g",
    cbr: "CBR > 60%",
    rmse_ked: "3.62",
    rmse_rk: "3.20",
    sigma2: "19.2",
    rga: "Risque Faible",
    color: "border-white/15",
    badge: "bg-white/5 text-white/40",
    desc: "Formation gréseuse voltaïenne. CBR > 60% sur toute la zone. Pluviométrie 800 mm/an (WL < 30%). Zone à variance maximale : prédiction par dérive géologique seule. Campagne terrain systématique recommandée.",
  },
];

const rgaClasses = [
  { cls: "RGA-0", label: "Risque Faible", desc: "Sol stable, fondations conventionnelles. Retrait-gonflement négligeable. Semelles isolées autorisées.", badge: "bg-[#40916C]/10 text-[#40916C] border-[#40916C]/30" },
  { cls: "RGA-1", label: "Risque Modéré", desc: "Présence argile gonflante. Fondations adaptées recommandées, radier général possible.", badge: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30" },
  { cls: "RGA-2", label: "Risque Élevé", desc: "Argile expansive significative. Fondations profondes obligatoires, étude spéciale requise.", badge: "bg-[#E85D04]/10 text-[#E85D04] border-[#E85D04]/30" },
  { cls: "RGA-3", label: "Risque Très Élevé", desc: "Terrain impropre aux constructions légères sans traitement. Renforcement sol ou pieux obligatoires.", badge: "bg-red-500/10 text-red-500 border-red-500/30" },
];

const platforms = [
  { num: "01", name: "Web App", tech: "React · Leaflet · PostGIS", desc: "Consultation navigateur, cartes interactives 29 407 mailles, filtres multi-paramètres/horizon, rapports PDF instantanés. Accès depuis tout appareil.", features: ["Cartes Leaflet interactives", "Filtres VBS/IP/WL/CBR/horizon", "Rapports PDF auto-générés", "Export CSV / GeoJSON / SHP"], status: "Production", col: "text-[#40916C]" },
  { num: "02", name: "Mobile PWA", tech: "Workbox 7 · Offline-first", desc: "Collecte terrain avec sync automatique. Cache offline-first via Workbox 7. Formulaire de sondage avec GPS natif et photos géoréférencées.", features: ["Offline-first (Workbox 7)", "Sync auto au retour réseau", "Formulaire sondage terrain", "GPS + photos géoréférencées"], status: "Beta", col: "text-white/50" },
  { num: "03", name: "Desktop Pro", tech: "Tauri v2 · PostgreSQL embarqué", desc: "100% offline. PostgreSQL embarqué avec 29 407 mailles pré-chargées. Export QGIS/SHP/DXF pour zones sans connectivité en Kara et Savanes.", features: ["100% offline", "PostgreSQL embarqué", "Export QGIS / SHP / DXF", "Pas d'abonnement cloud requis"], status: "Développement", col: "text-white/30" },
  { num: "04", name: "API REST", tech: "Rust/Axum · ONNX Runtime", desc: "Endpoints JSON, jobs asynchrones pour krigeages lourds, ONNX Runtime pour inference ML. Latence < 50ms requêtes simples. SGS P10/P90 à la demande.", features: ["Rust/Axum (perf native)", "ONNX Runtime inference", "Async jobs (krigeage lourd)", "Latence < 50ms"], status: "Roadmap", col: "text-white/15" },
];

const pricingTiers = [
  { name: "Free", price: "0 $", period: "", desc: "Consultation de base", features: ["50 sondages / mois", "Visualisation Web", "3 paramètres H1", "Export PNG"], cta: "Accès Gratuit", accent: "border-[#e5e5e5]", ctaStyle: "border border-black/20 text-black hover:border-black" },
  { name: "Professionnel", price: "49 $", period: "/ mois", desc: "Bureaux d'études", features: ["29 407 mailles illimitées", "6 paramètres + 3 horizons", "Export PDF / CSV / GeoJSON", "SGS P10/P50/P90 inclus", "Support prioritaire"], cta: "Démarrer", accent: "border-[#40916C]", ctaStyle: "bg-[#40916C] text-white hover:bg-[#40916C]/90" },
  { name: "Organisation", price: "149 $", period: "/ mois", desc: "Équipes multi-sites", features: ["Tout Professionnel", "Desktop Pro offline", "API REST + Async krigeage", "10 utilisateurs", "RGA automatique + Fusion BLUP"], cta: "Demander une démo", accent: "border-[#e5e5e5]", ctaStyle: "border border-black/20 text-black hover:border-black" },
  { name: "Institutionnel", price: "Sur devis", period: "", desc: "Ministères, universités", features: ["Données souveraines on-premise", "Extension CEDEAO (v3.0)", "Formation équipe LNBTP/TREC", "API volume illimité", "SLA 99.5%"], cta: "Nous contacter", accent: "border-[#e5e5e5]", ctaStyle: "border border-black/20 text-black hover:border-black" },
];

/* ── Focus-tracked level card ─────────────────────────────── */
function LevelCard({
  lv,
  i,
  onActive,
}: {
  lv: (typeof hierarchyLevels)[0];
  i: number;
  onActive: (level: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useInView(ref, { margin: "0px 0px -75% 0px" });

  useEffect(() => {
    if (isActive) onActive(lv.level);
  }, [isActive, lv.level, onActive]);

  return (
    <motion.div
      ref={ref}
      className={`border-l-2 ${lv.border} pl-8 min-h-[72vh] flex flex-col justify-center py-[9vh] ${i < hierarchyLevels.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
      animate={{ opacity: isActive ? 1 : 0.22 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[9px] tracking-[0.3em] uppercase border px-2 py-1 ${lv.border} ${lv.bg} ${lv.color}`}>{lv.level}</span>
          <div>
            <h3 className="text-xl font-medium text-black">{lv.name}</h3>
            <p className="text-xs text-[#999]">{lv.full}</p>
          </div>
        </div>
        <span className="font-mono text-[8px] tracking-[0.2em] text-[#ccc] uppercase flex-shrink-0">
          [ STATUS: {lv.status.toUpperCase()} ]
        </span>
      </div>

      <p className="font-mono text-[9px] text-[#40916C] mb-4">{lv.params}</p>
      <p className="text-sm text-[#555] leading-relaxed mb-6">{lv.desc}</p>

      <div className="space-y-0 border border-[#f0f0f0]">
        {lv.metrics.map((m) => (
          <div key={m.k} className="flex justify-between items-center px-4 py-2.5 border-b border-[#f8f8f8] last:border-0">
            <span className="font-mono text-[9px] text-[#999] uppercase tracking-wide">{m.k}</span>
            <span className="font-mono text-[10px] text-black font-medium">{m.v}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[9px] text-[#40916C] mt-4">{lv.winner}</p>
    </motion.div>
  );
}

export default function AtlasPage() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.55], [0, -70]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.35], [0, -30]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [activeLevel, setActiveLevel] = useState("L1");
  const handleActiveLevel = useCallback((level: string) => {
    setActiveLevel(level);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── HERO — SCRUBBED — BLACK ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end pb-24 px-8 md:px-16 bg-black overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "radial-gradient(ellipse at 30% 60%, #40916C 0%, transparent 55%), linear-gradient(#40916C 1px, transparent 1px), linear-gradient(90deg, #40916C 1px, transparent 1px)",
          backgroundSize: "100% 100%, 60px 60px, 60px 60px"
        }} />
        <div className="relative z-10 max-w-[1280px] mx-auto w-full pt-40">
          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[9px] tracking-[0.35em] text-[#40916C] uppercase border border-[#40916C]/30 px-3 py-1.5">v1.4.0 · Opérationnel</span>
              <span className="font-mono text-[9px] tracking-[0.35em] text-white/25 uppercase">/ Hiérarchie L1–L5</span>
            </div>
          </motion.div>

          {/* SCRUBBED TITLE */}
          <motion.h1
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-[20vw] md:text-[17vw] font-medium tracking-tighter leading-none text-white"
          >
            Atlas
          </motion.h1>

          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-t border-white/10 pt-8 mt-4 gap-8">
              <div className="max-w-xl">
                <p className="text-xl text-white/50 leading-relaxed mb-2">Premier atlas géotechnique adaptatif d&apos;Afrique de l&apos;Ouest</p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">573 sondages · 56 600 km² · 29 407 mailles · KED-H 5 niveaux · 79 contextes géologiques</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <a href="#modeles" className="bg-[#40916C] text-white px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-[#40916C]/90 transition-colors">Modèles L1–L5</a>
                <a href="#plateformes" className="border border-white/20 px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-white transition-colors">Plateformes →</a>
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

      {/* ── STATS — WHITE ── */}
      <section className="py-20 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { val: "573", label: "Sondages géoréférencés terrain", tag: "/ TERRAIN" },
            { val: "56 600", label: "km² — Togo national", tag: "/ COUVERTURE" },
            { val: "29 407", label: "Mailles prédictives 2km×2km", tag: "/ RÉSOLUTION" },
            { val: "46.9%", label: "Réduction variance Fusion BLUP", tag: "/ PRÉCISION" },
          ].map((s, i) => (
            <FadeIn key={s.tag} delay={i * 0.06} className={`py-8 md:py-0 px-0 md:px-10 ${i > 0 ? "border-t md:border-t-0 md:border-l border-[#e5e5e5]" : ""}`}>
              <p className="font-mono text-[9px] tracking-[0.35em] text-[#40916C] uppercase mb-3">{s.tag}</p>
              <p className="text-5xl md:text-6xl font-medium tracking-tighter text-black leading-none mb-2">{s.val}</p>
              <p className="text-xs text-[#555] mt-2">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── BASE DE DONNÉES — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Base de Données</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">La première base<br /><span className="text-white/25">géotechnique numérique<br />d&apos;Afrique de l&apos;Ouest.</span></h2>
            <p className="text-base text-white/40 leading-relaxed mb-10 max-w-lg">1 884 146 valeurs interpolées sur 29 407 mailles × 3 horizons × 11 paramètres. PostGIS 16, audit SHA3-256, conformité RGPD. LNBTP, TREC, LAB TP, GeoTech, FORMATEC.</p>
            <div className="space-y-0">
              {[
                { label: "Argilosité", val: "VBS · IP · WL · WP · EG" },
                { label: "Portance", val: "CBR 95% · Rd · γd · wopt · Em · Pl" },
                { label: "Horizons", val: "H1 (0–1m) · H2 (1–1.5m) · H3 (>1.5m)" },
                { label: "Maillage", val: "29 407 mailles × 2km² — EPSG:25231 UTM31N" },
                { label: "Méthodes stockées", val: "9 méthodes — 1 884 146 lignes" },
                { label: "Audit", val: "SHA3-256 par enregistrement" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4 py-3.5 border-b border-white/5">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase min-w-[140px]">{row.label}</span>
                  <span className="font-mono text-[10px] text-[#40916C]">{row.val}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="bg-black border border-white/10 p-6 font-mono text-[10px]">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-[#40916C]/60" />
                <span className="ml-2 text-white/25 text-[9px] tracking-wider">atlas_clean — PostGIS 16 · 127.0.0.1:5433</span>
              </div>
              <div className="space-y-0.5 leading-loose">
                <p className="text-white/15">-- 9 méthodes · 1 884 146 valeurs</p>
                <p><span className="text-[#40916C]">ked_hierarchical_5levels</span></p>
                <p className="text-white/25 pl-4">12 param · 352 884 lignes · σ² stockée</p>
                <p className="mt-1"><span className="text-[#40916C]">regression_kriging_scorpan</span></p>
                <p className="text-white/25 pl-4">15 param · 441 105 lignes · PyKrige</p>
                <p className="mt-1"><span className="text-[#40916C]">ked_rk_fusion_bayesian</span></p>
                <p className="text-white/25 pl-4">15 param · 441 105 lignes · BLUP</p>
                <p className="mt-1"><span className="text-[#40916C]">mtgp_icm_gpflow</span></p>
                <p className="text-white/25 pl-4">3 param · 88 221 lignes · GPflow</p>
                <p className="mt-2 text-white/15">-- Statistiques cumulées H1</p>
                <p className="text-white/30">VBS N=106  IP N=112  WL N=112</p>
                <p className="text-white/30">WP N=112  EG N=93  CBR N=280</p>
                <p className="mt-2 text-white/15">-- Index spatiaux</p>
                <p><span className="text-[#40916C]">INDEX GIST</span><span className="text-white/25">(sondages.geom)</span></p>
                <p><span className="text-[#40916C]">INDEX GIST</span><span className="text-white/25">(mailles_2km.geom)</span></p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HIÉRARCHIE L1–L5 — TACTICAL FOCUS — WHITE ── */}
      <section id="modeles" className="px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        {/* Top bar */}
        <div className="py-4 border-b border-[#f0f0f0] flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-[0.4em] text-[#ccc] uppercase">/ Architecture Scientifique · L1–L5</p>
          <motion.p
            key={activeLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[9px] tracking-[0.25em] text-[#40916C] uppercase"
          >
            NIVEAU ACTIF: {activeLevel}
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-0 md:gap-20 xl:gap-28 items-start">

          {/* LEFT — STICKY FULL HEIGHT */}
          <div className="hidden md:flex md:w-[35%] xl:w-[32%] sticky top-0 h-screen flex-col justify-between py-14 pr-8 border-r border-[#f0f0f0]">

            {/* TOP */}
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] text-[#40916C] uppercase mb-5">/ Architecture Scientifique</p>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-5">
                Hiérarchie L1–L5.<br />
                <span className="text-[#ccc]">Six modèles.<br />Un atlas.</span>
              </h2>
              <p className="text-sm text-[#999] leading-relaxed max-w-sm">
                Chaque niveau apporte une contribution orthogonale : dérive géologique, covariables SCORPAN, fusion BLUP, satellite, GP multi-tâche, simulation stochastique.
              </p>
            </div>

            {/* MIDDLE: animated navigator */}
            <div className="space-y-2.5">
              {hierarchyLevels.map((lv) => (
                <div key={lv.level} className="flex items-center gap-3">
                  <motion.div
                    className="h-px flex-shrink-0"
                    animate={{
                      width: lv.level === activeLevel ? 20 : 8,
                      backgroundColor: lv.level === activeLevel ? "#40916C" : "#e5e5e5",
                    }}
                    transition={{ duration: 0.35 }}
                  />
                  <motion.span
                    className="font-mono text-[9px] tracking-[0.2em] uppercase"
                    animate={{ color: lv.level === activeLevel ? "#40916C" : "#ccc" }}
                    transition={{ duration: 0.35 }}
                  >
                    {lv.level} · {lv.name}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* BOTTOM: active level metric */}
            <div className="border border-[#f0f0f0] p-5">
              <p className="font-mono text-[8px] text-[#ccc] tracking-[0.3em] uppercase mb-3">
                MEILLEUR_{activeLevel}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLevel}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const lv = hierarchyLevels.find((l) => l.level === activeLevel);
                    if (!lv) return null;
                    return (
                      <>
                        <p className="font-mono text-[10px] text-[#40916C] mb-1">{lv.winner}</p>
                        {lv.metrics[0] && (
                          <p className="font-mono text-[9px] text-[#999]">
                            {lv.metrics[0].k}: <span className="text-black">{lv.metrics[0].v}</span>
                          </p>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT — SCROLLING with focus lens */}
          <div className="flex-1 min-w-0 md:pl-14 xl:pl-16">
            {hierarchyLevels.map((lv, i) => (
              <LevelCard
                key={lv.level}
                lv={lv}
                i={i}
                onActive={handleActiveLevel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALIDATION LOO-CV — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Validation Rigoureuse</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">LOO-CV complet.<br /><span className="text-white/25">Bloc spatial. Roberts 2017.</span></h2>
            <p className="text-base text-white/40 max-w-2xl mb-12 leading-relaxed">Leave-One-Out Cross-Validation complète sur chaque paramètre/horizon. Validation bloc-spatial en 5 bandes N-S latitudinales pour quantifier l&apos;optimisme LOO. Aucune sur-ajustement silencieux.</p>
          </FadeIn>

          {/* Table LOO comparaison principale */}
          <FadeIn delay={0.07}>
            <div className="border border-white/10 overflow-x-auto mb-8">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/3">
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">LOO-RMSE H1 — Comparaison KED-H / Bloc-Spatial / RK-SCORPAN / VfS-PLS</span>
              </div>
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/8">
                    {["Paramètre", "Unité", "KED-H", "Bloc-Spatial", "Optimisme", "RK-SCORPAN", "VfS-PLS"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-[0.2em] text-white/25 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { p: "VBS", u: "g/100g", ked: "2.933", bloc: "4.067", opt: "+29.2%", rk: "2.378 ★", vfs: "2.788" },
                    { p: "IP", u: "%", ked: "10.129", bloc: "10.776", opt: "+2.8%", rk: "10.798", vfs: "—" },
                    { p: "WL", u: "%", ked: "12.314", bloc: "13.929", opt: "+12.5%", rk: "16.068", vfs: "—" },
                    { p: "WP", u: "%", ked: "7.771", bloc: "8.510", opt: "+9.3%", rk: "8.081", vfs: "—" },
                    { p: "EG", u: "%", ked: "1.712", bloc: "1.768", opt: "+4.5%", rk: "1.179 ★", vfs: "—" },
                    { p: "CBR 95%", u: "%", ked: "13.27", bloc: "—", opt: "—", rk: "—", vfs: "—" },
                  ].map((row, i) => (
                    <tr key={row.p} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className="px-5 py-3 font-mono text-[10px] text-[#40916C] font-medium">{row.p}</td>
                      <td className="px-5 py-3 font-mono text-[10px] text-white/30">{row.u}</td>
                      <td className="px-5 py-3 font-mono text-[10px] text-white">{row.ked}</td>
                      <td className="px-5 py-3 font-mono text-[10px] text-white/50">{row.bloc}</td>
                      <td className="px-5 py-3 font-mono text-[10px] text-[#E85D04]">{row.opt}</td>
                      <td className="px-5 py-3 font-mono text-[10px] text-white">{row.rk}</td>
                      <td className="px-5 py-3 font-mono text-[10px] text-white/50">{row.vfs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-5 py-3 font-mono text-[9px] text-white/20">★ Meilleur modèle absolu. Validation bloc-spatial : 5 bandes N-S latitudinales (Roberts et al. 2017). LOO complet inclut entraînement Ridge N-1 + krigeage résiduel.</p>
            </div>
          </FadeIn>

          {/* SGS P10/P50/P90 + variance reduction inline */}
          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="border border-white/10 overflow-x-auto">
                <div className="px-6 py-4 border-b border-white/10 bg-white/3">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">SGS L5 — Intervalles P10/P50/P90 (H1, 29 407 mailles)</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      {["Param.", "Unité", "P10", "P50", "P90", "Amplitude"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-[9px] tracking-[0.15em] text-white/25 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { p: "VBS", u: "g/100g", p10: "1.5", p50: "3.8", p90: "8.2", amp: "6.7" },
                      { p: "IP", u: "%", p10: "10.0", p50: "20.1", p90: "30.1", amp: "20.1" },
                      { p: "WL", u: "%", p10: "27.0", p50: "39.6", p90: "52.8", amp: "25.8" },
                      { p: "WP", u: "%", p10: "12.6", p50: "19.6", p90: "27.6", amp: "15.0" },
                      { p: "EG", u: "%", p10: "2.1", p50: "3.8", p90: "6.3", amp: "4.2" },
                      { p: "CBR", u: "%", p10: "10.9", p50: "26.2", p90: "62.3", amp: "51.4" },
                    ].map((row, i) => (
                      <tr key={row.p} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#40916C]">{row.p}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white/30">{row.u}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white/50">{row.p10}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white font-medium">{row.p50}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white/50">{row.p90}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#40916C]">{row.amp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
            <FadeIn delay={0.12}>
              <div className="border border-white/10 overflow-x-auto">
                <div className="px-6 py-4 border-b border-white/10 bg-white/3">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">Réduction Variance — Fusion BLUP (H1)</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      {["Param.", "σ² KED", "σ² RK", "σ² Fusion", "Réduction"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-[9px] tracking-[0.15em] text-white/25 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { p: "VBS", ked: "12.45", rk: "10.60", fus: "5.73", red: "45.9%" },
                      { p: "IP", ked: "90.99", rk: "79.87", fus: "42.33", red: "47.0%" },
                      { p: "WL", ked: "174.2", rk: "140.4", fus: "77.6", red: "44.7%" },
                      { p: "WP", ked: "54.54", rk: "60.37", fus: "28.70", red: "47.4%" },
                      { p: "EG", ked: "2.681", rk: "2.547", fus: "1.304", red: "48.8%" },
                      { p: "CBR", ked: "—", rk: "—", fus: "—", red: "37.0%" },
                    ].map((row, i) => (
                      <tr key={row.p} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#40916C]">{row.p}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white/40">{row.ked}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white/40">{row.rk}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white">{row.fus}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#40916C] font-medium">{row.red}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-4 py-3 font-mono text-[9px] text-white/20">Moyenne : 46.9% ± 0.6% · Certifié 100% des 29 407 mailles · Propriété BLUP : σ²_fusion ≤ min(σ²_KED, σ²_RK)</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 5 RÉGIONS PHYSIOGRAPHIQUES — WHITE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#40916C] uppercase mb-4">/ Cartographie Nationale</p>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-black mb-4">5 régions.<br /><span className="text-[#999]">5 régimes géotechniques.</span></h2>
            <p className="text-base text-[#555] max-w-2xl mb-4 leading-relaxed">La carte VBS révèle trois régimes distincts : Argileux (22% territoire, VBS &gt; 4.5 g/100g), Intermédiaire (53%, VBS 2.5–4.5), Faiblement argileux (25%, VBS &lt; 2.5). La dérive hiérarchique capture cette tripartition.</p>
            <div className="flex gap-8 mb-16">
              <div>
                <p className="font-mono text-[9px] text-[#999] uppercase tracking-wide mb-1">VBS national prédit (KED-H)</p>
                <p className="font-mono text-[11px] text-black">Z̄* = 3.65 g/100g · σ* = 1.36</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-[#999] uppercase tracking-wide mb-1">Fusion BLUP</p>
                <p className="font-mono text-[11px] text-black">Z̄* = 3.83 g/100g · σ* = 1.48</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-[#999] uppercase tracking-wide mb-1">Risque A4 (VBS &gt; 6)</p>
                <p className="font-mono text-[11px] text-black">≈22% territoire H1 → ≈14% H3</p>
              </div>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-[#e5e5e5]">
            {regions.map((r, i) => (
              <FadeIn key={r.name} delay={i * 0.06}>
                <div className={`bg-white p-6 h-full flex flex-col border-t-2 ${r.color}`}>
                  <div className="mb-4">
                    <h3 className="text-base font-medium text-black mb-1">{r.name}</h3>
                    <p className="font-mono text-[8px] text-[#ccc] uppercase tracking-wide">{r.n}</p>
                  </div>
                  <p className="text-xs text-[#999] mb-4 leading-relaxed">{r.geo}</p>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="font-mono text-[9px] text-[#ccc] uppercase">VBS</span>
                      <span className="font-mono text-[9px] text-black">{r.vbs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-[9px] text-[#ccc] uppercase">CBR</span>
                      <span className="font-mono text-[9px] text-black">{r.cbr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-[9px] text-[#ccc] uppercase">RMSE KED</span>
                      <span className="font-mono text-[9px] text-black">{r.rmse_ked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-[9px] text-[#ccc] uppercase">σ²_K moy.</span>
                      <span className="font-mono text-[9px] text-[#40916C]">{r.sigma2}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed flex-1">{r.desc}</p>
                  <span className={`mt-4 font-mono text-[8px] tracking-[0.2em] uppercase border px-2 py-1 self-start ${r.badge}`}>{r.rga}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORRÉLATIONS & VARIOGRAMME — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Corrélations & Variogramme</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-12">Structure spatiale<br /><span className="text-white/25">quantifiée.</span></h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Matrice corrélations */}
            <FadeIn delay={0.07}>
              <div className="border border-white/10">
                <div className="px-6 py-4 border-b border-white/10 bg-white/3">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">Matrice de Pearson — Argilosité (H1, n=101–105)</p>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full min-w-[360px] font-mono text-[10px]">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-white/20 text-left"></th>
                        {["VBS", "IP", "WL", "WP", "EG"].map((h) => (
                          <th key={h} className="px-3 py-2 text-white/30 text-center">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { row: "VBS", vals: ["1.000", "0.324", "0.304", "0.074", "0.350"] },
                        { row: "IP", vals: ["", "1.000", "0.804", "0.091", "0.735"] },
                        { row: "WL", vals: ["", "", "1.000", "0.666", "0.731"] },
                        { row: "WP", vals: ["", "", "", "1.000", "0.288"] },
                        { row: "EG", vals: ["", "", "", "", "1.000"] },
                      ].map((r) => (
                        <tr key={r.row} className="border-t border-white/5">
                          <td className="px-3 py-2 text-[#40916C]">{r.row}</td>
                          {r.vals.map((v, j) => (
                            <td key={j} className={`px-3 py-2 text-center ${
                              v === "" ? "text-white/10" :
                              parseFloat(v) >= 0.7 ? "text-[#40916C] font-medium" :
                              parseFloat(v) >= 0.3 ? "text-white/70" :
                              parseFloat(v) > 0.1 ? "text-white/40" :
                              "text-white/20"
                            }`}>{v || "—"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 space-y-1">
                    <p className="font-mono text-[9px] text-[#40916C]">IP–WL r=0.804 · IP–EG r=0.735 · WL–EG r=0.731 → Groupe plasticité MTGP</p>
                    <p className="font-mono text-[9px] text-white/25">VBS–WP r=0.074 · IP–WP r=0.091 → WP non amélioré par ICM (Levene p=0.039)</p>
                    <p className="font-mono text-[9px] text-white/20">Portance : CBR–γd r=0.614 · γd–wopt r=−0.635 → Groupe compactage MTGP</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Variogrammes + Sensibilité */}
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                <div className="border border-white/10">
                  <div className="px-6 py-4 border-b border-white/10 bg-white/3">
                    <p className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">Variogrammes Sphériques H1 — Paramètres Ajustés</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-[10px]">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["Param.", "C₀", "C₀+C", "Portée (km)", "Rapp. pépite"].map((h) => (
                            <th key={h} className="text-left px-4 py-2.5 text-white/25 uppercase text-[9px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { p: "VBS", c0: "2.80", c: "14.00", a: "220", rp: "0.200" },
                          { p: "IP", c0: "22.0", c: "145.0", a: "310", rp: "0.152" },
                          { p: "WL", c0: "45.0", c: "185.0", a: "280", rp: "0.243" },
                          { p: "WP", c0: "15.0", c: "72.0", a: "195", rp: "0.208" },
                          { p: "EG", c0: "0.85", c: "3.60", a: "175", rp: "0.236" },
                        ].map((row, i) => (
                          <tr key={row.p} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                            <td className="px-4 py-2.5 text-[#40916C]">{row.p}</td>
                            <td className="px-4 py-2.5 text-white/50">{row.c0}</td>
                            <td className="px-4 py-2.5 text-white">{row.c}</td>
                            <td className="px-4 py-2.5 text-white/80">{row.a}</td>
                            <td className="px-4 py-2.5 text-white/40">{row.rp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border border-white/10">
                  <div className="px-6 py-4 border-b border-white/10 bg-white/3">
                    <p className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">Paramètres ICM — MTGP/GPflow (H1, rang 2)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-[10px]">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["Param.", "a_d1", "a_d2", "ℓ (km)", "σ²_n"].map((h) => (
                            <th key={h} className="text-left px-4 py-2.5 text-white/25 uppercase text-[9px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { p: "VBS", a1: "0.319", a2: "0.102", l: "185", sn: "0.42" },
                          { p: "IP", a1: "0.773", a2: "0.215", l: "210", sn: "8.3" },
                          { p: "WL", a1: "0.773", a2: "0.181", l: "225", sn: "12.1" },
                          { p: "WP", a1: "0.062", a2: "0.044", l: "180", sn: "4.8" },
                          { p: "EG", a1: "0.721", a2: "0.163", l: "165", sn: "0.31" },
                        ].map((row, i) => (
                          <tr key={row.p} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                            <td className="px-4 py-2.5 text-[#40916C]">{row.p}</td>
                            <td className="px-4 py-2.5 text-white/60">{row.a1}</td>
                            <td className="px-4 py-2.5 text-white/40">{row.a2}</td>
                            <td className="px-4 py-2.5 text-white/70">{row.l}</td>
                            <td className="px-4 py-2.5 text-white/40">{row.sn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="px-4 py-3 font-mono text-[9px] text-white/20">a_d1, a_d2 = coefficients ICM appris Adam 500 itr. WP : a_d1=0.062 quasi-nul — non amélioré.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CLASSIFICATION NF P 11-300 + MEILLEUR MODÈLE — WHITE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#40916C] uppercase mb-4">/ Classification & Modèle Optimal</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-12">NF P 11-300.<br /><span className="text-[#999]">Modèle optimal par paramètre.</span></h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.07}>
              <div className="border border-[#e5e5e5]">
                <div className="px-6 py-4 border-b border-[#e5e5e5] bg-[#fafafa]">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">Classification NF P 11-300 — Seuils Atlas</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f0f0f0]">
                      {["Classe", "VBS (g/100g)", "IP (%)", "Sol type", "Recommandation"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-mono text-[9px] text-[#ccc] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cls: "A1", vbs: "< 0.2", ip: "< 12", sol: "Sable peu plastique", rec: "Fondations légères", col: "text-[#40916C]" },
                      { cls: "A2", vbs: "0.2–1.5", ip: "12–25", sol: "Sable limoneux", rec: "Fondations standard", col: "text-[#F5A623]" },
                      { cls: "A3", vbs: "1.5–6.0", ip: "25–40", sol: "Argile plastique", rec: "Fondations renforcées", col: "text-[#E85D04]" },
                      { cls: "A4", vbs: "> 6.0", ip: "> 40", sol: "Argile très plastique", rec: "Fondations profondes / pieux", col: "text-red-500" },
                    ].map((row) => (
                      <tr key={row.cls} className="border-b border-[#f5f5f5]">
                        <td className={`px-5 py-3 font-mono text-[10px] font-medium ${row.col}`}>{row.cls}</td>
                        <td className="px-5 py-3 font-mono text-[10px] text-black">{row.vbs}</td>
                        <td className="px-5 py-3 font-mono text-[10px] text-black">{row.ip}</td>
                        <td className="px-5 py-3 text-sm text-[#555]">{row.sol}</td>
                        <td className="px-5 py-3 text-xs text-[#999]">{row.rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-5 py-3 font-mono text-[9px] text-[#ccc]">Zone à risque A3/A4 : ≈22% territoire H1 → ≈14% H3. IP=25% seuil traitement chaux NF P 98-114.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="border border-[#e5e5e5]">
                <div className="px-6 py-4 border-b border-[#e5e5e5] bg-[#fafafa]">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-[#40916C] uppercase">Meilleur modèle par paramètre et horizon</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f0f0f0]">
                      {["Param.", "H1 (0–1m)", "LOO H1", "H2 (1–1.5m)", "H3 (>1.5m)"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-[9px] text-[#ccc] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { p: "VBS", h1: "F/RK", loo: "2.378", h2: "KED", h3: "F/RK" },
                      { p: "IP", h1: "F/KED", loo: "10.129", h2: "F/RK", h3: "KED" },
                      { p: "WL", h1: "F/KED", loo: "12.314", h2: "KED", h3: "KED" },
                      { p: "WP", h1: "F/RK", loo: "7.771", h2: "KED", h3: "F/RK" },
                      { p: "EG", h1: "F/RK", loo: "1.179", h2: "KED", h3: "F/RK" },
                      { p: "CBR", h1: "F/RK", loo: "13.27%", h2: "—", h3: "—" },
                      { p: "Rd", h1: "KED", loo: "3.45 MPa", h2: "KED", h3: "KED" },
                      { p: "γd", h1: "F/KED", loo: "1.41 kN/m³", h2: "—", h3: "—" },
                    ].map((row, i) => (
                      <tr key={row.p} className={`border-b border-[#f5f5f5] ${i % 2 === 0 ? "" : "bg-[#fafafa]"}`}>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#40916C] font-medium">{row.p}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-black">{row.h1}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#555]">{row.loo}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#999]">{row.h2}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#999]">{row.h3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-4 py-3 font-mono text-[9px] text-[#ccc]">F = Fusion BLUP disponible. Anomalie H2 : covariables SCORPAN (surface) perdent pouvoir prédictif à 1.0–1.5m.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── RGA — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Classification RGA</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Risque Retrait-Gonflement<br /><span className="text-white/25">sur 29 407 mailles.</span></h2>
            <p className="text-base text-white/35 max-w-2xl mb-4 leading-relaxed">Calculée depuis les paramètres VBS, IP, WL krigeés. Intégrée comme covariable prioritaire (niveau 1) dans la dérive hiérarchique KED-H — première intégration de ce type en Afrique de l&apos;Ouest. Score transmis aux calculs de fondations LCPI.</p>
            <p className="font-mono text-[9px] text-white/25 mb-16">79 contextes géologiques BRGM · 5 zones géomorphologiques spéciales · Dépression de la Lama EG ≈ 8.5% vs 4.3% nationale</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {rgaClasses.map((cls) => (
              <FadeIn key={cls.cls}>
                <div className="bg-black p-8 h-full">
                  <div className={`inline-block font-mono text-[10px] tracking-[0.2em] uppercase border px-3 py-1.5 mb-5 ${cls.badge}`}>{cls.cls}</div>
                  <h3 className="text-base font-medium text-white mb-3">{cls.label}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{cls.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATEFORMES — WHITE ── */}
      <section id="plateformes" className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#999] uppercase mb-4">/ Plateformes</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-16">4 points d&apos;accès.<br /><span className="text-[#999]">Zéro compromis.</span></h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-px bg-[#e5e5e5]">
            {platforms.map((p) => (
              <FadeIn key={p.num}>
                <div className="bg-white border-l-4 border-[#40916C]/30 p-8 md:p-10 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-[#ccc] uppercase">{p.num}</span>
                    <span className={`font-mono text-[9px] tracking-[0.2em] uppercase ${p.col}`}>{p.status}</span>
                  </div>
                  <h3 className="text-xl font-medium text-black mb-1">{p.name}</h3>
                  <p className="font-mono text-[9px] text-[#999] mb-5 tracking-wider">{p.tech}</p>
                  <p className="text-sm text-[#555] leading-relaxed mb-6">{p.desc}</p>
                  <ul className="space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#999]">
                        <span className="text-[#40916C]">→</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── API PHASE 2 — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Phase 2 — API REST</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">Requête géotechnique<br /><span className="text-white/25">en une ligne.</span></h2>
            <p className="text-sm text-white/35 leading-relaxed mb-8 max-w-md">Rust/Axum avec ONNX Runtime pour l&apos;inférence ML. Latence &lt; 50ms sur les requêtes simples. Jobs asynchrones (WebSocket) pour les krigeages lourds. SGS P10/P90 à la demande.</p>
            <div className="space-y-4">
              {[
                { method: "GET", path: "/v1/maille", desc: "VBS/IP/WL/CBR + RGA + PICP95 + Fusion BLUP pour un point" },
                { method: "GET", path: "/v1/sgs", desc: "P10/P50/P90 (SGS L5) pour un point ou une bbox" },
                { method: "POST", path: "/v1/krigeage/async", desc: "Job KED-H ou RK-SCORPAN sur bbox — WS progress stream" },
                { method: "GET", path: "/v1/rga/score", desc: "Score RGA + recommandation fondations NF P 11-300" },
              ].map((ep) => (
                <div key={ep.path} className="flex items-start gap-4 py-3 border-b border-white/5">
                  <span className="font-mono text-[9px] text-[#40916C] uppercase tracking-wider min-w-[36px] mt-0.5">{ep.method}</span>
                  <span className="font-mono text-[10px] text-white min-w-[200px]">{ep.path}</span>
                  <span className="text-xs text-white/30">{ep.desc}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="bg-black border border-white/10 p-6 font-mono text-[10px]">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
                <span className="text-white/25 text-[9px] tracking-wider">atlas-api · réponse exemple · lat=6.137,lng=1.212</span>
              </div>
              <div className="space-y-0.5 leading-loose text-[10px]">
                <p className="text-white/30">{"{"}</p>
                <p className="pl-4"><span className="text-[#40916C]">&quot;parametres&quot;</span><span className="text-white/30">: {"{"}</span></p>
                <p className="pl-8 text-white/40">&quot;VBS&quot;: 2.3, &quot;IP&quot;: 18.4,</p>
                <p className="pl-8 text-white/40">&quot;WL&quot;: 42.1, &quot;WP&quot;: 16.2,</p>
                <p className="pl-8 text-white/40">&quot;EG&quot;: 3.8, &quot;CBR_95&quot;: 28.5</p>
                <p className="pl-4 text-white/30">{"}"},</p>
                <p className="pl-4"><span className="text-[#40916C]">&quot;rga_class&quot;</span><span className="text-white/30">: </span><span className="text-white">1</span><span className="text-white/30">,</span></p>
                <p className="pl-4"><span className="text-[#40916C]">&quot;nfp11300&quot;</span><span className="text-white/30">: </span><span className="text-white">&quot;A2&quot;</span><span className="text-white/30">,</span></p>
                <p className="pl-4"><span className="text-[#40916C]">&quot;picp95_vbs&quot;</span><span className="text-white/30">: [1.8, 2.9],</span></p>
                <p className="pl-4"><span className="text-[#40916C]">&quot;sgs_vbs&quot;</span><span className="text-white/30">: {"{"}</span></p>
                <p className="pl-8 text-white/40">&quot;p10&quot;: 1.5, &quot;p50&quot;: 2.3, &quot;p90&quot;: 4.1</p>
                <p className="pl-4 text-white/30">{"}"}</p>
                <p className="pl-4"><span className="text-[#40916C]">&quot;latence_ms&quot;</span><span className="text-white/30">: </span><span className="text-white">38</span></p>
                <p className="text-white/30">{"}"}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── INTÉGRATION — WHITE ── */}
      <section className="py-24 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#999] uppercase mb-4">/ Intégration Écosystème</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-12">Atlas alimente l&apos;écosystème.</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { from: "Atlas", to: "LCPI", col: "text-[#40916C] border-[#40916C]/30", title: "Atlas → Fondations LCPI", desc: "VBS, IP, WL, WP, capacité portante et classe RGA transmis directement au module Fondations. Les fondations sont dimensionnées sur les données réelles terrain NF P 11-300, pas sur des hypothèses conservatrices. PICP95 et P90 SGS pour ouvrages à enjeux.", tags: ["VBS/IP/WL/WP", "Classe NF P 11-300", "RGA class", "PICP95 + SGS P90"] },
              { from: "Atlas", to: "IgnisCore", col: "text-[#E85D04] border-[#E85D04]/30", title: "Atlas → Ressources IgnisCore", desc: "Les données de sol (type pédologique FAO, textures), climatologie (Pann, BIO12) et occupation des terres informent EnergyMap AI (IgnisCore) pour la planification territoriale biomasse et la modélisation des ressources thermiques.", tags: ["Type de sol FAO", "Climatologie BIO12", "Occupation terres", "H3 zones profondes"] },
            ].map((link) => (
              <FadeIn key={link.title}>
                <div className={`border ${link.col.split(" ")[1]} p-8 md:p-10 h-full`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`font-mono text-[10px] tracking-[0.25em] ${link.col.split(" ")[0]} uppercase`}>{link.from}</span>
                    <span className="text-[#ccc]">→</span>
                    <span className="font-mono text-[10px] tracking-[0.25em] text-black uppercase">{link.to}</span>
                  </div>
                  <h3 className="text-base font-medium text-black mb-3">{link.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed mb-6">{link.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {link.tags.map((t) => (
                      <span key={t} className="font-mono text-[9px] text-[#999] border border-[#e5e5e5] px-2.5 py-1 uppercase tracking-wide">{t}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Tarification</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16">Accessible.<br /><span className="text-white/25">Scalable.</span></h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {pricingTiers.map((tier) => (
              <FadeIn key={tier.name}>
                <div className={`bg-black border-t-2 ${tier.accent} p-8 h-full flex flex-col`}>
                  <div className="mb-6">
                    <p className="font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase mb-3">{tier.desc}</p>
                    <h3 className="text-xl font-medium text-white mb-1">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-medium text-white">{tier.price}</span>
                      <span className="text-sm text-white/30">{tier.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/40">
                        <span className="text-[#40916C] mt-0.5 flex-shrink-0">→</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="#demo" className={`text-center py-3 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors ${tier.ctaStyle}`}>{tier.cta}</a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — WHITE ── */}
      <section id="demo" className="py-40 px-8 md:px-16 bg-white border-t border-[#e5e5e5] text-center">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.4em] text-[#999] uppercase mb-6">/ Accéder à Atlas</p>
            <h2 className="text-4xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-3xl mx-auto mb-10 text-black text-balance">
              La géotechnique<br /><span className="text-[#40916C]">sans frontières.</span>
            </h2>
            <p className="text-base text-[#555] max-w-lg mx-auto mb-4 leading-relaxed">573 sondages. 29 407 mailles. Hiérarchie L1–L5. Fusion BLUP certifiée 46.9%. Extension CEDEAO v3.0 — Bénin, Ghana, Burkina Faso.</p>
            <p className="font-mono text-[9px] text-[#ccc] mb-12 uppercase tracking-wide">Remerciements BRGM · TREC · LAB TP · LNBTP · GeoTech · Institut FORMATEC</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/" className="bg-[#40916C] text-white px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-[#40916C]/90 transition-colors">Explorer les données</a>
              <a href="/" className="border border-black/20 text-black px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:border-black transition-colors">← Retour à l&apos;accueil</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
