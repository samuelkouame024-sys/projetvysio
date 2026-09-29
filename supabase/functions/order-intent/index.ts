// ============================================================
// VYZIO — Edge Function `order-intent`
// Log sécurisé des clics "Commander" (analytics maison, sans PII).
// Sécurité : CORS allowlist, validation stricte, honeypot anti-bot,
// rate-limit 5 req/min/IP, payload ≤ 2 Ko, insert via service_role
// (la table n'a AUCUNE policy publique).
//
// Deploy (voir GUIDE-DEPLOIEMENT.md, étape 4) :
//   npx supabase functions deploy order-intent --no-verify-jwt
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis AUTOMATIQUEMENT
// par Supabase — ne les définissez pas vous-même.
// ============================================================
// @ts-nocheck — runtime Deno Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Origines autorisées : secret ALLOWED_ORIGINS (séparées par des virgules)
//   = l'adresse EXACTE de VOTRE site, ex : https://mon-projet-abc123.vercel.app
//   (ouvrez /?diagnostic sur votre site : l'adresse à copier y est affichée)
// AUCUNE adresse par défaut : sans ce secret, seul le test local est accepté.
// ⚠️ N'utilisez pas https://vyzio.vercel.app : ce domaine appartient à un autre site.
// Previews Vercel : secret PREVIEW_PREFIX (ex : "vyzio-") autorise
//   uniquement https://vyzio-xxxx.vercel.app (vos previews, pas celles des autres).
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "")
  .split(",")
  .map((s: string) => s.trim().replace(/\/$/, ""))
  .filter(Boolean)
  .concat(["http://localhost:5173", "http://localhost:4173"]);
const PREVIEW_PREFIX = (Deno.env.get("PREVIEW_PREFIX") || "").trim();

function isAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (!PREVIEW_PREFIX) return null;
  try {
    const u = new URL(origin);
    if (
      u.protocol === "https:" &&
      u.hostname.endsWith(".vercel.app") &&
      u.hostname.startsWith(PREVIEW_PREFIX)
    ) {
      return origin;
    }
  } catch {
    /* ignore */
  }
  return null;
}

// Rate-limit mémoire (par instance isolate — suffisant + table en secours)
const hits = new Map<string, number[]>();
const WINDOW = 60_000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  // Nettoyage opportuniste
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW)) hits.delete(k);
  }
  return arr.length > MAX_HITS;
}

const KINDS = new Set(["site", "video", "contact", "question"]);

// --- Clés fournies AUTOMATIQUEMENT par Supabase (ne rien configurer) ---
// Nouvelles clés : SUPABASE_SECRET_KEYS / SUPABASE_PUBLISHABLE_KEYS (JSON)
// Anciennes clés : SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY
function readJsonKeys(name: string): string[] {
  try {
    const raw = Deno.env.get(name);
    if (!raw) return [];
    return Object.values(JSON.parse(raw)).filter((v) => typeof v === "string") as string[];
  } catch {
    return [];
  }
}
function getSecretKey(): string | undefined {
  try {
    const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
    if (raw) {
      const k = JSON.parse(raw)["default"];
      if (typeof k === "string" && k) return k;
    }
  } catch {
    /* ignore */
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || undefined;
}
// Clés publiques acceptées : seul VOTRE site (avec VOTRE clé publishable) peut appeler
const PUBLIC_KEYS = new Set(
  [...readJsonKeys("SUPABASE_PUBLISHABLE_KEYS"), Deno.env.get("SUPABASE_ANON_KEY") || ""].filter(Boolean)
);

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const allowed = isAllowedOrigin(origin);
  const cors = {
    "Access-Control-Allow-Origin": allowed ?? "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (!allowed) {
    return new Response(JSON.stringify({ error: "forbidden_origin" }), {
      status: 403,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Déployée avec --no-verify-jwt → on vérifie la clé nous-mêmes
  const apikey = req.headers.get("apikey") || "";
  if (PUBLIC_KEYS.size > 0 && !PUBLIC_KEYS.has(apikey)) {
    return new Response(JSON.stringify({ error: "invalid_key" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { ...cors, "Content-Type": "application/json", "Retry-After": "60" },
    });
  }

  // Payload ≤ 2 Ko (vérifié sur le contenu réel, pas seulement l'en-tête)
  const len = Number(req.headers.get("content-length") || "0");
  if (len > 2048) {
    return new Response(JSON.stringify({ error: "payload_too_large" }), {
      status: 413,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 2048) {
      return new Response(JSON.stringify({ error: "payload_too_large" }), {
        status: 413,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "bad_json" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const { offer, kind, page, ts, website } = (body || {}) as Record<string, unknown>;

  // Honeypot : bot détecté → on répond 204 sans rien logger
  if (typeof website === "string" && website.length > 0) {
    return new Response(null, { status: 204, headers: cors });
  }
  if (
    typeof offer !== "string" ||
    offer.length < 2 ||
    offer.length > 80 ||
    /[<>]/.test(offer) ||
    typeof kind !== "string" ||
    !KINDS.has(kind) ||
    (page !== undefined && (typeof page !== "string" || page.length > 80 || /[<>]/.test(page))) ||
    (ts !== undefined && (typeof ts !== "number" || Math.abs(Date.now() - ts) > 10 * 60_000))
  ) {
    return new Response(JSON.stringify({ error: "invalid_payload" }), {
      status: 422,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const key = getSecretKey();
  if (!url || !key) {
    return new Response(JSON.stringify({ error: "misconfigured" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await sb.from("order_intents").insert({
    offer,
    kind,
    page: typeof page === "string" ? page : "/",
  });
  if (error) {
    console.error("order-intent insert failed", error.message);
    return new Response(JSON.stringify({ error: "store_failed" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  return new Response(null, { status: 204, headers: cors });
});
