/* ============================================================
   VYZIO — Client Supabase (lecture seule, anti-saccade)
   Variables (Vercel → Settings → Environment Variables, ou .env local) :
     VITE_SUPABASE_URL              https://xxxx.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY  sb_publishable_...   (nouvelle clé)
     (ou VITE_SUPABASE_ANON_KEY, ancienne clé "anon" eyJ..., acceptée aussi)
   Ces 2 valeurs sont PUBLIQUES par nature (visibles dans le navigateur).
   La sécurité vient du RLS : cette clé ne peut que LIRE le contenu.
   Ne mettez JAMAIS la clé secrète (sb_secret_...) ici.
   Sans variables (ou variables invalides) : le site utilise src/data.ts.
   Pour vérifier la configuration en ligne : ouvrez  /?diagnostic
   ============================================================ */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Nettoie les erreurs de copier-coller courantes : espaces, retours à la
// ligne, guillemets autour de la valeur, "NOM=valeur" collé en entier.
function clean(raw: string | undefined, name: string): string | undefined {
  if (!raw) return undefined;
  let v = raw.trim();
  if (v.startsWith(`${name}=`)) v = v.slice(name.length + 1).trim();
  v = v.replace(/^["'`]+|["'`]+$/g, "").trim();
  return v || undefined;
}

const RAW_URL = clean(import.meta.env.VITE_SUPABASE_URL as string | undefined, "VITE_SUPABASE_URL");
const RAW_KEY =
  clean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined, "VITE_SUPABASE_PUBLISHABLE_KEY") ||
  clean(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined, "VITE_SUPABASE_ANON_KEY");

export type UrlStatus = "ok" | "absente" | "invalide" | "mauvaise-adresse";
export type KeyStatus = "publishable" | "anon" | "absente" | "secrete-refusee" | "format-inconnu";

// Garde seulement l'origine : https://xxxx.supabase.co/rest/v1/ → https://xxxx.supabase.co
function checkUrl(url?: string): { status: UrlStatus; origin?: string } {
  if (!url) return { status: "absente" };
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return { status: "invalide" };
    // Erreur fréquente : l'adresse du Dashboard (supabase.com/dashboard/...)
    if (!u.hostname.endsWith(".supabase.co")) return { status: "mauvaise-adresse" };
    return { status: "ok", origin: u.origin };
  } catch {
    return { status: "invalide" };
  }
}

function checkKey(key?: string): KeyStatus {
  if (!key) return "absente";
  if (key.startsWith("sb_secret_")) return "secrete-refusee";
  if (key.startsWith("sb_publishable_")) return "publishable";
  // Ancienne clé "anon" : un JWT en 3 parties qui commence par eyJ
  if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(key)) return "anon";
  return "format-inconnu";
}

const urlCheck = checkUrl(RAW_URL);
const keyStatus = checkKey(RAW_KEY);

if (keyStatus === "secrete-refusee") {
  console.error("[VYZIO] Clé SECRÈTE détectée côté front : refusée. Utilisez la clé publishable.");
}

export const SUPABASE_URL = urlCheck.origin;
export const SUPABASE_KEY = keyStatus === "publishable" || keyStatus === "anon" ? RAW_KEY : undefined;
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** État de la configuration, pour la page /?diagnostic (aucun secret exposé). */
export const configStatus = {
  urlStatus: urlCheck.status,
  urlValue: RAW_URL,
  keyStatus,
  keyPreview: RAW_KEY ? `${RAW_KEY.slice(0, 18)}…` : undefined,
  usedVariable: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ? "VITE_SUPABASE_PUBLISHABLE_KEY"
    : import.meta.env.VITE_SUPABASE_ANON_KEY
      ? "VITE_SUPABASE_ANON_KEY"
      : undefined,
};

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase) return null;
  if (!client) {
    client = createClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}

/* Pré-chauffe la connexion (DNS + TLS) après l'ouverture. */
export function warmSupabase() {
  if (!hasSupabase) return;
  try {
    getSupabase()?.from("site_settings").select("key").limit(1).then(() => {});
  } catch {
    /* silencieux : le fallback local prend le relais */
  }
}
