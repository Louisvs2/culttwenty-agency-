// CultTwenty team — the people behind the work (DESIGN.md §13). Photos share
// one studio style; contact for everyone runs through the shared channels.

import type { TeamMember } from "@/components/sections/team";
import type { SectionIntro } from "@/types/content";

export const team: { intro: SectionIntro; members: TeamMember[] } = {
  intro: {
    eyebrow: "Team",
    title: "Die Menschen hinter CultTwenty",
    // Der Zusatz löst einen Widerspruch auf: Im Impressum stehen zwei
    // Gesellschafter, auf dieser Seite vier Gesichter — wer beides liest,
    // fragt sich sonst, welche Angabe stimmt. Beide stimmen.
    subtitle:
      "Ein kleines, eingespieltes Team aus Beratung, Design, Entwicklung und Betreuung — damit Ihre Website aus einer Hand entsteht. Gesellschafter der CultTwenty GbR sind Louis Reinecke und Noel David Ritter; im Tagesgeschäft arbeiten Sie mit den hier vorgestellten Personen zusammen.",
  },
  members: [
    {
      name: "Louis Reinecke",
      role: "Creative Director",
      image: {
        src: "/images/team/louis.jpg",
        alt: "Porträt von Louis Reinecke, Creative Director bei CultTwenty",
      },
      bio: "Louis verantwortet die kreative Linie jeder Website — von der ersten Idee bis zum fertigen Design. Er sorgt dafür, dass Ihr Auftritt hochwertig wirkt und zu Ihrer Marke passt.",
      responsibilities: [
        "Design & Art Direction",
        "Marken- & Bildsprache",
        "Kreative Konzeption",
      ],
    },
    {
      name: "Dilan Assadi",
      role: "Lead Developer",
      image: {
        src: "/images/team/dilan.jpg",
        alt: "Porträt von Dilan Assadi, Lead Developer bei CultTwenty",
      },
      bio: "Dilan bringt jede Website technisch zum Laufen — schnell, sicher und zuverlässig. Er kümmert sich um Architektur, Performance und den reibungslosen Betrieb im Hintergrund.",
      responsibilities: [
        "Entwicklung & Architektur",
        "Performance & Sicherheit",
        "Hosting & Betrieb",
      ],
    },
    {
      name: "Samuel Edokpolor",
      role: "Project & Client Success Manager",
      image: {
        src: "/images/team/samuel.jpg",
        alt: "Porträt von Samuel Edokpolor, Project & Client Success Manager bei CultTwenty",
      },
      bio: "Samuel ist Ihr fester Ansprechpartner von Anfang bis Launch. Er koordiniert Termine, Inhalte und das Team, damit alles reibungslos zusammenläuft und Sie sich um nichts kümmern müssen.",
      responsibilities: [
        "Projektkoordination",
        "Kundenbetreuung",
        "Planung & Ablauf",
      ],
    },
    {
      name: "Dannay Tekle",
      role: "Vertrieb & Partnernetz",
      // Ohne `image` zeigt die Karte den neutralen Platzhalter statt eines
      // kaputten Bildes. Sobald public/images/team/dannay.jpg im Repo liegt,
      // kommt hier derselbe Block wie oben dazu — klein geschrieben, denn der
      // Strato-Server unterscheidet Groß- und Kleinschreibung.
      bio: "Dannay ist meist die erste Person, mit der Sie sprechen — noch bevor irgendetwas gebaut wird. Er hört zu, was Sie brauchen, und betreut die Partner, die bei Ihnen vor Ort unterwegs sind.",
      responsibilities: [
        "Erstgespräch & Beratung",
        "Partnerbetreuung",
        "Angebote",
      ],
    },
  ],
};
