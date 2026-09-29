/* ============================================================
   VYZIO — Sécurité frontend
   Toute URL externe ou texte CMS passe par ici.
   Aucune donnée sensible ne transite : pas de PII collectée.
   ============================================================ */

const WA_NUMBER_RE = /^[0-9]{10,15}$/;

// Domaines autorisés pour les aperçus (anti open-redirect / anti phishing)
const FRAME_ALLOWLIST = [
  "baobab-d-or.vercel.app",
  "nexu-mocha.vercel.app",
  "aurea-estates-nwyc.vercel.app",
  "website-car-xi.vercel.app",
];

const IMG_ALLOWLIST = ["images.pexels.com"];

export function isSafeHttpUrl(raw: string, extraHosts: string[] = []): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    if (u.username || u.password) return false;
    const host = u.hostname.toLowerCase();
    const allowed = [...FRAME_ALLOWLIST, ...IMG_ALLOWLIST, ...extraHosts];
    // Supabase CDN : n'importe quel projet *.supabase.co en lecture
    if (host.endsWith(".supabase.co")) return true;
    return allowed.includes(host);
  } catch {
    return false;
  }
}

/** Reconstruit un lien wa.me depuis un numéro validé — jamais depuis une entrée brute. */
export function buildWaLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  if (!WA_NUMBER_RE.test(digits)) throw new Error("Numéro WhatsApp invalide");
  const clean = message.slice(0, 500);
  return `https://wa.me/${digits}?text=${encodeURIComponent(clean)}`;
}

/** Échappe le HTML d'un texte CMS (défense en profondeur, même sans innerHTML). */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Valide un intent de commande côté client avant envoi (le serveur re-valide). */
export function isValidOrderIntent(offer: string, kind: string): boolean {
  if (typeof offer !== "string" || typeof kind !== "string") return false;
  if (offer.length < 2 || offer.length > 80) return false;
  if (!["site", "video", "contact", "question"].includes(kind)) return false;
  if (/[<>]/.test(offer)) return false;
  return true;
}

// La validation de la config Supabase (URL + clé, refus des clés secrètes)
// est centralisée dans src/lib/supabase.ts → isValidConfig().
