import fs from "node:fs";
import path from "node:path";

import type { Logo } from "@/types/content";

const CLIENTS_DIR = path.join(process.cwd(), "public/images/clients");
const ALLOWED_EXTENSIONS = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);

function humanize(filename: string): string {
  const withoutExtension = filename.slice(0, -path.extname(filename).length);
  // Erlaubt eine eigene Sortierung per Dateiname (z. B. "01-nike.svg"), ohne
  // dass die Nummer im Alt-Text landet.
  const withoutOrderPrefix = withoutExtension.replace(/^\d+[-_.]?/, "");
  return withoutOrderPrefix
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Liest Kundenlogos aus public/images/clients/ — der Kunde legt Dateien dort
 * selbst ab (kein Code-Edit pro neuem Logo nötig). Läuft beim Build (statischer
 * Export), nicht im Browser; ein fehlender Ordner ist kein Fehler, sondern
 * "noch keine Logos".
 */
export function getClientLogos(): Logo[] {
  if (!fs.existsSync(CLIENTS_DIR)) return [];

  return fs
    .readdirSync(CLIENTS_DIR)
    .filter((file) => ALLOWED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "de"))
    .map((file) => ({
      src: `/images/clients/${file}`,
      alt: humanize(file),
    }));
}
