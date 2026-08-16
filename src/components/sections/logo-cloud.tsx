"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * Je weniger Logos vorhanden sind, desto größer werden sie dargestellt —
 * dadurch füllt sich die Fläche automatisch, ganz ohne dass eine feste Höhe
 * erzwungen und Logos hineingepresst werden müssten (das war der Bug in der
 * vorherigen Zellen-Fassung: eine breite Wortmarke wie Sony hat dort die
 * gemeinsame Höhe für ALLE Logos nach unten gezogen).
 */
function logoHeightClassFor(count: number) {
  if (count <= 6) return "h-16 sm:h-20 lg:h-28";
  if (count <= 10) return "h-14 sm:h-16 lg:h-20";
  if (count <= 16) return "h-11 sm:h-14 lg:h-16";
  return "h-9 sm:h-11 lg:h-12";
}

/**
 * Beschneidet den transparenten Rand einer PNG-Datei auf das sichtbare
 * Zeichen (Canvas + Alphakanal-Scan). Ohne das würde ein Logo mit viel
 * eingebautem Leerraum (z. B. New Era) bei gleicher Bild-Box-Höhe kleiner
 * wirken als ein eng zugeschnittenes Logo (Sony) — obwohl beide dieselbe
 * CSS-Höhe haben. Gibt bei Fehlern oder wenn nichts zu beschneiden ist
 * `null` zurück, dann bleibt einfach die Originaldatei stehen.
 */
async function trimTransparentPadding(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const { naturalWidth: w, naturalHeight: h } = img;
        if (!w || !h) {
          resolve(null);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);

        let minX = w;
        let minY = h;
        let maxX = -1;
        let maxY = -1;
        const ALPHA_THRESHOLD = 10;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const alpha = data[(y * w + x) * 4 + 3];
            if (alpha > ALPHA_THRESHOLD) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (maxX < minX || maxY < minY) {
          resolve(null);
          return;
        }
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;
        if (cropW === w && cropH === h) {
          resolve(null);
          return;
        }

        const cropped = document.createElement("canvas");
        cropped.width = cropW;
        cropped.height = cropH;
        const croppedCtx = cropped.getContext("2d");
        if (!croppedCtx) {
          resolve(null);
          return;
        }
        croppedCtx.drawImage(
          canvas,
          minX,
          minY,
          cropW,
          cropH,
          0,
          0,
          cropW,
          cropH,
        );
        resolve(cropped.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Kunden-Logowand: einheitliche Höhe pro Logo (Breite ergibt sich aus dem
 * jeweiligen Seitenverhältnis — wie bei jeder echten Logowand), angeordnet in
 * einem normalen Flex-Wrap. Das garantiert von selbst, dass sich nichts
 * überlappt (Dokumentenfluss statt Positionierung per Hand) und dass die
 * Fläche durch den Zeilenumbruch immer zur jeweiligen Logo-Anzahl passt.
 *
 * Jedes Logo zieht beim Erscheinen zeitversetzt in seine Position
 * (FadeInStagger/FadeIn) und wackelt danach dauerhaft ganz leicht (eigene
 * CSS-Keyframe-Animation, pro Logo mit eigenem Timing).
 *
 * Die Ausgangsdatei jedes Logos wird nach dem Mount client-seitig um ihren
 * transparenten Rand beschnitten (Canvas), damit unterschiedlich viel
 * Leerraum in den Quelldateien nicht dazu führt, dass manche Logos trotz
 * gleicher Boxhöhe kleiner wirken als andere.
 *
 * Bei prefers-reduced-motion bleibt es beim ruhigen Flex-Wrap ohne Wackeln —
 * das ist zugleich das Server-gerenderte Ausgangslayout, damit es nie eine
 * Hydration-Abweichung gibt: der beschnittene Bild-Src wird ausschließlich
 * imperativ nach dem Mount gesetzt, nie beim Rendern.
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  const reduceMotion = useReducedMotion();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [trimmedSrcs, setTrimmedSrcs] = useState<(string | null)[]>(() =>
    logos.map(() => null),
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      logos.map((logo) =>
        trimTransparentPadding(
          typeof logo.src === "string" ? logo.src : logo.src.src,
        ),
      ),
    ).then((results) => {
      if (!cancelled) setTrimmedSrcs(results);
    });
    return () => {
      cancelled = true;
    };
  }, [logos]);

  useEffect(() => {
    if (reduceMotion) return;
    // Jedes Logo bekommt sein eigenes Wackel-Timing, sonst wackeln alle im
    // Gleichschritt und es wirkt wie ein einziges bewegtes Objekt.
    itemRefs.current.forEach((el) => {
      if (!el) return;
      el.style.animationDuration = `${randRange(3.5, 6)}s`;
      el.style.animationDelay = `-${randRange(0, 6)}s`;
    });
  }, [reduceMotion, logos.length]);

  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-20", className)}
    >
      <Container>
        <FadeInStagger>
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-16 sm:gap-y-12 lg:gap-x-20 lg:gap-y-14">
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
                      unabhängig von seiner Originalfarbe zu Weiß. */}
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      next/image braucht Breite/Höhe im Voraus; auf dieser
                      statisch exportierten Seite (images.unoptimized: true)
                      bringt es hier ohnehin keine echte Optimierung. */}
                  <img
                    src={
                      trimmedSrcs[i] ??
                      (typeof logo.src === "string" ? logo.src : logo.src.src)
                    }
                    alt={logo.alt}
                    className={cn(
                      "w-auto brightness-0 grayscale invert select-none",
                      logoHeightClassFor(logos.length),
                    )}
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
