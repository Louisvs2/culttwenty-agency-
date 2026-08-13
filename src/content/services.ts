// CultTwenty services — what customers get, framed as their outcome. This
// file is the single source for service slugs: the homepage cards, the
// overview page, and the detail routes all derive from it.

import {
  Box,
  Clapperboard,
  LifeBuoy,
  Lightbulb,
  Music,
  PenTool,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import type { Feature } from "@/components/sections/features";
import type { FaqItem } from "@/components/sections/faq";
import type { SectionIntro } from "@/types/content";

/**
 * "website" treibt die Startseite (nur diese Karten, damit der erste
 * Eindruck fokussiert bleibt) und den ersten Block auf /leistungen.
 * "kreativ" erscheint ausschließlich als zweiter, eigens überschriebener
 * Block auf /leistungen — CultTwenty ist eine Kreativagentur, aber die
 * Startseite bleibt bewusst beim Website-Geschäft.
 */
export type ServiceCategory = "website" | "kreativ";

export interface ServiceDetail {
  slug: string;
  category: ServiceCategory;
  icon: LucideIcon;
  title: string;
  /** Short card/teaser description, also used as meta description. */
  excerpt: string;
  hero: { title: string; subtitle: string };
  featuresIntro: SectionIntro;
  features: Feature[];
  faq?: FaqItem[];
}

const enthaltenIntro: SectionIntro = {
  eyebrow: "Leistungsumfang",
  title: "Was enthalten ist",
};

export const services: ServiceDetail[] = [
  {
    slug: "webdesign",
    category: "website",
    icon: PenTool,
    title: "Website-Design",
    excerpt:
      "Ein hochwertiges, individuelles Design, das Ihr Unternehmen professionell und unverwechselbar wirken lässt.",
    hero: {
      title: "Ein Design, das Vertrauen schafft",
      subtitle:
        "Wir gestalten Ihren Auftritt so, dass er auf den ersten Blick hochwertig wirkt — passend zu Ihrer Marke und Ihren Kunden.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Individuelles Design",
        description:
          "Kein Baukasten von der Stange — ein Auftritt, der zu Ihrem Unternehmen passt.",
      },
      {
        title: "Perfekt auf jedem Gerät",
        description:
          "Ihre Website sieht auf Handy, Tablet und Desktop makellos aus.",
      },
      {
        title: "Ihre Marke im Mittelpunkt",
        description:
          "Farben, Schrift und Bildsprache spielen Ihre Marke hochwertig aus.",
      },
      {
        title: "Klar und übersichtlich",
        description:
          "Besucher finden sofort, was sie suchen — und werden zu Kunden.",
      },
    ],
    faq: [
      {
        question: "Kann ich mein Logo und meine Farben verwenden?",
        answer:
          "Selbstverständlich. Wir richten das Design an Ihrer bestehenden Marke aus — oder helfen, sie aufzufrischen.",
      },
      {
        question: "Sehe ich das Design vorab?",
        answer:
          "Ja. Sie sehen Ihre Website kostenlos, bevor Sie sich entscheiden.",
      },
    ],
  },
  {
    slug: "umsetzung-launch",
    category: "website",
    icon: Rocket,
    title: "Umsetzung & Launch",
    excerpt:
      "Wir bauen Ihre Website technisch sauber und bringen sie schnell und zuverlässig online.",
    hero: {
      title: "Schnell und sauber online",
      subtitle:
        "Von den Inhalten bis zum Launch übernehmen wir alles — technisch einwandfrei, schnell und für Google optimiert.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Schnell live",
        description:
          "Weil die Basis steht, ist Ihre Website oft in wenigen Tagen online.",
      },
      {
        title: "Bei Google gefunden",
        description:
          "Sauber für Suchmaschinen gebaut — die Grundlage für mehr Sichtbarkeit.",
      },
      {
        title: "Blitzschnelle Ladezeiten",
        description:
          "Schnelle Seiten halten Besucher und wirken professionell.",
      },
      {
        title: "Rechtssicher aufgesetzt",
        description:
          "Impressum, Datenschutz und Cookie-Hinweis sind von Anfang an dabei.",
      },
    ],
  },
  {
    slug: "hosting-support",
    category: "website",
    icon: LifeBuoy,
    title: "Hosting, Pflege & Support",
    excerpt:
      "Wir betreiben Ihre Website dauerhaft — um Technik, Updates und Sicherheit müssen Sie sich nie kümmern.",
    hero: {
      title: "Sie müssen sich um nichts kümmern",
      subtitle:
        "Ihre Website läuft, ist sicher und bleibt aktuell — dafür sorgen wir, damit Sie sich auf Ihr Geschäft konzentrieren können.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Zuverlässiges Hosting",
        description: "Ihre Website ist schnell erreichbar und stabil online.",
      },
      {
        title: "Updates & Sicherheit",
        description:
          "Wir halten alles aktuell und geschützt — ganz ohne Ihr Zutun.",
      },
      {
        title: "Änderungen jederzeit",
        description:
          "Neue Inhalte oder Anpassungen? Ein kurzer Hinweis genügt.",
      },
      {
        title: "Persönlicher Ansprechpartner",
        description:
          "Ein fester Kontakt, der Sie kennt und schnell erreichbar ist.",
      },
    ],
  },
  {
    slug: "werbevideos",
    category: "kreativ",
    icon: Clapperboard,
    title: "Werbevideos",
    excerpt:
      "Kurze, wirkungsvolle Videos für Social Media, Ads und Ihre Website — von der Idee bis zum fertigen Schnitt.",
    hero: {
      title: "Bewegtbild, das im Kopf bleibt",
      subtitle:
        "Wir entwickeln, drehen und schneiden Werbevideos, die Ihre Botschaft in Sekunden auf den Punkt bringen — für Social Media, Ads oder Ihre Website.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Konzept & Storyboard",
        description:
          "Jedes Video beginnt mit einer klaren Idee, nicht mit der Kamera.",
      },
      {
        title: "Dreh vor Ort oder im Studio",
        description:
          "Je nach Format wählen wir den passenden Rahmen für Ihre Marke.",
      },
      {
        title: "Schnitt & Farbkorrektur",
        description:
          "Professioneller Schnitt macht aus Rohmaterial ein fertiges Werbemittel.",
      },
      {
        title: "Fertig für jeden Kanal",
        description:
          "Formate und Längen passend für Instagram, YouTube oder Ihre Website.",
      },
    ],
  },
  {
    slug: "musikvideos",
    category: "kreativ",
    icon: Music,
    title: "Musikvideos",
    excerpt:
      "Visuelle Konzepte und Produktion für Musikvideos — von der ersten Idee bis zum fertigen Video.",
    hero: {
      title: "Ihre Musik, visuell erzählt",
      subtitle:
        "Wir entwickeln ein visuelles Konzept, das zu Ihrem Sound passt, und setzen es von der Vorproduktion bis zum fertigen Schnitt um.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Visuelles Konzept",
        description:
          "Ein roter Faden, der zu Track und Künstler passt, statt austauschbarer Bilder.",
      },
      {
        title: "Vorproduktion & Planung",
        description:
          "Location, Ausstattung und Ablauf stehen, bevor gedreht wird.",
      },
      {
        title: "Produktion vor Ort",
        description:
          "Professionelle Kamera- und Lichttechnik für ein hochwertiges Ergebnis.",
      },
      {
        title: "Schnitt im Takt",
        description: "Der Schnitt folgt der Musik, nicht umgekehrt.",
      },
    ],
  },
  {
    slug: "konzepte",
    category: "kreativ",
    icon: Lightbulb,
    title: "Kreativkonzepte",
    excerpt:
      "Von der Kampagnenidee bis zum roten Faden — wir entwickeln das kreative Konzept hinter Ihrem Projekt.",
    hero: {
      title: "Die Idee vor der Umsetzung",
      subtitle:
        "Bevor gedreht, gestaltet oder gebaut wird, steht die Idee — wir entwickeln das kreative Konzept, das Ihr Projekt trägt.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Strategie & Idee",
        description: "Ein Konzept, das zu Ihrer Marke und Ihrem Ziel passt.",
      },
      {
        title: "Moodboards & Referenzen",
        description:
          "Bevor produziert wird, ist sichtbar, wohin die Reise geht.",
      },
      {
        title: "Kampagnenlogik",
        description:
          "Eine Idee, die sich über mehrere Formate und Kanäle trägt.",
      },
      {
        title: "Klare Übergabe",
        description:
          "Ein Konzept, das jedes beteiligte Team direkt umsetzen kann.",
      },
    ],
  },
  {
    slug: "3d-design",
    category: "kreativ",
    icon: Box,
    title: "3D-Design",
    excerpt:
      "Dreidimensionale Visualisierungen und Animationen für Produkte, Räume und Marken.",
    hero: {
      title: "Sichtbar machen, was noch nicht existiert",
      subtitle:
        "Wir visualisieren Produkte, Räume und Ideen in 3D — fotorealistisch oder gestalterisch, je nachdem, was Ihr Projekt braucht.",
    },
    featuresIntro: enthaltenIntro,
    features: [
      {
        title: "Produktvisualisierung",
        description:
          "Produkte fotorealistisch zeigen, auch bevor sie physisch existieren.",
      },
      {
        title: "3D-Animation",
        description:
          "Bewegte Visualisierungen für Video, Web oder Social Media.",
      },
      {
        title: "Raum- & Architekturvisualisierung",
        description: "Räume erlebbar machen, bevor sie gebaut sind.",
      },
      {
        title: "Markenkonforme Umsetzung",
        description: "Farben, Materialien und Stil passend zu Ihrer Marke.",
      },
    ],
  },
];

export const servicesPage = {
  hero: {
    title: "Unsere Leistungen",
    subtitle:
      "Von Design über Umsetzung bis Betrieb — alles aus einer Hand, damit Sie sich um nichts kümmern müssen.",
  },
  creativeIntro: {
    eyebrow: "Kreativproduktion",
    title: "Mehr als Websites",
    subtitle:
      "Als Kreativagentur produzieren wir auch Bewegtbild, Konzepte und 3D-Design — für Marken, die mehr brauchen als eine Website.",
  },
  cta: {
    title: "Nicht sicher, was Sie brauchen?",
    subtitle:
      "Schreiben Sie uns kurz — wir zeigen Ihnen kostenlos, was für Ihr Unternehmen möglich ist.",
    action: { label: "Kostenlos ansehen", href: "/kontakt" },
    note: "Unverbindlich · Antwort meist am selben Tag.",
  },
};
