import { useEffect, useState } from "react";
import { SUPABASE_URL, configStatus, getSupabase, hasSupabase } from "../lib/supabase";

/* ============================================================
   Page de diagnostic : ouvrez https://votre-site/?diagnostic
   Vérifie la configuration Supabase SANS rien modifier.
   N'affiche aucun secret (la clé publishable est publique par nature,
   et seul son début est montré).
   ============================================================ */

type State = "wait" | "ok" | "ko" | "info";
type Check = { label: string; state: State; detail: string; fix?: string };

const VIDEO_FILES = ["presentation.mp4", "video-1.mp4", "video-2.mp4", "video-3.mp4", "video-4.mp4"];

function urlCheck(): Check {
  const s = configStatus.urlStatus;
  if (s === "ok") return { label: "Variable VITE_SUPABASE_URL", state: "ok", detail: SUPABASE_URL || "" };
  if (s === "absente")
    return {
      label: "Variable VITE_SUPABASE_URL",
      state: "ko",
      detail: "Absente du site en ligne.",
      fix: "Vercel → Settings → Environment Variables : ajoutez VITE_SUPABASE_URL (nom exact, avec VITE_ devant), puis Deployments → … → Redeploy.",
    };
  if (s === "mauvaise-adresse")
    return {
      label: "Variable VITE_SUPABASE_URL",
      state: "ko",
      detail: `Mauvaise adresse : « ${configStatus.urlValue} »`,
      fix: "Ce n'est pas l'adresse du Dashboard qu'il faut. Supabase → Project Settings → Data API → copiez « Project URL » (elle se termine par .supabase.co).",
    };
  return {
    label: "Variable VITE_SUPABASE_URL",
    state: "ko",
    detail: `Valeur invalide : « ${configStatus.urlValue} »`,
    fix: "La valeur doit ressembler à https://abcdefgh.supabase.co (avec https://).",
  };
}

function keyCheck(): Check {
  const s = configStatus.keyStatus;
  const label = "Clé Supabase";
  if (s === "publishable")
    return { label, state: "ok", detail: `Clé publishable (${configStatus.keyPreview}) via ${configStatus.usedVariable}` };
  if (s === "anon")
    return { label, state: "ok", detail: `Ancienne clé « anon » (${configStatus.keyPreview}) via ${configStatus.usedVariable}` };
  if (s === "absente")
    return {
      label,
      state: "ko",
      detail: "Absente du site en ligne.",
      fix: "Vercel → Settings → Environment Variables : ajoutez VITE_SUPABASE_PUBLISHABLE_KEY (valeur sb_publishable_...), puis Redeploy.",
    };
  if (s === "secrete-refusee")
    return {
      label,
      state: "ko",
      detail: "DANGER : vous avez mis la clé SECRÈTE (sb_secret_...). Le site la refuse.",
      fix: "1) Supprimez-la de Vercel tout de suite. 2) Supabase → API Keys : révoquez cette clé secrète et créez-en une nouvelle. 3) Mettez à la place la « Publishable key » (sb_publishable_...). 4) Redeploy.",
    };
  return {
    label,
    state: "ko",
    detail: `Format non reconnu (${configStatus.keyPreview}).`,
    fix: "Supabase → Project Settings → API Keys → copiez la « Publishable key » (commence par sb_publishable_).",
  };
}

export function Diagnostic() {
  const [db, setDb] = useState<Check>({ label: "Base de données (tables)", state: "wait", detail: "Test en cours…" });
  const [videos, setVideos] = useState<Check[]>(
    VIDEO_FILES.map((f) => ({ label: `Vidéo ${f}`, state: "wait" as State, detail: "Test en cours…" }))
  );

  useEffect(() => {
    if (!hasSupabase) {
      setDb({ label: "Base de données (tables)", state: "info", detail: "Non testée : corrigez d'abord les variables ci-dessus." });
      setVideos(
        VIDEO_FILES.map((f) => ({
          label: `Vidéo ${f}`,
          state: "info" as State,
          detail: "Non testée. En attendant, le site utilise vos vidéos d'origine.",
        }))
      );
      return;
    }

    // 1. Base de données
    (async () => {
      // Délai max 8 s : sinon un projet injoignable laisserait le test « en cours » à l'infini
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      try {
        const sb = getSupabase();
        const { count, error, status } = await sb!
          .from("site_offers")
          .select("name", { count: "exact", head: true })
          .abortSignal(ctrl.signal);
        clearTimeout(timer);
        if (ctrl.signal.aborted) throw new Error("timeout");
        if (error || (status && status >= 400)) {
          const msg = `${error?.message || ""} ${error?.code || ""}`.toLowerCase();
          if (status === 401 || status === 403 || msg.includes("api key") || msg.includes("jwt"))
            setDb({
              label: "Base de données (tables)",
              state: "ko",
              detail: "Clé refusée par Supabase.",
              fix: "La clé ne correspond pas à ce projet. Recopiez la Publishable key du MÊME projet que l'URL, puis Redeploy.",
            });
          else if (status === 404 || msg.includes("pgrst205") || msg.includes("42p01") || msg.includes("could not find") || msg.includes("does not exist"))
            setDb({
              label: "Base de données (tables)",
              state: "ko",
              detail: "Les tables n'existent pas.",
              fix: "Supabase → SQL Editor → New query → collez tout le fichier supabase/schema.sql → Run.",
            });
          else
            setDb({
              label: "Base de données (tables)",
              state: "ko",
              detail: `Erreur : ${error?.message || `HTTP ${status}`}`,
              fix: "Vérifiez que le projet Supabase n'est pas en pause (Dashboard → Restore project).",
            });
          return;
        }
        setDb({
          label: "Base de données (tables)",
          state: count && count > 0 ? "ok" : "ko",
          detail: count && count > 0 ? `Connectée : ${count} offres de site trouvées.` : "Connectée, mais la table des offres est vide.",
          fix: count && count > 0 ? undefined : "Relancez supabase/schema.sql dans le SQL Editor (il remplit les tables).",
        });
      } catch {
        clearTimeout(timer);
        setDb({
          label: "Base de données (tables)",
          state: "ko",
          detail: "Impossible de joindre Supabase (pas de réponse).",
          fix: "Vérifiez l'URL, votre connexion, et que le projet n'est pas en pause (Dashboard → Restore project).",
        });
      }
    })();

    // 2. Vidéos dans le bucket
    VIDEO_FILES.forEach(async (file, i) => {
      const url = `${SUPABASE_URL}/storage/v1/object/public/videos/${file}`;
      let check: Check;
      try {
        const vctrl = new AbortController();
        const vtimer = setTimeout(() => vctrl.abort(), 8000);
        const res = await fetch(url, {
          headers: { Range: "bytes=0-0" },
          credentials: "omit",
          cache: "no-store",
          signal: vctrl.signal,
        }).finally(() => clearTimeout(vtimer));
        const size = res.headers.get("content-range")?.split("/")[1];
        const mo = size ? ` (${(Number(size) / 1048576).toFixed(1)} Mo)` : "";
        if (res.ok) {
          const heavy = size && Number(size) > 15 * 1048576;
          check = {
            label: `Vidéo ${file}`,
            state: "ok",
            detail: `Trouvée${mo}${heavy ? " : un peu lourde, pensez à la compresser" : ""}.`,
          };
        } else {
          check = {
            label: `Vidéo ${file}`,
            state: "ko",
            detail: "Introuvable dans le bucket « videos ». Le site utilise le lien d'origine en secours.",
            fix: `Supabase → Storage → bucket « videos » → Upload : envoyez le fichier nommé exactement « ${file} » (minuscules, sans espace).`,
          };
        }
      } catch {
        check = {
          label: `Vidéo ${file}`,
          state: "ko",
          detail: "Test impossible (réseau).",
          fix: "Réessayez. Si ça persiste, vérifiez que le bucket « videos » existe (il est créé par schema.sql).",
        };
      }
      setVideos((prev) => prev.map((c, j) => (j === i ? check : c)));
    });
  }, []);

  const checks: Check[] = [
    urlCheck(),
    keyCheck(),
    db,
    ...videos,
    {
      label: "Adresse de ce site",
      state: "info",
      detail: window.location.origin,
      fix: "Si vous avez déployé la fonction de statistiques : mettez exactement cette adresse dans le secret ALLOWED_ORIGINS (Supabase → Edge Functions → Secrets).",
    },
  ];

  const allOk = checks.every((c) => c.state === "ok" || c.state === "info");
  const waiting = checks.some((c) => c.state === "wait");

  const badge: Record<State, string> = { ok: "✅", ko: "❌", wait: "⏳", info: "ℹ️" };

  return (
    <main className="min-h-screen bg-[#f4f6fb] px-5 py-10 text-[#05060a]">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#05060a]/50">VYZIO · diagnostic</p>
        <h1 className="font-display mt-2 text-[40px] font-extrabold leading-none">Vérification du site</h1>
        <p className="mt-3 text-[15px] text-[#05060a]/70">
          Cette page teste la connexion à Supabase. Elle ne modifie rien et n'affiche aucun secret.
        </p>

        <div
          className={`mt-6 rounded-2xl p-4 text-[15px] font-bold ${
            waiting ? "bg-white" : allOk ? "bg-[#25d366]/20" : "bg-[#ff5f57]/15"
          }`}
        >
          {waiting
            ? "⏳ Tests en cours…"
            : allOk
              ? "✅ Tout est bon. Le site utilise Supabase."
              : "❌ Quelque chose est à corriger : suivez les instructions « À faire » ci-dessous, dans l'ordre."}
        </div>

        <ul className="mt-6 space-y-3">
          {checks.map((c) => (
            <li key={c.label} className="rounded-2xl border-2 border-[#05060a]/10 bg-white p-4">
              <p className="text-[16px] font-extrabold">
                {badge[c.state]} {c.label}
              </p>
              <p className="mt-1 break-all text-[14px] text-[#05060a]/75">{c.detail}</p>
              {c.fix && (c.state === "ko" || c.state === "info") && (
                <p className="mt-2 rounded-xl bg-[#3b6bff]/10 p-3 text-[14px] leading-relaxed">
                  <strong>À faire :</strong> {c.fix}
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[13px] text-[#05060a]/60">
          Rappel : après chaque modification d'une variable dans Vercel, il faut <strong>redéployer</strong>
          {" "}(Deployments → … → Redeploy). Les variables sont intégrées au moment de la construction du site.
        </p>

        <a
          href="/"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#05060a] px-6 text-[15px] font-extrabold text-white"
        >
          Retour au site
        </a>
      </div>
    </main>
  );
}
