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
 * Kunden-Logowand: einfache Auflistung nebeneinander, klein und einheitlich
 * groß, in normalem Flex-Wrap ohne jede Animation.
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-16", className)}
    >
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
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
                className="h-9 w-auto brightness-0 grayscale invert select-none"
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
