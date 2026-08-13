import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { FeatureGrid, ServiceCards } from "@/components/sections/features";
import { Gallery } from "@/components/sections/gallery";
import { HeroCentered } from "@/components/sections/hero";
import { ProcessSteps } from "@/components/sections/process";
import { TeamGrid } from "@/components/sections/team";
import { home } from "@/content/home";
import { team } from "@/content/team";
import { work } from "@/content/work";
import { createMetadata } from "@/lib/metadata";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/shared/json-ld";

// Firmenname zuerst: Im Browser-Tab sind nur die ersten rund 35 Zeichen zu
// sehen, ein Name am Ende ist dort unsichtbar. Direkt danach das wichtigste
// Suchwort, dann das Versprechen. Dass Google bei rund 60 Zeichen abschneidet
// und "dann entscheiden" in der Trefferliste fehlen wird, ist bewusst in Kauf
// genommen — im Tab und im Lesezeichen zählt der Anfang.
//
// `absoluteTitle` bleibt gesetzt, sonst hängt die Fabrik den Firmennamen ein
// zweites Mal hinten an.
export const metadata = createMetadata({
  title: "CultTwenty — Website erstellen lassen, erst sehen dann entscheiden",
  description: home.hero.subtitle,
  path: "/",
  absoluteTitle: true,
});

// CultTwenty homepage: promise → offer → how it works → who you'll talk to →
// objections → action. No invented proof (stats/testimonials) for a young firm.
export default function HomePage() {
  return (
    <>
      <HeroCentered {...home.hero} />
      {/* Zuerst die Einordnung: Wer die Seite öffnet, will als Erstes wissen,
          ob er überhaupt gemeint ist. */}
      <FeatureGrid
        intro={work.audience.intro}
        items={work.audience.items}
        background="muted"
      />
      <ServiceCards intro={home.services.intro} items={home.services.items} />
      {/* Erst sagen, was wir tun — dann zeigen, wie es aussieht. */}
      <Gallery
        intro={work.intro}
        images={work.images}
        layout="stack"
        background="muted"
      />
      <ProcessSteps intro={home.process.intro} steps={home.process.steps} />
      <TeamGrid intro={team.intro} members={team.members} background="muted" />
      <FAQ intro={home.faq.intro} items={home.faq.items} />
      {/* Nur die Fragen, die auch sichtbar auf der Seite stehen — alles andere
          verstößt gegen Googles Regeln für strukturierte Daten. */}
      <JsonLd
        schema={faqSchema(
          home.faq.items.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )}
      />
      <CTA {...home.cta} />
    </>
  );
}
