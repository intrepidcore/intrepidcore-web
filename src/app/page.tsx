import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { StickyReveal } from "@/components/ui/StickyReveal";
import { HorizontalScrollCarousel } from "@/components/ui/HorizontalScrollCarousel";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { StatsCounter } from "@/components/ui/StatsCounter";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";

const productsData = [
  {
    id: "lcpi",
    name: "LCPI",
    tag: "/ 0.1 — Hydraulique & Structure",
    image: "/lcpi_mockup_1781920015282.png",
    href: "/produits/lcpi",
    description:
      "Solveurs déterministes pour l'analyse structurelle et le dimensionnement des réseaux. Intégration native des algorithmes de résolution (Hardy-Cross, BFS) et conformité stricte aux normes internationales (BAEL 91).",
  },
  {
    id: "atlas",
    name: "Atlas",
    tag: "/ 0.2 — Intelligence Spatiale",
    image: "/atlas_mockup_1781920004813.png",
    href: "/produits/atlas",
    description:
      "Cartographie prédictive et modélisation géostatistique. Analyse spatiale par krigeage (KED, RK) et caractérisation minéralogique (RGA, VBS) couvrant plus de 56 600 km² sur les bassins sédimentaires et zones géologiques prioritaires.",
  },
  {
    id: "ignis",
    name: "IgnisCore",
    tag: "/ 0.3 — Énergie & Thermochimie",
    image: "/ignis_mockup_1781920024909.png",
    href: "/produits/igniscore",
    description:
      "Modélisation des processus de valorisation de la biomasse. Le moteur BioCore anticipe le comportement thermochimique pour dimensionner les infrastructures énergétiques de demain.",
  },
];

const heroImages = [
  "/visuel/forage-nocturne.jpg",
  "/visuel/barrage-hydraulique.jpg",
  "/visuel/ingenieur-terrain.jpg",
  "/visuel/reacteur-industriel.jpg",
  "/visuel/structure-01.jpg",
  "/visuel/equipe-mission.jpg",
  "/visuel/structure-02.jpg",
  "/visuel/structure-03.jpg",
  "/visuel/terrain-vierge.jpg",
];

const standardsData = [
  {
    title: "Auditabilité Totale",
    description:
      "Chaque calcul expose ses formules, normes appliquées et hypothèses d'entrée. Une transparence absolue pour une validation inattaquable par les pairs.",
    progress: 100,
    metrics: ["HMAC-SHA256", "ISO-COMPLIANT"],
    image: "/visuel/structure-01.jpg",
  },
  {
    title: "Ancrage Local",
    description:
      "Intégration native des paramètres climatiques, géologiques et matériels de l'Afrique de l'Ouest. Nous ne transposons pas, nous modélisons la réalité locale.",
    progress: 85,
    metrics: ["GEO-DATA", "CLIMATOLOGY"],
    image: "/visuel/structure-02.jpg",
  },
  {
    title: "Rigueur Mathématique",
    description:
      "Nos modèles d'IA et de substitution sont systématiquement validés contre des solveurs déterministes. Le maillage de substitution garantit une exactitude infaillible, de la fondation à la superstructure.",
    progress: 95,
    metrics: ["PINN", "FEA-VERIFIED"],
    image: "/visuel/structure-03.jpg",
  },
];

const brutalistProducts = [
  { name: "LCPI", colorHover: "group-hover:text-cyan", desc: "Hydraulique & Structure", href: "/produits/lcpi" },
  { name: "Atlas", colorHover: "group-hover:text-atlas", desc: "Intelligence Spatiale", href: "/produits/atlas" },
  { name: "IgnisCore", colorHover: "group-hover:text-ignis", desc: "Énergie & Thermochimie", href: "/produits/igniscore" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── CHANTIER 2 — SOUS-NAVIGATION STICKY ── */}
      <ProductTabs />

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <HeroCarousel images={heroImages} />
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 md:px-12 w-full pt-32 pb-20 md:pt-48 md:pb-40">
          <FadeIn>
            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-cyan uppercase mb-6">
              Système d&apos;exploitation géotechnique et structurel
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-medium tracking-tighter leading-[0.88] text-white max-w-6xl text-balance">
              Déployer l&apos;<span className="text-cyan">Intelligence</span> Physique.
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="pt-12 mt-8 border-t border-white/10 max-w-2xl">
              <p className="text-base md:text-lg text-[#777] leading-relaxed">
                IntrepidCore fusionne l&apos;analyse par éléments finis et les réseaux de neurones
                informés par la physique. Un écosystème déterministe pour sécuriser la modélisation
                hydraulique, l&apos;intelligence spatiale et l&apos;ingénierie civile complexe sur le continent.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Scroll to explore */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <span className="font-mono text-[8px] tracking-[0.4em] text-white/20 uppercase">
            Scroll to Explore
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── STATS COUNTER ── */}
      <StatsCounter />

      {/* ── HORIZONTAL SCROLL-JACKING ── */}
      <div id="products">
        <StickyReveal products={productsData} />
      </div>

      {/* ── RUPTURE VISUELLE BRUTALISTE ── */}
      <section className="bg-white text-black overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-20 md:py-28">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#bbb] uppercase mb-14 md:mb-20">
              / Écosystème IntrepidCore
            </p>
          </FadeIn>
          <div>
            {brutalistProducts.map((product, i) => (
              <FadeIn key={product.name} delay={i * 0.08}>
                <a
                  href={product.href}
                  className="group flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-[#e8e8e8] py-5 md:py-4"
                >
                  <span className={`text-[13vw] md:text-[9vw] lg:text-[8vw] font-medium tracking-tighter leading-none text-black transition-colors duration-200 ${product.colorHover}`}>
                    {product.name}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#bbb] uppercase mt-2 md:mt-0 group-hover:text-black transition-colors duration-200">
                    {product.desc} →
                  </span>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDARD ICES ── */}
      <div id="standards">
        <HorizontalScrollCarousel
          title="Le Standard ICES"
          subtitle="Piliers du Standard"
          items={standardsData}
        />
      </div>

      {/* ── DOCTRINES OPÉRATIONNELLES ── */}
      <section id="doctrines" className="py-28 md:py-40 px-8 md:px-12 bg-black text-white">
        <div className="max-w-screen-2xl mx-auto">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#444] uppercase mb-4">
              / Axiomes de l&apos;Architecture
            </p>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">
              Doctrines Opérationnelles
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-0 border-t border-[#1a1a1a] mt-10">
            {[
              {
                img: "/visuel/terrain-vierge.jpg",
                tag: "/ PERFORMANCE",
                tagColor: "text-cyan",
                title: "Échelle Computationnelle",
                text: "Le dimensionnement manuel est un vecteur de biais. Nos architectures déploient une puissance de calcul massive pour traiter des variables environnementales et structurelles sans précédent.",
                border: "",
              },
              {
                img: "/visuel/equipe-mission.jpg",
                tag: "/ PRÉCISION",
                tagColor: "text-atlas",
                title: "Tolérance Zéro",
                text: "L'interface n'est pas un outil de visualisation, mais un centre de commandement prédictif. Les points de rupture sont identifiés et neutralisés avant le déploiement physique.",
                border: "md:border-l md:border-[#1a1a1a]",
              },
              {
                img: "/visuel/ingenieur-terrain.jpg",
                tag: "/ IMPACT",
                tagColor: "text-ignis",
                title: "Optimisation Fiscale & Matérielle",
                text: "La modélisation par intelligence artificielle prédictive élimine la nécessité des tests destructifs, sécurisant l'allocation des budgets et la viabilité des infrastructures critiques.",
                border: "md:border-l md:border-[#1a1a1a]",
              },
            ].map((d, i) => (
              <FadeIn key={d.title} delay={i * 0.1} className={`py-12 ${i > 0 ? d.border : ""} ${i > 0 ? "md:pl-10" : ""}`}>
                <div className="relative h-40 mb-8 overflow-hidden border border-[#282828] bg-[#0a0a0a]">
                  <Image src={d.img} alt="" fill className="object-cover opacity-20 grayscale" />
                </div>
                <p className={`font-mono text-[9px] tracking-[0.3em] uppercase mb-4 ${d.tagColor}`}>{d.tag}</p>
                <h3 className="text-base font-medium mb-3 text-white">{d.title}</h3>
                <p className="text-sm leading-relaxed text-[#555]">{d.text}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <TestimonialsCarousel />

      {/* ── CTA ── */}
      <section id="demo" className="py-32 md:py-48 px-8 md:px-12 bg-black text-white border-t border-[#111]">
        <div className="max-w-screen-2xl mx-auto text-center">
          <FadeIn>
            <p className="font-mono text-[9px] tracking-[0.4em] text-[#444] uppercase mb-6">
              / Demander une démonstration
            </p>
            <h2 className="text-4xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-4xl mx-auto text-balance mb-10">
              Construisons l&apos;infrastructure
              <br />
              <span className="text-[#333]">de demain.</span>
            </h2>
            <p className="text-base md:text-lg text-[#555] max-w-xl mx-auto mb-12 leading-relaxed">
              Accédez à une démonstration personnalisée de notre écosystème et évaluez l&apos;impact
              de nos solveurs sur vos projets d&apos;ingénierie civile.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a href="#" className="border border-white px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors">
                Demander une démo
              </a>
              <a href="#" className="font-mono text-[10px] text-[#444] tracking-[0.2em] uppercase hover:text-white transition-colors">
                Nous contacter →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── MEGA-FOOTER ── */}
      <footer className="bg-black text-white border-t border-[#111]">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 pt-14 pb-8 border-b border-[#111]">
          <div className="flex flex-wrap gap-3">
            {["LINKEDIN", "YOUTUBE", "X / TWITTER", "POLITIQUE DES COOKIES"].map((s) => (
              <a key={s} href="#" className="border border-[#252525] rounded-full px-5 py-2.5 font-mono text-[9px] tracking-[0.2em] text-[#444] hover:text-white hover:border-[#555] transition-colors uppercase">
                {s}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 pb-14 border-b border-[#111]">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <img src="/logos/logo-mark.svg" alt="intrepidcore" className="h-8 w-auto mb-6 brightness-0 invert opacity-40" />
              <p className="text-sm text-[#444] leading-relaxed max-w-[200px]">
                Moteur de calcul scientifique pour l&apos;ingénierie des infrastructures africaines.
              </p>
              <p className="font-mono text-[9px] text-[#2a2a2a] tracking-[0.2em] uppercase mt-4">Lomé, Togo</p>
            </div>
            {[
              { title: "Plateformes", color: "text-cyan", links: [{ l: "LCPI v0.1", h: "/produits/lcpi" }, { l: "Atlas v0.2", h: "/produits/atlas" }, { l: "IgnisCore v0.3", h: "/produits/igniscore" }] },
              { title: "Secteurs", color: "text-atlas", links: [{ l: "Génie Hydraulique", h: "#" }, { l: "Géotechnique", h: "#" }, { l: "Valorisation Biomasse", h: "#" }, { l: "Réseaux Incendie", h: "#" }, { l: "Fondations", h: "#" }] },
              { title: "Technologies", color: "text-ignis", links: [{ l: "Modélisation FEA", h: "#" }, { l: "Réseaux PINN", h: "#" }, { l: "Krigeage KED/RK", h: "#" }, { l: "Moteur BioCore", h: "#" }, { l: "HMAC-SHA256", h: "#" }] },
              { title: "Standards", color: "text-[#555]", links: [{ l: "BAEL 91", h: "#" }, { l: "Eurocodes", h: "#" }, { l: "EPS-001", h: "#" }, { l: "Conformité Sismique", h: "#" }, { l: "Standard ICES", h: "/#standards" }] },
              { title: "Ressources", color: "text-[#555]", links: [{ l: "Documentation", h: "#" }, { l: "Paper Atlas", h: "#" }, { l: "À propos", h: "#" }, { l: "Contact", h: "/#demo" }, { l: "Mentions légales", h: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className={`font-mono text-[9px] tracking-[0.3em] uppercase mb-6 ${col.color}`}>{col.title}</h4>
                <ul className="space-y-3.5 text-sm text-[#444]">
                  {col.links.map((link) => (
                    <li key={link.l}><a href={link.h} className="hover:text-white transition-colors">{link.l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-4">
            <p className="font-mono text-[9px] text-[#2a2a2a] uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} IntrepidCore Technologies — Lomé, Togo
            </p>
            <div className="flex gap-8 font-mono text-[9px] text-[#2a2a2a] uppercase tracking-[0.2em]">
              {["Terms", "Privacy", "Contact"].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
