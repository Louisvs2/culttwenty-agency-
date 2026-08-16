import { CTA } from "@/components/sections/cta";
import { HeroStatement } from "@/components/sections/hero";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { clients } from "@/content/clients";
import { getClientLogos } from "@/lib/client-logos";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Kunden — Marken, die uns vertrauen",
  description: clients.hero.subtitle,
  path: "/kunden/",
});

export default function KundenPage() {
  const clientLogos = getClientLogos();

  return (
    <>
      <HeroStatement {...clients.hero} className="pb-0 sm:pb-0 lg:pb-0" />
      {/* Kein Platzhalter, solange der Ordner leer ist (DESIGN.md §13) —
          dann bleibt die Seite bei Hero + CTA. */}
      {clientLogos.length > 0 && (
        <LogoCloud logos={clientLogos} className="pt-10 sm:pt-14 lg:pt-16" />
      )}
      <CTA {...clients.cta} />
    </>
  );
}
