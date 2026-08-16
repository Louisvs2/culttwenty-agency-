import { Container } from "@/components/layout/container";
import { Section, type SectionBackground } from "@/components/layout/section";
import type { Logo } from "@/types/content";
import { cn } from "@/lib/utils";

interface LogoCloudProps {
  logos: Logo[];
  background?: SectionBackground;
  className?: string;
}

/**
 * Spaltenzahl für Handy/Tablet: bewusst so gewählt, dass die letzte Zeile
 * nie ein einzelnes, allein wirkendes Logo übrig lässt (bevorzugt gerade
 * Teilbarkeit, damit jede Zeile gleich voll ist). Ab lg ist genug Breite da,
 * dort läuft die Liste stattdessen als eine natürliche Flex-Zeile.
 */
function mobileColsFor(count: number) {
  if (count <= 2) return count || 1;
  if (count % 2 === 0) return 2;
  if (count % 3 === 0) return 3;
  return 2;
}

/**
 * Kunden-Logowand: einfache Auflistung, klein und einheitlich groß, ohne
 * jede Animation. Bis einschließlich Tablet ein festes Raster (verhindert
 * ein einzeln wirkendes Logo in der letzten Zeile), ab Desktop eine
 * natürliche Flex-Zeile.
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  const mobileCols = mobileColsFor(logos.length);

  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-16", className)}
    >
      <Container>
        <ul
          className="grid items-center justify-items-center gap-x-8 gap-y-7 sm:gap-x-10 sm:gap-y-8 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-14"
          style={{
            gridTemplateColumns: `repeat(${mobileCols}, minmax(0, 1fr))`,
          }}
        >
          {logos.map((logo) => (
            <li
              key={logo.alt}
              className="flex h-8 w-full items-center justify-center sm:h-9 lg:h-8 lg:w-auto"
            >
              {/* Absichtlich ein normales <img>, kein next/image: die
                  Dateien kommen roh aus public/images/clients/ (der Kunde
                  legt sie selbst ab), ohne bekannte Breite/Höhe im Voraus.
                  grayscale+invert vereinheitlicht jedes Logo unabhängig von
                  seiner Originalfarbe zu Weiß. max-h/max-w-full + object-contain
                  sorgen dafür, dass ein breites Logo (z. B. Sony) in seiner
                  Rasterzelle nie in die Nachbarspalte hineinragt. */}
              {/* eslint-disable-next-line @next/next/no-img-element --
                  next/image braucht Breite/Höhe im Voraus; auf dieser
                  statisch exportierten Seite (images.unoptimized: true)
                  bringt es hier ohnehin keine echte Optimierung. */}
              <img
                src={typeof logo.src === "string" ? logo.src : logo.src.src}
                alt={logo.alt}
                className="h-auto max-h-full w-auto max-w-full object-contain brightness-0 grayscale invert select-none"
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
