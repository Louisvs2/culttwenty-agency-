import { CTA } from "@/components/sections/cta";
import { ServiceCards } from "@/components/sections/features";
import { HeroCentered } from "@/components/sections/hero";
import { services, servicesPage } from "@/content/services";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Leistungen: Website-Design, Umsetzung und Hosting",
  description: servicesPage.hero.subtitle,
  path: "/leistungen/",
});

function toCard(service: (typeof services)[number]) {
  return {
    icon: service.icon,
    title: service.title,
    description: service.excerpt,
    href: `/leistungen/${service.slug}`,
  };
}

export default function LeistungenPage() {
  const websiteServices = services.filter((s) => s.category === "website");
  const creativeServices = services.filter((s) => s.category === "kreativ");

  return (
    <>
      <HeroCentered
        title={servicesPage.hero.title}
        subtitle={servicesPage.hero.subtitle}
        className="py-20 sm:py-24 lg:py-28"
      />
      <ServiceCards items={websiteServices.map(toCard)} background="muted" />
      {/* Eigener, überschriebener Block statt in derselben Karten-Reihe —
          das Website-Geschäft bleibt der erste Eindruck, Kreativproduktion
          kommt sichtbar als zweites Angebot dazu (nicht auf der Startseite,
          siehe home.ts). */}
      <ServiceCards
        intro={servicesPage.creativeIntro}
        items={creativeServices.map(toCard)}
      />
      <CTA {...servicesPage.cta} />
    </>
  );
}
