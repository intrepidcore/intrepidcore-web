"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Search } from "lucide-react";

const navColumns = [
  {
    title: "Plateformes",
    links: [
      { label: "LCPI — Hydraulique & Structure", href: "/produits/lcpi" },
      { label: "Atlas — Intelligence Spatiale", href: "/produits/atlas" },
      { label: "IgnisCore — Énergie & Thermochimie", href: "/produits/igniscore" },
    ],
  },
  {
    title: "Standard",
    links: [
      { label: "Standard ICES", href: "/produits/ices" },
      { label: "Trois garanties", href: "/produits/ices#doctrine" },
      { label: "Gouvernance par phases", href: "/produits/ices#gouvernance" },
      { label: "Livre blanc (PDF)", href: "/whitepapers/ICES-whitepaper-v3.pdf" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "#" },
      { label: "Recherche & Publications", href: "#" },
      { label: "Partenaires", href: "#" },
      { label: "Contacter l'équipe", href: "/#demo" },
    ],
  },
  {
    title: "Secteurs",
    links: [
      { label: "Génie Hydraulique & AEP", href: "#" },
      { label: "Géotechnique & Fondations", href: "#" },
      { label: "Énergies & Biomasse", href: "#" },
      { label: "Urbanisme & Infrastructures", href: "#" },
    ],
  },
];

export function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          open
            ? "bg-black border-b border-[#1a1a1a]"
            : scrolled
            ? "bg-black/95 backdrop-blur-md border-b border-[#1a1a1a]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <a href="/" className="flex items-center z-10 relative">
            <img
              src="/logos/logo-intrepid-core.svg"
              alt="intrepidcore"
              className="h-7 md:h-9 w-auto brightness-0 invert"
            />
          </a>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Recherche"
            >
              <Search size={17} strokeWidth={1.5} />
            </button>
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="hidden md:block font-mono text-[10px] tracking-[0.25em] uppercase text-white/50 hover:text-white transition-colors border border-white/15 hover:border-white/50 px-5 py-2.5"
            >
              Démo
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black flex flex-col"
          >
            <div className="h-16 md:h-20 flex-shrink-0" />

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-12 md:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
                  {navColumns.map((col, i) => (
                    <motion.div
                      key={col.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 + i * 0.07, ease: "easeOut" }}
                    >
                      <p className="font-mono text-[9px] tracking-[0.35em] text-[#3a3a3a] uppercase mb-6 border-b border-[#1a1a1a] pb-3">
                        {col.title}
                      </p>
                      <ul className="space-y-4">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className="text-base md:text-xl font-medium text-[#444] hover:text-white transition-colors duration-200 leading-snug block"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="mt-16 md:mt-20 pt-10 border-t border-[#1a1a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-[#333] uppercase mb-1">
                      IntrepidCore Technologies
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[#2a2a2a] uppercase">
                      Lomé, Togo — Afrique de l&apos;Ouest
                    </p>
                  </div>
                  <a
                    href="#demo"
                    onClick={() => setOpen(false)}
                    className="text-white border border-white/30 hover:border-white px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-200"
                  >
                    Demander une démo →
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
