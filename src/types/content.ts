import type { StaticImageData } from "next/image";

/** A link with a label — used for CTAs and nav-like references in sections. */
export interface Action {
  label: string;
  href: string;
}

/**
 * Headline as one string, or als Liste von Zeilen. Die Betonung entsteht
 * allein durch den Umbruch — die Schrift bleibt durchgehend weiß.
 */
export type Headline = string | string[];

/** Standard section opener content, rendered via SectionHeading. */
export interface SectionIntro {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/** Image for fill-based rendering inside aspect-ratio containers.
 *  alt is required — decorative images don't belong in sections (DESIGN.md §12). */
export interface SectionImage {
  src: string | StaticImageData;
  alt: string;
  /** Kurze Bildunterschrift, z. B. „Autohaus · Konzeptentwurf". Trägt bei den
   *  Arbeiten die Kennzeichnung, dass es sich um einen Entwurf handelt — die
   *  darf nicht nur in der Abschnittsüberschrift stehen, an der jemand
   *  vorbeiscrollt. */
  caption?: string;
}

/** Logo, rendered at a fixed CSS height with the browser keeping the aspect
 *  ratio — intrinsic dimensions aren't known ahead of time since these come
 *  from files dropped into public/images/clients/ by the client. */
export interface Logo {
  src: string | StaticImageData;
  alt: string;
}

/** A framed image that fills its aspect box (object-cover). */
export interface HeroImageMedia {
  type: "image";
  src: string | StaticImageData;
  alt: string;
}

/** An autoplaying, muted, looping background video. Under
 *  prefers-reduced-motion it does not autoplay and shows the poster. */
export interface HeroVideoMedia {
  type: "video";
  /** Video file URL (mp4/webm). */
  src: string;
  /** Poster frame — shown before play and when motion is reduced. */
  poster?: string;
  /** Accessible description of the video content. */
  alt: string;
}

/** A foreground object floating on a premium stage (object-contain). Ideally
 *  a cut-out asset (transparent product/device/render). */
export interface HeroObjectMedia {
  type: "object";
  src: string | StaticImageData;
  alt: string;
}

/** Optional hero visual, discriminated by `type`. The Hero System renders
 *  each kind with its own premium treatment (see HeroVisual). */
export type HeroMedia = HeroImageMedia | HeroVideoMedia | HeroObjectMedia;
