import { Container } from "@/components/layout/container";
import { Section, type SectionBackground } from "@/components/layout/section";
import { FadeIn, FadeInStagger } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import type { Logo } from "@/types/content";

interface LogoCloudProps {
  /** Quiet one-liner above the logos, e.g. a trust statement. */
  label?: string;
  logos: Logo[];
  background?: SectionBackground;
  className?: string;
}

// Full brightness, not muted — matches the reference (nimmersatt.fyi) rather
// than a dimmed "proof strip". Only real client logos belong here
// (DESIGN.md §13).
export function LogoCloud({
  label,
  logos,
  background,
  className,
}: LogoCloudProps) {
  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-16", className)}
    >
      <Container>
        <FadeInStagger>
          {label && (
            <FadeIn>
              <p className="text-center text-sm text-muted-foreground">
                {label}
              </p>
            </FadeIn>
          )}
          <ul
            className={cn(
              "flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14",
              label && "mt-8",
            )}
          >
            {logos.map((logo) => (
              // Jedes Logo einzeln in FadeIn, nicht die ganze Liste in einem
              // Block — genau das zeitversetzte Einzeln-Reinkommen ist die
              // Bewegung aus der Referenz, ein gemeinsames FadeIn wirkt
              // dagegen statisch.
              <li key={logo.alt}>
                <FadeIn>
                  {/* Absichtlich ein normales <img>, kein next/image: die
                      Dateien kommen roh aus public/images/clients/ (der
                      Kunde legt sie selbst ab), ohne bekannte Breite/Höhe im
                      Voraus. grayscale+invert vereinheitlicht jedes Logo
                      unabhängig von seiner Originalfarbe zu Weiß, wie in der
                      Referenz. */}
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      next/image braucht Breite/Höhe im Voraus; auf dieser
                      statisch exportierten Seite (images.unoptimized: true)
                      bringt es hier ohnehin keine echte Optimierung. */}
                  <img
                    src={typeof logo.src === "string" ? logo.src : logo.src.src}
                    alt={logo.alt}
                    className="h-7 w-auto brightness-0 grayscale invert"
                  />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </Section>
  );
}
