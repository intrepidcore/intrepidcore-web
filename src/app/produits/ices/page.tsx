"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

const guarantees = [
  {
    tag: "/ 01",
    name: "Intégrité du calcul",
    desc: "Le résultat scellé provient de ces entrées, via ce moteur, sans altération depuis la signature.",
    force: "Absolue",
    note: "SHA3-256 + Ed25519 — standards publics, éprouvés depuis plus d'une décennie.",
  },
  {
    tag: "/ 02",
    name: "Attribution",
    desc: "Un acteur identifié, à une clé enrôlée par une autorité reconnue, a produit cette signature à un instant donné.",
    force: "Conditionnelle",
    note: "Dépend de la gouvernance du registre de confiance, cédée par phases.",
  },
  {
    tag: "/ 03",
    name: "Véracité physique",
    desc: "Le contenu scellé correspond à l'état réel de l'ouvrage sur le terrain.",
    force: "Nulle par construction",
    note: "Aucun mécanisme cryptographique ne peut établir ce lien — traité par un témoin tiers indépendant, pas par des mathématiques.",
  },
];

const phases = [
  { n: "0", name: "Standard bien public", desc: "Spécification, vecteurs de test et implémentation de référence publiés sous licence ouverte." },
  { n: "1", name: "Ingénierie conventionnelle", desc: "ICES scelle des calculs déterministes normatifs, indépendamment de la validation du moteur stochastique." },
  { n: "2", name: "Attribution", desc: "Clés à durée de vie courte, horodatage en deux paliers, révocation asynchrone." },
  { n: "3", name: "Responsabilité & confiance publique", desc: "Chaîne de garde, co-signature du Bureau de Contrôle Technique, transfert du registre vers une autorité publique." },
  { n: "4", name: "Solveur payant", desc: "Le moteur stochastique LCPI devient le produit commercial superposé au sceau gratuit." },
  { n: "5", name: "Standard sectoriel", desc: "Gouvernance élargie, audit indépendant publié, entrée dans les DAO via la clause « ou équivalent »." },
];

const stats = [
  { val: "0 FCFA", label: "Coût du sceau — gratuit par doctrine", tag: "/ MODÈLE" },
  { val: "3", label: "Garanties, explicitement bornées", tag: "/ DOCTRINE" },
  { val: "6", label: "Phases de gouvernance cédée", tag: "/ FEUILLE DE ROUTE" },
  { val: "30 p.", label: "Spécification technique complète", tag: "/ LIVRE BLANC v3.0" },
];

const PDF_HREF = "/whitepapers/ICES-whitepaper-v3.pdf";

export default function IcesPage() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(heroProgress, [0, 0.55], [1, 0]);
  const titleY = useTransform(heroProgress, [0, 0.55], [0, -70]);
  const subtitleOpacity = useTransform(heroProgress, [0, 0.35], [1, 0]);
  const subtitleY = useTransform(heroProgress, [0, 0.35], [0, -30]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── HERO — BLACK ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end pb-24 px-8 md:px-16 bg-black overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#00C4D4 1px, transparent 1px), linear-gradient(90deg, #00C4D4 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-screen-2xl mx-auto w-full pt-40">
          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase border border-cyan/30 px-3 py-1.5">
                v3.0 · Standard ouvert
              </span>
              <span className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase">/ Ingénierie publique</span>
            </div>
          </motion.div>

          <motion.h1
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-[22vw] md:text-[16vw] font-medium tracking-tighter leading-none text-white"
          >
            ICES
          </motion.h1>

          <motion.div style={{ opacity: subtitleOpacity, y: subtitleY }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-t border-white/10 pt-8 mt-4 gap-8">
              <div className="max-w-xl">
                <p className="text-xl text-white/50 leading-relaxed mb-2">
                  Le sceau de responsabilité de l&apos;ingénierie publique.
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
                  Lier chaque décision d&apos;infrastructure à son auteur — gratuit, ouvert, vérifiable hors-ligne.
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <a
                  href={PDF_HREF}
                  download
                  className="bg-cyan text-black px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-cyan/90 transition-colors"
                >
                  Télécharger le livre blanc
                </a>
                <a
                  href="#bailleurs"
                  className="border border-white/20 px-8 py-3.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-white transition-colors"
                >
                  Pour les bailleurs →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS — WHITE ── */}
      <section className="py-20 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <FadeIn
              key={s.tag}
              delay={i * 0.06}
              className={`py-8 md:py-0 px-0 md:px-10 ${i > 0 ? "border-t md:border-t-0 md:border-l border-[#e5e5e5]" : ""}`}
            >
              <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-3">{s.tag}</p>
              <p className="text-4xl md:text-5xl font-medium tracking-tighter text-black leading-none mb-2">{s.val}</p>
              <p className="text-xs text-[#555] mt-2">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── LE PROBLÈME — WHITE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-2 gap-16">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-4">/ Le problème</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-6">
              L&apos;Air Gap APD-EXE.
            </h2>
            <p className="text-base text-[#555] max-w-xl leading-relaxed">
              Une note de calcul d&apos;ingénierie hydraulique fixe le diamètre d&apos;une conduite, la pression
              qu&apos;elle doit supporter. Entre l&apos;étude et la mise en service, ce document traverse trois
              transitions — études d&apos;exécution, chantier, récolement — où son contenu peut être remplacé
              sans que la modification laisse de trace exploitable.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="border border-[#e5e5e5] p-8 space-y-6">
              {[
                { phase: "Étude → Exécution", risk: "Altération silencieuse du coefficient de rugosité ou du diamètre." },
                { phase: "Exécution → Chantier", risk: "Substitution de classe de pression, contrefaçon de matériaux." },
                { phase: "Chantier → Réception", risk: "Le dossier de récolement recopie les plans initiaux, sans les déviations réelles." },
              ].map((r) => (
                <div key={r.phase} className="border-l-2 border-cyan/40 pl-5">
                  <p className="font-mono text-[9px] tracking-[0.25em] text-black uppercase mb-1">{r.phase}</p>
                  <p className="text-sm text-[#555] leading-relaxed">{r.risk}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TROIS GARANTIES — BLACK ── */}
      <section id="doctrine" className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ La doctrine</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              Trois garanties.<br /><span className="text-white/25">Explicitement bornées.</span>
            </h2>
            <p className="text-base text-white/40 max-w-xl mb-16 leading-relaxed">
              ICES ne prétend pas empêcher la fraude physique. Il refuse qu&apos;une garantie forte prête sa
              crédibilité à des garanties qu&apos;elle ne peut pas fournir.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {guarantees.map((g, i) => (
              <FadeIn key={g.tag} delay={i * 0.08}>
                <div className="bg-black p-8 h-full flex flex-col">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-cyan uppercase mb-4">{g.tag}</p>
                  <h3 className="text-xl font-medium text-white mb-3">{g.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-6 flex-1">{g.desc}</p>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white uppercase mb-2">{g.force}</p>
                  <p className="text-xs text-white/30 leading-relaxed">{g.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE — WHITE ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-screen-2xl mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-4">/ En une image</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-14">
              Vérifiable par quiconque. Gratuitement. Hors-ligne.
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Calcul", desc: "LCPI produit une note de calcul, déterministe ou stochastique." },
              { step: "02", title: "Sceau", desc: "ICES scelle le résultat — SHA3-256, signature Ed25519 déterministe." },
              { step: "03", title: "Vérification", desc: "Bailleur, Bureau de Contrôle, régulateur — contrôle local, sans réseau, sans compte." },
            ].map((s) => (
              <FadeIn key={s.step}>
                <div className="border border-[#e5e5e5] p-8 h-full">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-cyan uppercase mb-6">{s.step}</p>
                  <h3 className="text-lg font-medium text-black mb-3">{s.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODÈLE — BLACK ── */}
      <section className="py-28 md:py-36 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">/ Modèle</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              Le sceau ne se vend pas.
            </h2>
            <p className="text-base text-white/40 max-w-lg leading-relaxed">
              Un standard dont la vérification serait payante cesserait d&apos;être un standard de confiance
              neutre. ICES reste gratuit à produire et à vérifier, y compris avec l&apos;implémentation de
              référence publiée en Phase&nbsp;0 — un bureau d&apos;études l&apos;utilise sans acheter aucune
              licence commerciale.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-4">
              {[
                { name: "Le sceau ICES", price: "0 FCFA", desc: "Standard ouvert, spécification et vecteurs de test publics." },
                { name: "Le solveur LCPI", price: "Abonnement SaaS", desc: "Optimisation stochastique, économie de CAPEX/OPEX." },
                { name: "La performance", price: "MGP / PBC", desc: "Destination, pas point d'entrée — conditionnée à la maturité contractuelle." },
              ].map((m) => (
                <div key={m.name} className="border border-white/10 p-6 flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">{m.name}</p>
                    <p className="text-xs text-white/40">{m.desc}</p>
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-cyan uppercase whitespace-nowrap">{m.price}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FEUILLE DE ROUTE — WHITE ── */}
      <section id="gouvernance" className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-screen-2xl mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-cyan uppercase mb-4">/ Gouvernance</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-4">
              Une gouvernance cédée par phases.
            </h2>
            <p className="text-base text-[#555] max-w-xl mb-14 leading-relaxed">
              Un format qu&apos;IntrepidCore contrôle seule reste, en droit, un format propriétaire. La
              légitimité juridique du standard suppose de céder son contrôle, sur des jalons d&apos;adoption
              définis — pas dans l&apos;abstrait.
            </p>
          </FadeIn>
          <div className="border-t border-[#e5e5e5]">
            {phases.map((p, i) => (
              <FadeIn key={p.n} delay={i * 0.04}>
                <div className="grid md:grid-cols-[80px_260px_1fr] gap-4 md:gap-8 py-6 border-b border-[#e5e5e5] items-baseline">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-cyan uppercase">Phase {p.n}</p>
                  <p className="text-base font-medium text-black">{p.name}</p>
                  <p className="text-sm text-[#555] leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAILLEURS — BLACK ── */}
      <section id="bailleurs" className="py-40 px-8 md:px-16 bg-black border-t border-white/5 text-center">
        <div className="max-w-screen-2xl mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase mb-6">
              / Bailleurs, régulateurs, bureaux de contrôle
            </p>
            <h2 className="text-4xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-3xl mx-auto mb-10 text-white text-balance">
              Une preuve, pas<br /><span className="text-cyan">une promesse.</span>
            </h2>
            <p className="text-base text-white/40 max-w-lg mx-auto mb-12 leading-relaxed">
              Le livre blanc technique complet — spécification, limites explicites, doctrine de gouvernance —
              destiné aux équipes techniques et juridiques qui évaluent l&apos;adoption d&apos;ICES dans un
              dossier d&apos;appel d&apos;offres.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href={PDF_HREF}
                download
                className="bg-cyan text-black px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-cyan/90 transition-colors"
              >
                Télécharger le PDF (30 p.)
              </a>
              <a
                href="/"
                className="border border-white/20 text-white px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:border-white transition-colors"
              >
                ← Retour à l&apos;accueil
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
