// Homepage content for CultTwenty. Honest copy for a young agency — no
// invented numbers or testimonials. Client logos have their own page
// (src/content/clients.ts, /kunden), not part of the homepage.

import type { Service } from "@/components/sections/features";
import type { FaqItem } from "@/components/sections/faq";
import type { ProcessStep } from "@/components/sections/process";
import { services } from "@/content/services";
import type { Action, Headline, SectionIntro } from "@/types/content";

interface HomeContent {
  hero: {
    eyebrow: string;
    title: Headline;
    subtitle: string;
    actions: { primary: Action; secondary: Action };
  };
  services: { intro: SectionIntro; items: Service[] };
  process: { intro: SectionIntro; steps: ProcessStep[] };
  faq: { intro: SectionIntro; items: FaqItem[] };
  cta: { title: string; subtitle: string; action: Action; note: string };
}

export const home: HomeContent = {
  hero: {
    eyebrow: "Websites für Unternehmen",
    // Zwei Zeilen statt einer: der Umbruch trennt die Einordnung vom
    // Versprechen und gibt ihm damit das Gewicht.
    title: ["Ihre Website —", "fertig, bevor Sie entscheiden."],
    subtitle:
      "Wir gestalten und betreiben hochwertige Websites für Unternehmen. Sie sehen Ihre Seite kostenlos und entscheiden erst dann. Um Technik, Hosting und Pflege kümmern wir uns.",
    actions: {
      primary: { label: "Kostenlos ansehen", href: "/kontakt" },
      secondary: { label: "Leistungen ansehen", href: "/leistungen" },
    },
  },
  services: {
    intro: {
      eyebrow: "Leistungen",
      title: "Was Sie bekommen",
      subtitle:
        "Alles, was eine Website heute braucht — in einem Rundum-sorglos-Paket, ohne dass Sie sich um Technik kümmern müssen.",
    },
    // Nur die Website-Leistungen — CultTwenty produziert auch Bewegtbild und
    // 3D-Design (siehe /leistungen), aber die Startseite bleibt fokussiert
    // auf das Website-Geschäft.
    items: services
      .filter((service) => service.category === "website")
      .map((service) => ({
        icon: service.icon,
        title: service.title,
        description: service.excerpt,
        href: `/leistungen/${service.slug}`,
      })),
  },
  process: {
    intro: {
      eyebrow: "So einfach geht's",
      title: "In wenigen Schritten online",
      subtitle:
        "Ein klarer Ablauf, bei dem Sie zu keinem Zeitpunkt ein Risiko eingehen.",
    },
    steps: [
      {
        title: "Kostenlos ansehen",
        description:
          "Wir bauen Ihre Website und zeigen sie Ihnen unverbindlich. Sie sehen ein echtes Ergebnis, kein Angebot auf Papier.",
      },
      {
        title: "Anpassen",
        description:
          "Ihre Inhalte, Fotos und Wünsche fließen ein, bis der Auftritt zu Ihrem Unternehmen passt.",
      },
      {
        title: "Live gehen",
        description:
          "Wir veröffentlichen Ihre Website und betreuen sie dauerhaft — inklusive Hosting, Updates und Pflege.",
      },
    ],
  },
  faq: {
    intro: {
      eyebrow: "FAQ",
      title: "Häufige Fragen",
      subtitle:
        "Die Fragen, die im Erstgespräch am häufigsten kommen — offen beantwortet.",
    },
    items: [
      {
        question: "Was kostet eine Website?",
        answer:
          "Das hängt vom Umfang ab. Sie sehen Ihre Website zuerst kostenlos — über den Preis sprechen wir erst, wenn sie Ihnen wirklich gefällt.",
      },
      {
        question: "Wie lange dauert es, bis meine Website online ist?",
        answer:
          "Weil die technische Basis bereits steht, geht es schnell: von Ihren Inhalten bis zum Launch sind es meist nur wenige Tage.",
      },
      {
        question: "Muss ich mich um Technik kümmern?",
        answer:
          "Nein. Hosting, Updates, Sicherheit und Pflege übernehmen wir vollständig. Sie haben mit dem Technischen nichts zu tun.",
      },
      {
        question: "Kann ich meine bestehende Website ablösen?",
        answer:
          "Ja. Wir zeigen Ihnen kostenlos, wie viel hochwertiger und schneller Ihr Auftritt aussehen kann — Sie vergleichen in Ruhe.",
      },
      {
        question: "Wie nehme ich am schnellsten Kontakt auf?",
        answer:
          "Am einfachsten per WhatsApp. Sie erreichen uns aber genauso per E-Mail und Telefon.",
      },
    ],
  },
  cta: {
    title: "Sehen Sie Ihre Website — kostenlos.",
    subtitle:
      "Schreiben Sie uns kurz, worum es geht. Sie bekommen einen unverbindlichen Eindruck, bevor Sie sich entscheiden.",
    action: { label: "Jetzt Kontakt aufnehmen", href: "/kontakt" },
    note: "Unverbindlich · Antwort meist am selben Tag.",
  },
};
