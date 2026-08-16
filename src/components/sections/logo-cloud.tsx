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

function poolHeightClassFor(count: number) {
  if (count <= 4) return "h-[220px] sm:h-[280px] lg:h-[340px]";
  if (count <= 8) return "h-[280px] sm:h-[360px] lg:h-[440px]";
  if (count <= 14) return "h-[320px] sm:h-[400px] lg:h-[480px]";
  return "h-[360px] sm:h-[460px] lg:h-[560px]";
}

/**
 * Kunden-Logos an festen, zufällig wirkenden Positionen — angelehnt an die
 * Referenz (nimmersatt.fyi), aber mit einer eigenen, bewussten Abweichung:
 * die Fläche wird in so viele Zellen unterteilt wie Logos vorhanden sind
 * (Spaltenzahl passend zum Seitenverhältnis der Fläche), jedes Logo bekommt
 * genau eine Zelle und wird darin so groß wie möglich eingepasst — das
 * garantiert, dass nichts überlappt, alle Logos ähnlich groß wirken (statt
 * nach Zufall mal winzig, mal riesig) und die Fläche wirklich vollständig
 * ausgefüllt ist, egal wie viele Logos es gerade sind. Ein kleiner
 * Zufalls-Versatz innerhalb der Zelle sorgt trotzdem für den organischen,
 * nicht sichtbar gerasterten Eindruck.
 *
 * Jedes Logo zieht beim Erscheinen zeitversetzt in seine Position
 * (FadeInStagger/FadeIn) und wackelt danach dauerhaft ganz leicht (eigene
 * CSS-Keyframe-Animation, pro Logo mit eigenem Timing).
 *
 * Bei prefers-reduced-motion bleibt es bei der ruhenden Flex-Wrap-Anordnung
 * ohne Wackeln — die auch als Server-gerendertes Ausgangslayout dient, damit
 * es nie eine Hydration-Abweichung gibt: Position UND Größe werden
 * ausschließlich imperativ nach dem Mount gesetzt, nie beim Rendern.
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  const reduceMotion = useReducedMotion();
  const poolRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const cellOrderRef = useRef<number[]>([]);

  useEffect(() => {
    if (reduceMotion || logos.length === 0) return;
    const pool = poolRef.current;
    if (!pool) return;
    let cancelled = false;

    if (cellOrderRef.current.length !== logos.length) {
      // Welches Logo in welche Zelle kommt, wird einmal zufällig gemischt —
      // sonst stünde Logo 1 aus content/services.ts immer oben links.
      const order = logos.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      cellOrderRef.current = order;
    }

    async function layout() {
      // Erst sicherstellen, dass jedes Bild sein echtes Seitenverhältnis
      // kennt (naturalWidth/Height) — sonst könnte ein breites Logo eine
      // schmale Zelle sprengen und doch überlappen.
      await Promise.all(
        imgRefs.current.map((img) => img?.decode().catch(() => {})),
      );
      if (cancelled || !pool) return;

      const width = pool.clientWidth;
      const height = pool.clientHeight;
      const count = logos.length;
      const aspect = width / Math.max(height, 1);
      const cols = Math.max(1, Math.round(Math.sqrt(count * aspect)));
      const rows = Math.max(1, Math.ceil(count / cols));
      const cellW = width / cols;
      const cellH = height / rows;
      const FILL = 0.78; // wie viel der Zelle die Basishöhe maximal einnimmt

      // Erst für jedes Logo ermitteln, wie hoch es maximal sein dürfte, ohne
      // seine eigene Zelle zu sprengen — bei einer breiten Wortmarke in
      // einer querformatigen Zelle limitiert das die Breite, nicht die Höhe.
      // Die kleinste dieser Grenzen wird dann als EINE gemeinsame Höhe auf
      // alle Logos angewendet: alle gleich hoch (wie in einer echten
      // Logowand), Breite bleibt je nach Seitenverhältnis natürlich
      // unterschiedlich. Ohne diesen zweiten Durchgang würde jedes Logo
      // unabhängig maximiert — ein breites Logo wie ein Wortmarken-Schriftzug
      // schrumpft dann auf der Höhe viel stärker als ein quadratisches Icon,
      // und die Größen wirken zufällig statt einheitlich.
      let baseHeight = Infinity;
      const ratios = imgRefs.current.map((img) => {
        const naturalW = img?.naturalWidth || 100;
        const naturalH = img?.naturalHeight || 40;
        const ratio = naturalW / Math.max(naturalH, 1);
        const maxByHeight = cellH * FILL;
        const maxByWidth = (cellW * FILL) / ratio;
        baseHeight = Math.min(baseHeight, maxByHeight, maxByWidth);
        return ratio;
      });
      if (!Number.isFinite(baseHeight)) baseHeight = cellH * FILL;

      imgRefs.current.forEach((img, i) => {
        const el = itemRefs.current[i];
        if (!img || !el) return;

        const cell = cellOrderRef.current[i];
        const col = cell % cols;
        const row = Math.floor(cell / cols);

        // Leichter Jitter um die gemeinsame Höhe (±10 %), nicht mehr vom
        // Seitenverhältnis abhängig — sonst wirkt die Wand zu mechanisch,
        // aber keins sticht mehr als winzig oder riesig heraus.
        const finalHeight = baseHeight * randRange(0.9, 1.0);
        const finalWidth = finalHeight * ratios[i];
        img.style.height = `${finalHeight}px`;

        const cellX0 = col * cellW;
        const cellY0 = row * cellH;
        const freeX = Math.max(0, cellW - finalWidth);
        const freeY = Math.max(0, cellH - finalHeight);
        const x = cellX0 + freeX / 2 + (Math.random() - 0.5) * freeX * 0.6;
        const y = cellY0 + freeY / 2 + (Math.random() - 0.5) * freeY * 0.6;

        el.style.position = "absolute";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        // Jedes Logo bekommt sein eigenes Wackel-Timing, sonst wackeln alle
        // im Gleichschritt und es wirkt wie ein einziges bewegtes Objekt.
        el.style.animationDuration = `${randRange(3.5, 6)}s`;
        el.style.animationDelay = `-${randRange(0, 6)}s`;
      });
    }

    layout();
    // Bei Größenänderung neu einpassen, damit die Zellaufteilung zur neuen
    // Fläche passt (z. B. Breakpoint-Wechsel ändert die Spaltenzahl).
    const resizeObserver = new ResizeObserver(() => {
      layout();
    });
    resizeObserver.observe(pool);
    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
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
