// Kunden-Seite: die Logo-Wand bekommt eine eigene Unterseite (statt Platz auf
// der Startseite zu beanspruchen) und einen eigenen Menüpunkt. Inhalt bleibt
// ehrlich, solange der Ordner leer ist, zeigt die Seite selbst keine Logos
// (DESIGN.md §13) — der Hero-Text gilt trotzdem.

import type { Action } from "@/types/content";

interface ClientsContent {
  hero: { eyebrow: string; title: string; subtitle: string };
  cta: { title: string; subtitle: string; action: Action; note: string };
}

export const clients: ClientsContent = {
  hero: {
    eyebrow: "Kunden",
    title: "Marken, die uns vertrauen.",
    subtitle:
      "Ein Ausschnitt der Unternehmen, für die wir Websites gestalten und betreiben.",
  },
  cta: {
    title: "Auch Ihre Website?",
    subtitle:
      "Sehen Sie Ihre Website kostenlos, bevor Sie sich entscheiden — unverbindlich und ohne Risiko.",
    action: { label: "Kostenlos ansehen", href: "/kontakt" },
    note: "Unverbindlich · Antwort meist am selben Tag.",
  },
};
