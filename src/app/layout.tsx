import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { HamburgerNav } from "@/components/ui/HamburgerNav";
import { LenisProvider } from "@/components/ui/LenisProvider";

export const metadata: Metadata = {
  title: "intrepidcore | Système d'exploitation géotechnique et structurel",
  description:
    "Déployer l'Intelligence Physique. IntrepidCore fusionne l'analyse par éléments finis (FEA) et les réseaux de neurones informés par la physique (PINN) pour sécuriser les infrastructures africaines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans bg-background text-foreground"
        suppressHydrationWarning
      >
        <LenisProvider>
          <HamburgerNav />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
