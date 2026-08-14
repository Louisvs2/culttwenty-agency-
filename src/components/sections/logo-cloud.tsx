"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { Container } from "@/components/layout/container";
import { Section, type SectionBackground } from "@/components/layout/section";
import { FadeIn, FadeInStagger } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import type { Logo } from "@/types/content";

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface LogoCloudProps {
  logos: Logo[];
  background?: SectionBackground;
  className?: string;
}

/** Größenbereich für die Logo-Höhe: größer bei wenigen Logos, kompakter bei
 *  vielen, und zusätzlich an die tatsächliche Breite skaliert — sonst würde
 *  z. B. eine breite Wortmarke auf dem Handy fast die ganze Fläche
 *  einnehmen und alles andere verdecken. */
function logoHeightRangeFor(count: number, poolWidth: number) {
  const tierMax = count <= 4 ? 72 : count <= 8 ? 56 : count <= 14 ? 40 : 28;
  const widthScale = Math.max(0.4, Math.min(1, poolWidth / 700));
  const max = Math.round(tierMax * widthScale);
  return { min: Math.round(max * 0.6), max };
}

function poolHeightClassFor(count: number) {
  if (count <= 4) return "h-[220px] sm:h-[280px] lg:h-[340px]";
  if (count <= 8) return "h-[280px] sm:h-[360px] lg:h-[440px]";
  if (count <= 14) return "h-[320px] sm:h-[400px] lg:h-[480px]";
  return "h-[360px] sm:h-[460px] lg:h-[560px]";
}

/**
 * Kunden-Logos an zufälligen, aber festen Positionen verstreut — wie die
 * Referenz (nimmersatt.fyi): keine Physik, keine Kollisionsvermeidung
 * (Überlappen ist im Original ausdrücklich zu sehen), keine
 * Cursor-Interaktion. Jedes Logo zieht beim Erscheinen zeitversetzt in
 * seine Position (FadeInStagger/FadeIn, dieselbe Bewegung wie überall sonst
 * im Template) und wackelt danach dauerhaft ganz leicht (eigene, wenige
 * Pixel kleine CSS-Keyframe-Animation, pro Logo mit eigenem Timing, damit
 * es nicht synchron und damit mechanisch wirkt).
 *
 * Bei prefers-reduced-motion bleibt es bei der ruhenden Flex-Wrap-Anordnung
 * ohne Wackeln — die auch als Server-gerendertes Ausgangslayout dient, damit
 * es nie eine Hydration-Abweichung gibt: Position UND Größe werden
 * ausschließlich imperativ nach dem Mount gesetzt, nie beim Rendern (sonst
 * würde jede erneute Render-Passage die Größe neu auswürfeln).
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  const reduceMotion = useReducedMotion();
  const poolRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const sizeFractionsRef = useRef<number[]>([]);

  useEffect(() => {
    if (reduceMotion || logos.length === 0) return;
    const pool = poolRef.current;
    if (!pool) return;

    if (sizeFractionsRef.current.length !== logos.length) {
      sizeFractionsRef.current = logos.map(() => Math.random());
    }

    function scatter() {
      const width = pool!.clientWidth;
      const height = pool!.clientHeight;
      const range = logoHeightRangeFor(logos.length, width);

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        const fraction = sizeFractionsRef.current[i];
        img.style.height = `${Math.round(range.min + fraction * (range.max - range.min))}px`;
      });

      itemRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = randRange(0, Math.max(0, width - rect.width));
        const y = randRange(0, Math.max(0, height - rect.height));
        el.style.position = "absolute";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        // Jedes Logo bekommt sein eigenes Wackel-Timing, sonst wackeln alle
        // im Gleichschritt und es wirkt wie ein einziges bewegtes Objekt
        // statt vieler unabhängiger.
        el.style.animationDuration = `${randRange(3.5, 6)}s`;
        el.style.animationDelay = `-${randRange(0, 6)}s`;
      });
    }

    scatter();
    // Bei Größenänderung neu verstreuen — bei festen, nicht interaktiven
    // Positionen gibt es keinen Grund, alte Positionen über Breakpoints
    // hinweg zu erhalten.
    const resizeObserver = new ResizeObserver(scatter);
    resizeObserver.observe(pool);
    return () => resizeObserver.disconnect();
  }, [reduceMotion, logos]);

  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-16", className)}
    >
      <Container>
        <FadeInStagger>
          {/*
            Ausgangslayout ist ein ganz normales Flex-Wrap — das ist zugleich
            das Server-gerenderte Markup, das reduced-motion-Ergebnis und der
            kurze Moment vor der Hydration. Erst der Effekt oben löst jedes
            Logo per position:absolute aus dem Fluss, nie das Rendern selbst,
            damit es keine Hydration-Abweichung geben kann.
          */}
          <ul
            ref={poolRef}
            className={cn(
              "relative flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-8 overflow-hidden sm:gap-x-14",
              poolHeightClassFor(logos.length),
            )}
          >
            {logos.map((logo, i) => (
              <li
                key={logo.alt}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={
                  reduceMotion
                    ? undefined
                    : "animate-[logo-wobble_5s_ease-in-out_infinite]"
                }
              >
                <FadeIn>
                  {/* Absichtlich ein normales <img>, kein next/image: die
                      Dateien kommen roh aus public/images/clients/ (der
                      Kunde legt sie selbst ab), ohne bekannte Breite/Höhe im
                      Voraus. grayscale+invert vereinheitlicht jedes Logo
                      unabhängig von seiner Originalfarbe zu Weiß. h-9 ist
                      nur der Vor-Hydration-/reduced-motion-Fallback. */}
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      next/image braucht Breite/Höhe im Voraus; auf dieser
                      statisch exportierten Seite (images.unoptimized: true)
                      bringt es hier ohnehin keine echte Optimierung. */}
                  <img
                    ref={(el) => {
                      imgRefs.current[i] = el;
                    }}
                    src={typeof logo.src === "string" ? logo.src : logo.src.src}
                    alt={logo.alt}
                    className="h-9 w-auto brightness-0 grayscale invert select-none"
                    draggable={false}
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
