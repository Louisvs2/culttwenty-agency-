// The single source of every menu on the site (PLAN.md §3). Header, mobile
// navigation, and footer render exclusively from this config — adding or
// removing a page never touches a component.

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  items: NavItem[];
}

export interface NavigationConfig {
  /** Header navigation (desktop and mobile). */
  main: NavItem[];
  /** Primary call to action shown in the header and mobile navigation. */
  cta: NavItem;
  /** Footer link columns. */
  footer: FooterColumn[];
  /** Legal links in the footer bottom bar. */
  legal: NavItem[];
}

const mainNav: NavItem[] = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Kunden", href: "/kunden" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export const navigation: NavigationConfig = {
  main: mainNav,
  cta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  footer: [{ title: "Navigation", items: mainNav }],
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
};
