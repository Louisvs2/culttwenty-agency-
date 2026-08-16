import { Container } from "@/components/layout/container";
import { Section, type SectionBackground } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import type { Logo } from "@/types/content";

interface LogoCloudProps {
  logos: Logo[];
  background?: SectionBackground;
  className?: string;
}

/**
 * Je weniger Logos vorhanden sind, desto größer werden sie dargestellt —
 * dadurch füllt sich die Fläche automatisch, ganz ohne feste Höhe.
 */
function logoHeightClassFor(count: number) {
  if (count <= 6) return "h-16 sm:h-20 lg:h-28";
  if (count <= 10) return "h-14 sm:h-16 lg:h-20";
  if (count <= 16) return "h-11 sm:h-14 lg:h-16";
  return "h-9 sm:h-11 lg:h-12";
}

/**
 * Kunden-Logowand: einfache Auflistung nebeneinander, einheitliche Höhe pro
 * Logo (Breite ergibt sich aus dem jeweiligen Seitenverhältnis), in normalem
 * Flex-Wrap ohne jede Animation.
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-20", className)}
    >
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-16 sm:gap-y-12 lg:gap-x-20 lg:gap-y-14">
          {logos.map((logo) => (
            <li key={logo.alt}>
              {/* Absichtlich ein normales <img>, kein next/image: die
                  Dateien kommen roh aus public/images/clients/ (der Kunde
                  legt sie selbst ab), ohne bekannte Breite/Höhe im Voraus.
                  grayscale+invert vereinheitlicht jedes Logo unabhängig von
                  seiner Originalfarbe zu Weiß. */}
              {/* eslint-disable-next-line @next/next/no-img-element --
                  next/image braucht Breite/Höhe im Voraus; auf dieser
                  statisch exportierten Seite (images.unoptimized: true)
                  bringt es hier ohnehin keine echte Optimierung. */}
              <img
                src={typeof logo.src === "string" ? logo.src : logo.src.src}
                alt={logo.alt}
                className={cn(
                  "w-auto brightness-0 grayscale invert select-none",
                  logoHeightClassFor(logos.length),
                )}
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
