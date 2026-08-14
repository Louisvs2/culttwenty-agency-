"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { Container } from "@/components/layout/container";
import { Section, type SectionBackground } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import type { Logo } from "@/types/content";

interface LogoCloudProps {
  logos: Logo[];
  background?: SectionBackground;
  className?: string;
}

// Tuning for the "weightless in water" feel — small forces, heavy damping,
// hard speed caps. Every constant here trades off against "nervous"; when in
// doubt, make it slower and softer, never faster.
const MIN_GAP = 18; // px, minimum edge-to-edge gap logos settle at
const IDLE_ACCEL = 5; // px/s², gentle wander thrust
const WANDER_JITTER = 1.1; // rad/s, how fast the wander heading turns
const DAMPING = 0.9; // velocity retained per frame at 60fps
const MAX_SPEED = 30; // px/s, hard cap so it never looks nervous
const REPEL_STRENGTH = 900; // px/s² at full overlap between two logos
const CURSOR_RADIUS = 130; // px, how far the cursor's push reaches
const CURSOR_STRENGTH = 2200; // px/s² at the cursor's center
const BOUNDARY_MARGIN = 30; // px, soft push-back zone from the walls
const BOUNDARY_STRENGTH = 1400; // px/s² once inside the margin

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0–1, gewählt einmal pro Logo — legt seine individuelle Größe innerhalb
   *  des aktuellen Größenbereichs fest (siehe sizeRangeFor). */
  sizeFraction: number;
  wanderAngle: number;
  halfW: number;
  halfH: number;
}

/** Größenbereich, aus dem jedes Logo seine eigene, zufällige Größe zieht.
 *  Insgesamt kleiner bei vielen Logos, größer bei wenigen — und zusätzlich
 *  an die tatsächliche Breite skaliert, damit auf schmalen Bildschirmen
 *  breite Wortmarken nicht überlappen. */
function sizeRangeFor(count: number, poolWidth: number) {
  const tierMax = count <= 4 ? 76 : count <= 8 ? 58 : count <= 14 ? 40 : 28;
  const tierMin = Math.max(20, Math.round(tierMax * 0.6));
  const widthScale = Math.max(0.5, Math.min(1, poolWidth / 700));
  return {
    min: Math.round(tierMin * widthScale),
    max: Math.round(tierMax * widthScale),
  };
}

/** Wenige Logos in der vollen, großen Fläche wirken verloren — die
 *  Poolhöhe wächst deshalb mit der Anzahl statt immer maximal zu sein. */
function poolHeightClassFor(count: number) {
  if (count <= 4) return "h-[200px] sm:h-[240px] lg:h-[280px]";
  if (count <= 8) return "h-[260px] sm:h-[320px] lg:h-[380px]";
  if (count <= 14) return "h-[300px] sm:h-[380px] lg:h-[460px]";
  return "h-[320px] sm:h-[420px] lg:h-[520px]";
}

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Platziert jeden Körper an einer zufälligen Stelle ohne Überlappung, wo
 *  möglich — komplett frei, kein Raster. Rest löst die Physik. */
function placeInitial(bodies: Body[], width: number, height: number) {
  bodies.forEach((body, i) => {
    let placed = false;
    for (let attempt = 0; attempt < 40 && !placed; attempt++) {
      const x = randRange(
        body.halfW + 8,
        Math.max(body.halfW + 8, width - body.halfW - 8),
      );
      const y = randRange(
        body.halfH + 8,
        Math.max(body.halfH + 8, height - body.halfH - 8),
      );
      const overlaps = bodies.slice(0, i).some((other) => {
        const minDist =
          Math.max(body.halfW, body.halfH) +
          Math.max(other.halfW, other.halfH) +
          MIN_GAP;
        return Math.hypot(x - other.x, y - other.y) < minDist;
      });
      if (!overlaps) {
        body.x = x;
        body.y = y;
        placed = true;
      }
    }
    if (!placed) {
      body.x = randRange(
        body.halfW + 8,
        Math.max(body.halfW + 8, width - body.halfW - 8),
      );
      body.y = randRange(
        body.halfH + 8,
        Math.max(body.halfH + 8, height - body.halfH - 8),
      );
    }
  });
}

/**
 * Kunden-Logos schwirren komplett frei durch eine begrenzte Fläche, wie
 * schwerelos: leichte Eigenbewegung (Wander), sanfte gegenseitige
 * Abstoßung beim Berühren, weiche Abstoßung vom Cursor, weiche
 * Rückführung an den Rändern — keine feste Position, kein Raster. Jedes
 * Logo hat seine eigene, zufällige Größe. Kein Canvas, keine externe
 * Physik-Bibliothek — jedes Logo bleibt ein echtes <img> mit Alt-Text, nur
 * die Position wird per rAF direkt auf das DOM-Element geschrieben (kein
 * React-Re-Render pro Frame).
 *
 * Bei prefers-reduced-motion bleibt es bei der ruhenden Flex-Wrap-Anordnung,
 * die auch als Server-gerendertes Ausgangslayout dient (siehe unten) — so
 * gibt es nie eine Hydration-Abweichung: die Positionierung passiert
 * ausschließlich imperativ nach dem Mount, nie beim Rendern.
 */
export function LogoCloud({ logos, background, className }: LogoCloudProps) {
  const reduceMotion = useReducedMotion();
  const poolRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const bodiesRef = useRef<Body[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (reduceMotion || logos.length === 0) return;
    const pool = poolRef.current;
    if (!pool) return;

    let width = pool.clientWidth;
    let height = pool.clientHeight;

    const bodies: Body[] = logos.map(() => ({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      sizeFraction: Math.random(),
      wanderAngle: Math.random() * Math.PI * 2,
      halfW: 40,
      halfH: 14,
    }));
    bodiesRef.current = bodies;

    function applySizes(poolWidth: number) {
      const range = sizeRangeFor(bodies.length, poolWidth);
      bodies.forEach((body, i) => {
        const img = imgRefs.current[i];
        if (!img) return;
        const h = Math.round(
          range.min + body.sizeFraction * (range.max - range.min),
        );
        img.style.height = `${h}px`;
      });
    }

    // Größe zuerst setzen (jedes Logo zufällig, aber im aktuellen Rahmen),
    // dann erst die echte gerenderte Größe messen — Bilder haben beliebiges
    // Seitenverhältnis, die Breite ergibt sich erst daraus.
    applySizes(width);
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      bodies[i].halfW = rect.width / 2;
      bodies[i].halfH = rect.height / 2;
    });
    placeInitial(bodies, width, height);
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const b = bodies[i];
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      el.style.transform = `translate3d(${b.x - b.halfW}px, ${b.y - b.halfH}px, 0)`;
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;
      // Größen an die neue Breite anpassen (jedes Logo behält seinen
      // zufälligen Anteil im Bereich), dann die neu gemessene Größe
      // übernehmen und die Position nur in die neue Fläche hineinklemmen —
      // komplett frei bleibt frei, nichts wird neu einsortiert.
      applySizes(newWidth);
      bodies.forEach((b, i) => {
        const el = itemRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          b.halfW = rect.width / 2;
          b.halfH = rect.height / 2;
        }
        b.x = Math.min(
          Math.max(b.x, b.halfW),
          Math.max(b.halfW, newWidth - b.halfW),
        );
        b.y = Math.min(
          Math.max(b.y, b.halfH),
          Math.max(b.halfH, newHeight - b.halfH),
        );
      });
      width = newWidth;
      height = newHeight;
    });
    resizeObserver.observe(pool);

    function handlePointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return; // Touch bewegt nur sich selbst.
      const rect = pool!.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
    function handlePointerLeave() {
      pointerRef.current.active = false;
    }
    pool.addEventListener("pointermove", handlePointerMove);
    pool.addEventListener("pointerleave", handlePointerLeave);
    pool.addEventListener("pointercancel", handlePointerLeave);

    let lastTime = performance.now();
    let frame = requestAnimationFrame(tick);

    // Wiederverwendete Kraft-Akkumulatoren, einer pro Logo — reines
    // Neuanlegen jeden Frame wäre unnötiger GC-Druck.
    const accelX = new Array<number>(bodies.length).fill(0);
    const accelY = new Array<number>(bodies.length).fill(0);

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const pointer = pointerRef.current;

      // Phase 1: alle Kräfte als reine Beschleunigung (px/s²) einsammeln —
      // noch ohne dt zu multiplizieren. Erst danach, in Phase 2, fließt dt
      // genau einmal in die Geschwindigkeit ein.
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        b.wanderAngle += (Math.random() - 0.5) * WANDER_JITTER * dt;
        accelX[i] = Math.cos(b.wanderAngle) * IDLE_ACCEL;
        accelY[i] = Math.sin(b.wanderAngle) * IDLE_ACCEL;

        if (pointer.active) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < CURSOR_RADIUS) {
            const falloff = (CURSOR_RADIUS - dist) / CURSOR_RADIUS;
            accelX[i] += (dx / dist) * falloff * CURSOR_STRENGTH;
            accelY[i] += (dy / dist) * falloff * CURSOR_STRENGTH;
          }
        }

        if (b.x - b.halfW < BOUNDARY_MARGIN) {
          accelX[i] +=
            ((BOUNDARY_MARGIN - (b.x - b.halfW)) / BOUNDARY_MARGIN) *
            BOUNDARY_STRENGTH;
        } else if (b.x + b.halfW > width - BOUNDARY_MARGIN) {
          accelX[i] -=
            ((b.x + b.halfW - (width - BOUNDARY_MARGIN)) / BOUNDARY_MARGIN) *
            BOUNDARY_STRENGTH;
        }
        if (b.y - b.halfH < BOUNDARY_MARGIN) {
          accelY[i] +=
            ((BOUNDARY_MARGIN - (b.y - b.halfH)) / BOUNDARY_MARGIN) *
            BOUNDARY_STRENGTH;
        } else if (b.y + b.halfH > height - BOUNDARY_MARGIN) {
          accelY[i] -=
            ((b.y + b.halfH - (height - BOUNDARY_MARGIN)) / BOUNDARY_MARGIN) *
            BOUNDARY_STRENGTH;
        }
      }

      // Gegenseitige Abstoßung — jedes Paar nur einmal berechnet, aber
      // symmetrisch (Newton'sches Gegenkraft-Paar) auf beide Akkumulatoren
      // angewendet. Das ist die einzige Kraft, die Logos zueinander in
      // Beziehung setzt — sie reagieren aufeinander, sobald sie sich
      // streifen, sonst bleibt jedes für sich frei unterwegs.
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist =
            Math.max(a.halfW, a.halfH) + Math.max(b.halfW, b.halfH) + MIN_GAP;
          if (dist < minDist) {
            const overlap = (minDist - dist) / minDist;
            const fx = (dx / dist) * overlap * REPEL_STRENGTH;
            const fy = (dy / dist) * overlap * REPEL_STRENGTH;
            accelX[i] += fx;
            accelY[i] += fy;
            accelX[j] -= fx;
            accelY[j] -= fy;
          }
        }
      }

      // Phase 2: einmal integrieren, Geschwindigkeit dämpfen/deckeln,
      // Position fortschreiben, ins DOM schreiben.
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        b.vx = (b.vx + accelX[i] * dt) * DAMPING;
        b.vy = (b.vy + accelY[i] * dt) * DAMPING;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED;
          b.vy = (b.vy / speed) * MAX_SPEED;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        // Harte Sicherheitsgrenze: die weiche Rückführung reicht fast immer,
        // das hier verhindert nur, dass ein Logo bei sehr schneller
        // Cursor-Bewegung sichtbar über den Rand hinausschießt.
        b.x = Math.min(
          Math.max(b.x, b.halfW),
          Math.max(b.halfW, width - b.halfW),
        );
        b.y = Math.min(
          Math.max(b.y, b.halfH),
          Math.max(b.halfH, height - b.halfH),
        );

        const el = itemRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${b.x - b.halfW}px, ${b.y - b.halfH}px, 0)`;
        }
      }

      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      pool.removeEventListener("pointermove", handlePointerMove);
      pool.removeEventListener("pointerleave", handlePointerLeave);
      pool.removeEventListener("pointercancel", handlePointerLeave);
    };
  }, [reduceMotion, logos]);

  return (
    <Section
      background={background}
      className={cn("py-12 sm:py-16 lg:py-16", className)}
    >
      <Container>
        {/*
          Ausgangslayout ist ein ganz normales Flex-Wrap — das ist zugleich
          das Server-gerenderte Markup, das reduced-motion-Ergebnis und der
          kurze Moment vor der Hydration. Erst der Effekt oben löst jedes
          Logo per position:absolute aus dem Fluss, nie das Rendern selbst,
          damit es keine Hydration-Abweichung geben kann. Die feste Höhe
          begrenzt die Fläche, in der sich die Logos frei bewegen.
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
            >
              {/* Absichtlich ein normales <img>, kein next/image: die
                  Dateien kommen roh aus public/images/clients/ (der Kunde
                  legt sie selbst ab), ohne bekannte Breite/Höhe im Voraus.
                  grayscale+invert vereinheitlicht jedes Logo unabhängig von
                  seiner Originalfarbe zu Weiß. Die Höhe (h-9 hier) ist nur
                  der Vor-Hydration-/reduced-motion-Fallback — sobald die
                  Physik läuft, überschreibt sie jedes Logo mit seiner
                  eigenen, zufälligen Größe (sizeRangeFor). */}
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
                onLoad={(e) => {
                  const body = bodiesRef.current[i];
                  if (!body) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  body.halfW = rect.width / 2;
                  body.halfH = rect.height / 2;
                }}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
