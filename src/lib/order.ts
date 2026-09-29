/* ============================================================
   VYZIO — Statistique des clics "Commander" (sans donnée perso)
   - Fire-and-forget : n'ouvre jamais WhatsApp en retard, ne bloque rien.
   - Aucune donnée perso : offre + type + page uniquement.
   - Limite client : 1 envoi / 10 s.
   - Passe par l'Edge Function `order-intent` (CORS + validation +
     rate-limit côté serveur). Sans Supabase configuré → silencieux.
   ============================================================ */
import { isValidOrderIntent } from "./security";
import { SUPABASE_KEY, SUPABASE_URL, hasSupabase } from "./supabase";

let lastSent = 0;
const MIN_GAP = 10_000;

export function logOrderIntent(offer: string, kind: "site" | "video" | "contact" | "question") {
  try {
    if (!hasSupabase || !SUPABASE_URL || !SUPABASE_KEY) return;
    if (!isValidOrderIntent(offer, kind)) return;
    const now = Date.now();
    if (now - lastSent < MIN_GAP) return;
    lastSent = now;

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3000);

    fetch(`${SUPABASE_URL}/functions/v1/order-intent`, {
      method: "POST",
      signal: ctrl.signal,
      keepalive: true,
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        // Nouvelles clés : uniquement dans l'en-tête apikey (pas en Bearer)
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({
        offer: offer.slice(0, 80),
        kind,
        page: window.location.pathname.slice(0, 80),
        ts: Date.now(),
        website: "", // honeypot : les robots le remplissent, les humains non
      }),
    })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
  } catch {
    /* statistiques : jamais d'erreur visible */
  }
}
