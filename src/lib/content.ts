/* ============================================================
   VYZIO — Couche contenu : Supabase d'abord, local en fallback.
   Stratégie anti-saccade :
   1. Mémoire (instantané)
   2. localStorage 24 h (instantané, hors-ligne OK)
   3. Supabase (réseau, puis mise en cache)
   4. Données locales compilées (jamais d'écran vide)
   ============================================================ */
import { useEffect, useState } from "react";
import { SUPABASE_URL, getSupabase, hasSupabase } from "./supabase";
import { isSafeHttpUrl } from "./security";
import {
  FAQS as LOCAL_FAQS,
  PROJECTS as LOCAL_PROJECTS,
  SITE_OFFERS as LOCAL_SITES,
  VIDEO_PACKS as LOCAL_PACKS,
  VIDEO_PRESENTATION as LOCAL_PRESENTATION,
  VIDEOS as LOCAL_VIDEOS,
} from "../data";

// Nettoie une ligne CMS : longueur bornée, pas de < > (anti-XSS en profondeur)
function cleanText(s: unknown, max = 200): string {
  if (typeof s !== "string") return "";
  const t = s.slice(0, max);
  if (/[<>]/.test(t)) return "";
  return t;
}

// v2 : ajout des vidéos de secours (l'ancien cache est ignoré automatiquement)
const CACHE_KEY = "vyzio-content-v2";
const TTL = 24 * 3600 * 1000; // 24 h

export type VideoItem = {
  id: string;
  src: string;
  caption: string;
  num: string;
  /** Lien d'origine utilisé si la vidéo Supabase ne charge pas. */
  fallback?: string;
};

export type SiteContent = {
  projects: typeof LOCAL_PROJECTS;
  siteOffers: typeof LOCAL_SITES;
  videoPacks: typeof LOCAL_PACKS;
  videos: VideoItem[];
  faqs: typeof LOCAL_FAQS;
  videoPresentation: string;
  videoPresentationFallback: string;
};

// URL publique CDN, calculée SANS requête réseau (déterministe) :
// https://xxxx.supabase.co/storage/v1/object/public/videos/<fichier>
function publicVideoUrl(file: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/videos/${encodeURIComponent(file)}`;
}

// Supabase configuré → vidéos servies par VOTRE bucket public dès le 1er
// affichage (plus de dépendance aux anciens liens signés qui expirent).
// Pas configuré → liens d'origine de src/data.ts.
// Si le fichier n'est pas (encore) dans le bucket, le lecteur bascule tout
// seul sur le lien d'origine → le site ne casse jamais à cause de Supabase.
const LOCAL_CONTENT: SiteContent = {
  projects: LOCAL_PROJECTS,
  siteOffers: LOCAL_SITES,
  videoPacks: LOCAL_PACKS,
  videos: hasSupabase
    ? LOCAL_VIDEOS.map((v, i) => ({ ...v, src: publicVideoUrl(`video-${i + 1}.mp4`), fallback: v.src }))
    : LOCAL_VIDEOS,
  faqs: LOCAL_FAQS,
  videoPresentation: hasSupabase ? publicVideoUrl("presentation.mp4") : LOCAL_PRESENTATION,
  videoPresentationFallback: LOCAL_PRESENTATION,
};

// Pré-connexion au CDN Supabase dès le chargement (vidéos plus rapides)
if (hasSupabase && typeof document !== "undefined" && SUPABASE_URL) {
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = SUPABASE_URL;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

let memory: SiteContent | null = null;

function readCache(): SiteContent | null {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > TTL) return null;
    memory = data;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: SiteContent) {
  memory = data;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* stockage plein : on garde la mémoire */
  }
}

async function fetchFromSupabase(): Promise<SiteContent | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const [projects, sites, packs, videos, faqs, settings] = await Promise.all([
      sb.from("projects").select("name,line,tag,url,note,sort").order("sort").limit(12),
      sb.from("site_offers").select("name,tagline,price_eur,is_star,sort").order("sort").limit(20),
      sb.from("video_packs").select("name,tagline,price_eur,detail,sort").order("sort").limit(20),
      sb.from("videos").select("slot,caption,storage_path,sort").order("sort").limit(12),
      sb.from("faqs").select("question,answer,sort").order("sort").limit(20),
      sb.from("site_settings").select("key,value").in("key", ["video_presentation_path", "poster_presentation", "poster_vertical"]),
    ]);

    if (projects.error || sites.error || packs.error) return null;

    // URLs publiques CDN (bucket "videos" en public + cache 1 an).
    // Bien plus fluides que des URLs signées : pas de calcul à chaque
    // lecture, le CDN edge sert le fichier avec Range requests.
    const settingsMap: Record<string, string> = {};
    (settings.data || []).forEach((s: { key: string; value: string }) => {
      settingsMap[s.key] = s.value;
    });

    const pubUrl = (path: string) => {
      if (!path) return "";
      if (path.startsWith("http")) return path;
      return sb.storage.from("videos").getPublicUrl(path).data.publicUrl;
    };

    const videosRows = (videos.data || []) as { slot: string; caption: string; storage_path: string }[];
    const videosMapped = videosRows.length
      ? videosRows
          // La présentation sert au fond d'ouverture, pas à la section Vidéos
          .filter((v) => v.slot !== "presentation")
          .map((v, i) => {
            const src = pubUrl(cleanText(v.storage_path, 300));
            if (!src || !isSafeHttpUrl(src)) return null;
            const item: VideoItem = {
              id: cleanText(v.slot, 40) || `video-${i + 1}`,
              src,
              caption: cleanText(v.caption, 120),
              num: String(i + 1).padStart(2, "0"),
              fallback: LOCAL_VIDEOS[i]?.src,
            };
            return item;
          })
          .filter((v): v is VideoItem => v !== null)
      : [];
    const safeVideos: VideoItem[] = videosMapped.length ? videosMapped : LOCAL_CONTENT.videos;

    // Projets : URL validée contre allowlist, sinon fallback local
    const safeProjects = (projects.data?.length ? projects.data : []).filter((p: { url: string }) =>
      isSafeHttpUrl(p.url)
    );
    const presentationUrl = settingsMap["video_presentation_path"]
      ? pubUrl(cleanText(settingsMap["video_presentation_path"], 300))
      : "";
    const safePresentation =
      presentationUrl && isSafeHttpUrl(presentationUrl) ? presentationUrl : LOCAL_CONTENT.videoPresentation;

    return {
      projects: (safeProjects.length ? safeProjects : LOCAL_PROJECTS) as SiteContent["projects"],
      siteOffers: (sites.data?.length
        ? sites.data.map((r: { name: string; tagline: string; price_eur: string; is_star: boolean }) => ({
            name: cleanText(r.name, 80) || "Offre",
            tagline: cleanText(r.tagline, 120),
            price: cleanText(r.price_eur, 20) || "—",
            star: r.is_star || undefined,
          }))
        : LOCAL_SITES) as SiteContent["siteOffers"],
      videoPacks: (packs.data?.length
        ? packs.data.map((r: { name: string; tagline: string; price_eur: string; detail: string }) => ({
            name: cleanText(r.name, 80) || "Pack",
            tagline: cleanText(r.tagline, 120),
            price: cleanText(r.price_eur, 20) || "—",
            detail: cleanText(r.detail, 60),
          }))
        : LOCAL_PACKS) as SiteContent["videoPacks"],
      videos: safeVideos,
      faqs: ((faqs.data?.length
        ? faqs.data
            .map((r: { question: string; answer: string }) => ({
              q: cleanText(r.question, 200),
              a: cleanText(r.answer, 800),
            }))
            .filter((f: { q: string; a: string }) => f.q && f.a)
        : LOCAL_FAQS) as SiteContent["faqs"]),
      videoPresentation: safePresentation,
      videoPresentationFallback: LOCAL_PRESENTATION,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   Store partagé : UNE seule requête Supabase pour tout le site,
   même si 7 sections utilisent useSiteContent().
   Anti-saccade : les URLs vidéo déjà affichées ne changent JAMAIS
   pendant la visite (sinon la vidéo redémarrerait). Les nouvelles
   URLs sont mises en cache et utilisées à la visite suivante.
   Textes et prix, eux, se mettent à jour tout de suite.
   ------------------------------------------------------------ */
let current: SiteContent = readCache() ?? LOCAL_CONTENT;
let source: "cache" | "live" | "local" = readCache() ? "cache" : "local";
let started = false;
const listeners = new Set<() => void>();

function startRefresh() {
  if (started || !hasSupabase) return;
  started = true;
  const idle = (fn: () => void) =>
    "requestIdleCallback" in window
      ? (window as unknown as { requestIdleCallback: (f: () => void, o?: { timeout: number }) => void }).requestIdleCallback(fn, { timeout: 4000 })
      : setTimeout(fn, 2500);
  // Idle : on ne concurrence jamais le démarrage de la vidéo d'ouverture
  idle(async () => {
    const fresh = await fetchFromSupabase();
    if (!fresh) return;
    writeCache(fresh);
    current = { ...fresh, videos: current.videos, videoPresentation: current.videoPresentation };
    source = "live";
    listeners.forEach((l) => l());
  });
}

/* Hook : rend immédiatement (cache ou local), rafraîchit en fond. */
export function useSiteContent() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    startRefresh();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { content: current, source };
}

/** URLs vidéo réellement affichées (pour le préchargement). */
export function getVideoUrls(): string[] {
  return current.videos.map((v) => v.src);
}

/* Précharge les URLs vidéo dans le cache HTTP (sans lire).
   Appelé après le hero pour que la section Vidéos démarre net. */
export function prefetchVideos(urls: string[]) {
  if (!("requestIdleCallback" in window) && document.hidden) return;
  urls.slice(0, 4).forEach((u, i) => {
    setTimeout(() => {
      try {
        // Range 0-1 : ouvre la connexion + remplit le CDN edge,
        // sans télécharger toute la vidéo.
        fetch(u, { headers: { Range: "bytes=0-1" }, mode: "cors", credentials: "omit" }).catch(() => {});
      } catch {
        /* silencieux */
      }
    }, 3000 + i * 1200);
  });
}
