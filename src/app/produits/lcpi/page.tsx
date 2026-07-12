"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { ModulesStickyList } from "@/components/ui/ModulesStickyList";

const modules = [
  {
    tag: "/ 01", name: "AEP & Réseaux d'Eau Potable",
    desc: "Hardy-Cross natif, optimisation multi-objectif NSGA-II (diamètres, pressions, coûts). Export EPANET INP. Vérification EN 805.",
    specs: ["Hardy-Cross", "NSGA-II", "EN 805", "EPANET export"],
    status: "Production", statusColor: "text-cyan",
  },
  {
    tag: "/ 02", name: "Hydraulique Pluviale",
    desc: "Débits de pointe par méthode rationnelle et Crupedix. Bassins versants, dalots, ponceaux, canaux à surface libre. Manning-Strickler.",
    specs: ["Méthode rationnelle", "Crupedix", "Manning-Strickler", "TC Kirpich"],
    status: "Production", statusColor: "text-cyan",
  },
  {
    tag: "/ 03", name: "Béton Armé BAEL 91 & EC2",
    desc: "Dimensionnement complet : poutres, dalles, poteaux, voiles, radiers, fondations isolées et filantes. Armatures calculées et dessinées.",
    specs: ["BAEL 91", "EC2", "Radiers", "Fondations"],
    status: "Production", statusColor: "text-cyan",
  },
  {
    tag: "/ 04", name: "Charpente Métallique EC3",
    desc: "Portiques industriels, charpentes légères, poutres composées. Flambement, déversement, résistance sections HEA/IPE/HEB.",
    specs: ["EC3", "HEA/IPE/HEB", "Flambement", "Déversement"],
    status: "Beta", statusColor: "text-[#888]",
  },
  {
    tag: "/ 05", name: "Construction Bois EC5",
    desc: "Charpentes, planchers, murs à ossature. Lamellé-collé, massif, CLT. Connexions mécaniques (boulons, pointes, connecteurs).",
    specs: ["EC5", "Lamellé-collé", "CLT", "Connexions"],
    status: "Beta", statusColor: "text-[#888]",
  },
  {
    tag: "/ 06", name: "Éléments Finis FEniCS",
    desc: "Analyse non-linéaire avancée, maillage adaptatif, portiques complexes, dalles 2D. Couplage PINN pour réduction de l'espace de calcul.",
    specs: ["FEniCS", "Non-linéaire", "Maillage adaptatif", "PINN"],
    status: "Roadmap", statusColor: "text-[#444]",
  },
];

const comparison = [
  { feature: "Prix d'entrée", lcpi: "Gratuit / 29 $/mois", epanet: "Gratuit (limité)", autocad: "2 000 $ /an", robot: "3 500 $ /an" },
  { feature: "Normes locales BAEL 91", lcpi: "✓ Natif", epanet: "—", autocad: "Partiel", robot: "Partiel" },
  { feature: "Eurocodes 2/3/5", lcpi: "✓ Complet", epanet: "—", autocad: "✓", robot: "✓" },
  { feature: "Optimisation NSGA-II", lcpi: "✓ Natif", epanet: "—", autocad: "—", robot: "—" },
  { feature: "Rapport signé Ed25519", lcpi: "✓ Systématique", epanet: "—", autocad: "—", robot: "—" },
  { feature: "CLI scriptable / CI-CD", lcpi: "✓ Python Typer", epanet: "—", autocad: "—", robot: "—" },
  { feature: "Desktop offline", lcpi: "✓ Tauri v2", epanet: "✓", autocad: "✓", robot: "✓" },
  { feature: "API REST intégrée", lcpi: "v2.5 (roadmap)", epanet: "—", autocad: "—", robot: "Partiel" },
];

const pricingTiers = [
  {
    name: "Free", price: "0 $", period: "", desc: "Pour découvrir",
    features: ["3 modules (AEP, Béton, Hydro)", "5 projets / mois", "PDF basique", "CLI uniquement"],
    cta: "Télécharger CLI", accent: "border-[#e5e5e5]", ctaStyle: "border border-black/20 hover:border-black text-black",
  },
  {
    name: "Standard", price: "29 $", period: "/ mois", desc: "Bureaux d'études",
    features: ["Tous les modules (15+)", "Projets illimités", "PDF/DOCX/XLSX", "CLI + Desktop GUI", "Support email"],
    cta: "Commencer", accent: "border-cyan", ctaStyle: "bg-cyan text-black hover:bg-cyan/90",
  },
  {
    name: "Pro", price: "79 $", period: "/ mois", desc: "Cabinets & API",
    features: ["Standard + API REST", "Intégration Atlas & IgnisCore", "White-label PDF", "5 utilisateurs", "Support prioritaire"],
    cta: "Demander une démo", accent: "border-[#e5e5e5]", ctaStyle: "border border-black/20 hover:border-black text-black",
  },
  {
    name: "Enterprise", price: "Sur devis", period: "", desc: "On-premise & institutions",
    features: ["On-premise deployment", "Active Directory SSO", "SLA garanti", "Formation équipe", "Support dédié 24/7"],
    cta: "Nous contacter", accent: "border-[#e5e5e5]", ctaStyle: "border border-black/20 hover:border-black text-black",
  },
];

const archTiers = [
  { tier: "CLI", tech: "Typer · Python", desc: "Calculs en ligne de commande, scriptable, CI/CD compatible. Zéro dépendance graphique.", status: "Production", barW: "100%", accent: "bg-cyan", textAccent: "text-cyan", borderAccent: "border-cyan/40" },
  { tier: "Desktop GUI", tech: "Tauri v2 · Rust + Python", desc: "Interface native offline, Windows/macOS/Linux. PostgreSQL embarqué.", status: "Développement", barW: "65%", accent: "bg-white/30", textAccent: "text-white/50", borderAccent: "border-white/15" },
  { tier: "API REST", tech: "FastAPI v2.5 · WebSocket", desc: "Endpoints JSON, jobs asynchrones, intégration LCPI/Atlas/IgnisCore.", status: "Roadmap v2.5", barW: "30%", accent: "bg-white/15", textAccent: "text-white/25", borderAccent: "border-white/8" },
  { tier: "SaaS Enterprise", tech: "Cloud · Multi-tenant", desc: "Déploiement cloud, SSO Active Directory, SLA garanti 99.9%.", status: "Roadmap 2027", barW: "10%", accent: "bg-white/8", textAccent: "text-white/15", borderAccent: "border-white/5" },
];

export default function LCPIPage() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(heroProgress, [0, 0.55], [1, 0]);
  const titleY = useTransform(heroProgress, [0, 0.55], [0, -70]);
  const subtitleOpacity = useTransform(heroProgress, [0, 0.35], [1, 0]);
  const subtitleY = useTransform(heroProgress, [0, 0.35], [0, -30]);
  const indicatorOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── HERO — SCRUBBED — BLACK ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end pb-24 px-8 md:px-16 bg-black overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
      >
        {/* Chaos -> Ordre — toile de fond du Dossier Double */}
        <div className="absolute inset-0 opacity-[0.28]" style={{
          backgroundImage: "url(/illustrations/lcpi/lcpi_abstract_chaos_ordre.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(#00C4D4 1px, transparent 1px), linear-gradient(90deg, #00C4D4 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full pt-40">
          {/* Badge */}
          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase border border-cyan/30 px-3 py-1.5">Solveur Double · 3 modules en production</span>
              <span className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase">/ Plateformes</span>
            </div>
          </motion.div>

          {/* SCRUBBED TITLE */}
          <motion.h1
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-[22vw] md:text-[18vw] font-medium tracking-tighter leading-none text-white"
          >
            LCPI
          </motion.h1>

          {/* Sub row */}
          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-t border-white/10 pt-8 mt-4 gap-8">
              <div className="max-w-xl">
                <p className="text-xl text-white/50 leading-relaxed mb-2">La Calculatrice de l&apos;Ingénieur Civil</p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">6 modules · 3 en production · 10-50× moins cher · 100% auditable</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <a href="#demo" className="bg-cyan text-black px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-cyan/90 transition-colors">Demander une démo</a>
                <a href="#modules" className="border border-white/20 px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-white transition-colors">Explorer →</a>
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
            { val: "6", label: "Modules de calcul (3 en production)", tag: "/ COUVERTURE" },
            { val: "3", label: "Domaines d'ingénierie actifs", tag: "/ DOMAINES" },
            { val: "10-50×", label: "Moins cher que l'alternative", tag: "/ ÉCONOMIE" },
            { val: "100%", label: "Auditable Ed25519", tag: "/ STANDARD ICES" },
          ].map((s, i) => (
            <FadeIn key={s.tag} delay={i * 0.06} className={`py-8 md:py-0 px-0 md:px-10 ${i > 0 ? "border-t md:border-t-0 md:border-l border-[#e5e5e5]" : ""}`}>
              <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-3">{s.tag}</p>
              <p className="text-5xl md:text-6xl font-medium tracking-tighter text-black leading-none mb-2">{s.val}</p>
              <p className="text-xs text-[#555] mt-2">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── SOLVEUR DOUBLE — SCHÉMA D'ARCHITECTURE — BLACK ── */}
      <section className="relative py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.16]" style={{
          backgroundImage: "url(/illustrations/lcpi/lcpi_abstract_stochastique_02.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Architecture du Solveur</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Un noyau, deux logiques.<br /><span className="text-white/25">Jamais l&apos;une sans l&apos;autre.</span></h2>
            <p className="text-base text-white/40 max-w-xl mb-14 leading-relaxed">Le noyau déterministe (Hardy-Cross, Eurocode 2) vérifie ce que le moteur stochastique explore. Aucun résultat ne sort du solveur sans passer par cette double lecture.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Image
              src="/illustrations/lcpi/lcpi_architecture_solveur_double.png"
              alt="Architecture du solveur double LCPI : entrées réseau et scénarios, noyau déterministe et moteur stochastique, sorties signées"
              width={1532}
              height={1045}
              className="w-full h-auto"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── MODULES — STICKY ASYMÉTRIQUE — WHITE ── */}
      <ModulesStickyList />

      {/* ── PREUVES DE CALCUL — BLACK ── */}
      <section className="relative py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.14]" style={{
          backgroundImage: "url(/illustrations/lcpi/lcpi_abstract_stochastique_01.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Preuves de Calcul</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">Le mécanisme, pas la promesse.</h2>
          </FadeIn>
          <FadeIn delay={0.04}>
            <div className="border border-white/10 p-6 mb-10">
              <Image
                src="/illustrations/lcpi/lcpi_workflow_dossier_double.png"
                alt="Chaîne Dossier Double : solveur stochastique, fractile P95, traduction Fascicule 71, PDF signé Ed25519"
                width={1473} height={448} className="w-full h-auto mb-5"
              />
              <p className="font-mono text-[9px] tracking-[0.25em] text-cyan uppercase mb-2">Dossier Double</p>
              <p className="text-sm text-white/40 leading-relaxed max-w-2xl">Le résultat stochastique n&apos;est jamais livré tel quel : il est ramené à un fractile conservateur, traduit en langage normatif Fascicule 71, puis signé. Les trois preuves ci-dessous documentent chaque maillon.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <FadeIn delay={0.06}>
              <div className="border border-white/10 p-6">
                <Image
                  src="/illustrations/lcpi/lcpi_fractiles_p10_p50_p90.png"
                  alt="Bande de fractiles P10/P50/P90 de la pression au nœud critique sur 24h, mécanisme Dossier Double"
                  width={1703} height={919} className="w-full h-auto mb-5"
                />
                <p className="font-mono text-[9px] tracking-[0.25em] text-cyan uppercase mb-2">Module 01 · AEP</p>
                <p className="text-sm text-white/40 leading-relaxed">Chaque scénario Monte Carlo produit une bande d&apos;incertitude, pas une valeur unique. Le P95 conservateur est ce qui alimente le rapport Fascicule 71.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="border border-white/10 p-6">
                <Image
                  src="/illustrations/lcpi/lcpi_convergence_hardy_cross.png"
                  alt="Convergence du résidu de pression Hardy-Cross sur 8 itérations, échelle logarithmique"
                  width={1491} height={920} className="w-full h-auto mb-5"
                />
                <p className="font-mono text-[9px] tracking-[0.25em] text-cyan uppercase mb-2">Module 01 · Noyau déterministe</p>
                <p className="text-sm text-white/40 leading-relaxed">Hardy-Cross converge sous la tolérance en 8 itérations. C&apos;est ce noyau, bit-exact, qui vérifie chaque sortie du moteur stochastique.</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.12}>
            <div className="border border-[#e5e5e5] bg-white p-6">
              <Image
                src="/illustrations/lcpi/lcpi_pareto_nsga2_light.png"
                alt="Front de Pareto NSGA-II, coût réseau contre fiabilité hydraulique, configurations dominées en gris"
                width={1520} height={1080} className="w-full h-auto mb-5 max-w-2xl mx-auto"
              />
              <p className="font-mono text-[9px] tracking-[0.25em] text-cyan uppercase mb-2">Module 01 · Optimisation NSGA-II</p>
              <p className="text-sm text-[#555] leading-relaxed max-w-xl">L&apos;optimiseur explore l&apos;espace des configurations réseau et retient le front non dominé — coût et fiabilité, jamais l&apos;un sans l&apos;autre. La ligne du tableau comparatif ci-dessous en découle directement.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── COMPARAISON — WHITE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-4">/ Comparaison Marché</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-4">LCPI vs. l&apos;existant.</h2>
            <p className="text-base text-[#555] max-w-xl mb-14 leading-relaxed">Les alternatives coûtent 2 000–3 500 $/an et n&apos;ont jamais entendu parler du BAEL 91. Voici pourquoi les bureaux d&apos;études africains changent.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="border border-[#e5e5e5] overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="text-left px-6 py-4 font-mono text-[9px] tracking-[0.25em] text-[#999] uppercase">Fonctionnalité</th>
                    <th className="text-left px-6 py-4 font-mono text-[9px] tracking-[0.25em] text-cyan uppercase bg-cyan/5">LCPI</th>
                    <th className="text-left px-6 py-4 font-mono text-[9px] tracking-[0.25em] text-[#999] uppercase">EPANET</th>
                    <th className="text-left px-6 py-4 font-mono text-[9px] tracking-[0.25em] text-[#999] uppercase">AutoCAD Civil</th>
                    <th className="text-left px-6 py-4 font-mono text-[9px] tracking-[0.25em] text-[#999] uppercase">Robot Structural</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-[#f0f0f0] ${i % 2 === 0 ? "bg-[#f8f8f8]" : "bg-[#fafafa]"}`}>
                      <td className="px-6 py-4 text-sm text-black font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-cyan font-medium bg-cyan/[0.03]">{row.lcpi}</td>
                      <td className="px-6 py-4 text-sm text-[#999]">{row.epanet}</td>
                      <td className="px-6 py-4 text-sm text-[#999]">{row.autocad}</td>
                      <td className="px-6 py-4 text-sm text-[#999]">{row.robot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ARCHITECTURE — STICKY ASYMÉTRIQUE — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">

            {/* LEFT — STICKY */}
            <div className="w-full md:w-[38%] md:sticky md:top-[120px]">
              <FadeIn>
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Architecture</p>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                  Du CLI au SaaS.<br />
                  <span className="text-white/25">À votre rythme.</span>
                </h2>
                <p className="text-sm text-white/35 leading-relaxed mb-10">
                  LCPI est disponible en 4 niveaux d&apos;intégration. Adoptez le niveau qui correspond à votre workflow actuel, migrez vers le suivant sans friction.
                </p>
                {/* Maturité globale */}
                <div className="space-y-3">
                  <p className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase">Maturité globale</p>
                  {archTiers.map((t) => (
                    <div key={t.tier} className="flex items-center gap-3">
                      <span className={`font-mono text-[9px] w-24 flex-shrink-0 ${t.textAccent}`}>{t.tier}</span>
                      <div className="flex-1 h-px bg-white/5 relative overflow-hidden">
                        <motion.div
                          className={`absolute left-0 top-0 h-full ${t.accent}`}
                          initial={{ width: "0%" }}
                          whileInView={{ width: t.barW }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* RIGHT — SCROLLING */}
            <div className="flex-1 space-y-0">
              {archTiers.map((t, i) => (
                <FadeIn key={t.tier} delay={i * 0.08}>
                  <div className={`border-l-2 ${t.borderAccent} pl-8 py-8 ${i < archTiers.length - 1 ? "border-b border-white/5 mb-0" : ""}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-lg font-medium ${t.textAccent}`}>{t.tier}</span>
                          <span className="font-mono text-[9px] text-white/20 tracking-[0.2em] uppercase border border-white/10 px-2 py-0.5">{t.status}</span>
                        </div>
                        <p className="font-mono text-[9px] text-white/20 tracking-wide">{t.tech}</p>
                      </div>
                      {/* Scrubbed bar */}
                      <div className="hidden md:block w-20 h-px bg-white/5 mt-3 relative overflow-hidden">
                        <motion.div
                          className={`absolute left-0 top-0 h-full ${t.accent}`}
                          initial={{ width: "0%" }}
                          whileInView={{ width: t.barW }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-white/35 leading-relaxed mb-6">{t.desc}</p>
                    {i === 0 && (
                      <div className="grid sm:grid-cols-2 gap-5 items-start">
                        <div className="bg-black border border-white/10 p-5 font-mono text-[10px]">
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-2 h-2 rounded-full bg-cyan/60" />
                            <span className="ml-2 text-white/25 text-[9px] tracking-wider">lcpi — terminal</span>
                          </div>
                          <div className="space-y-1.5 leading-relaxed">
                            <p><span className="text-white/30">$</span> <span className="text-cyan">lcpi</span> <span className="text-white">beton run</span> <span className="text-white/30">--section poteau-rectangulaire --norme bael91</span></p>
                            <p className="mt-2 text-white/10">────────────────────────────</p>
                            <p><span className="text-cyan">✓</span> <span className="text-white">Poteau 30×30cm</span> <span className="text-white/30">· fc28=25MPa · Fe500</span></p>
                            <p><span className="text-cyan">✓</span> <span className="text-white">Nu=420kN · Mu=18kN.m</span></p>
                            <p><span className="text-cyan">✓</span> <span className="text-white">As=8.04cm²</span> <span className="text-white/30">→ 4HA16 + 4HA14</span></p>
                            <p><span className="text-cyan">✓</span> <span className="text-white">Note signée</span> <span className="text-white/30">Ed25519 → note_calcul_20260620.pdf</span></p>
                            <p className="mt-2 text-white/20">Durée totale : <span className="text-white">2.8s</span></p>
                          </div>
                        </div>
                        <div className="border border-white/10 p-3 bg-black">
                          <Image
                            src="/illustrations/lcpi/lcpi_coupe_ec2_beton_arme.png"
                            alt="Coupe technique du poteau 30×30 armé, 4HA16 et 4HA14, cadres HA8/20cm, EC2 ELU/ELS"
                            width={1047} height={1034} className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW — WHITE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-4">/ Workflow BAEL 91</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-4">De la donnée à la note.<br /><span className="text-[#999]">En 3 commandes.</span></h2>
            <p className="text-base text-[#555] max-w-xl mb-14 leading-relaxed">LCPI automatise le chemin complet : entrée des données → calcul normalisé → génération du rapport signé. Chaque étape est traçable et reproductible.</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-px bg-[#e5e5e5]">
            {[
              { step: "01", title: "Entrée des paramètres", desc: "Géométrie, charges, matériaux, norme applicable. CLI en mode interactif ou fichier JSON projet.", code: "lcpi beton init\n--section radier\n--fc28 25 --fe 500", tag: "lcpi init" },
              { step: "02", title: "Calcul & Optimisation", desc: "Vérification ELU/ELS, optimisation des sections d'acier, validation ferraillage, rapport intermédiaire JSON.", code: "lcpi beton run\n--check ELU ELS\n--optimize True", tag: "lcpi run" },
              { step: "03", title: "Note de calcul signée", desc: "PDF généré, paginé, avec toutes les formules, hypothèses et la signature Ed25519 en pied de page.", code: "lcpi beton export\n--format pdf docx\n--sign ed25519", tag: "lcpi export" },
            ].map((w) => (
              <FadeIn key={w.step}>
                <div className="bg-white p-8 md:p-10 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-[#ccc] uppercase">{w.step}</span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-cyan uppercase border border-cyan/20 px-2.5 py-1">{w.tag}</span>
                  </div>
                  <h3 className="text-base font-medium text-black mb-3">{w.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed mb-6">{w.desc}</p>
                  <div className="bg-black p-4 font-mono text-[10px] text-white/60 leading-loose whitespace-pre">{w.code}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDARD ICES — BLACK ── */}
      <section className="relative py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.18]" style={{
          backgroundImage: "url(/illustrations/lcpi/lcpi_abstract_scellement.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Standard ICES</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-14">Chaque calcul est signé.<br /><span className="text-white/25">Chaque norme est tracée.</span></h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              { icon: "ED25519", title: "Auditabilité Cryptographique", desc: "Chaque rapport porte une signature Ed25519 horodatée. Toute modification post-génération est détectable.", tag: "Ed25519 + SHA3-256" },
              { icon: "REG", title: "FallbackRegistry", desc: "Si un paramètre local est absent, LCPI applique automatiquement la valeur normative de référence et le signale explicitement dans le rapport. Zéro zone grise.", tag: "EPS-001" },
              { icon: "VAL", title: "Validation Comportementale", desc: "Le protocole EPS-001 vérifie que les modules produisent des résultats cohérents sur des cas tests standardisés à chaque mise à jour. Pas de régression silencieuse.", tag: "BAEL 91 · EC2 · EC3" },
            ].map((item) => (
              <FadeIn key={item.title}>
                <div className="bg-black p-8 md:p-10 h-full">
                  <div className="font-mono text-[9px] tracking-[0.3em] text-cyan uppercase border border-cyan/20 px-2.5 py-1 inline-block mb-6">{item.icon}</div>
                  <h3 className="text-base font-medium text-white mb-4">{item.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed mb-6">{item.desc}</p>
                  <span className="font-mono text-[9px] tracking-wider text-white/20 uppercase border border-white/10 px-2.5 py-1">{item.tag}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTÉGRATION ÉCOSYSTÈME — WHITE ── */}
      <section className="py-24 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#999] uppercase mb-4">/ Intégration Écosystème</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-12">LCPI ne travaille pas seul.</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { from: "Atlas", to: "LCPI", borderCol: "border-[#40916C]/40", fromCol: "text-[#40916C]", title: "Atlas → Fondations LCPI", desc: "VBS, IP, WL, WP, capacité portante et classe RGA transmis directement au module Fondations. Fini le copier-coller entre logiciels.", tags: ["SPT_N", "Capacité portante", "Cohésion φ", "RGA class"] },
              { from: "LCPI", to: "IgnisCore", borderCol: "border-[#E85D04]/40", fromCol: "text-cyan", title: "LCPI → Structures IgnisCore", desc: "LCPI dimensionne les radiers, poteaux et charpentes des unités biomasse (séchoirs, carbonisateurs, digesteurs) à partir des plans IgnisCore.", tags: ["Radiers", "Charpentes industrielles", "AEP biomasse"] },
            ].map((link) => (
              <FadeIn key={link.title}>
                <div className={`border ${link.borderCol} p-8 md:p-10 h-full`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`font-mono text-[10px] tracking-[0.25em] ${link.fromCol} uppercase`}>{link.from}</span>
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
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16">Transparent.<br /><span className="text-white/25">Sans surprise.</span></h2>
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
                        <span className="text-cyan mt-0.5 flex-shrink-0">→</span>{f}
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
      <section id="demo" className="relative py-40 px-8 md:px-16 bg-white border-t border-[#e5e5e5] text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.20]" style={{
          backgroundImage: "url(/illustrations/lcpi/lcpi_abstract_deterministe_01.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.4em] text-[#999] uppercase mb-6">/ Démarrer avec LCPI</p>
            <h2 className="text-4xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-3xl mx-auto mb-10 text-black text-balance">
              Vos calculs méritent<br /><span className="text-cyan">d&apos;être traçables.</span>
            </h2>
            <p className="text-base text-[#555] max-w-lg mx-auto mb-12 leading-relaxed">
              Rejoignez les bureaux d&apos;études qui ont choisi la rigueur déterministe et l&apos;auditabilité totale pour leurs projets d&apos;infrastructure.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/" className="bg-cyan text-black px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-cyan/90 transition-colors">Demander une démo</a>
              <a href="/" className="border border-black/20 text-black px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:border-black transition-colors">← Retour à l&apos;accueil</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
