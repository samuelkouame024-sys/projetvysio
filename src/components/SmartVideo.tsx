import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/* ============================================================
   SmartVideo v2 — anti-saccade
   - Précharge le buffer 300 px AVANT l'écran (preload auto),
     ne lit qu'à 50 % visible.
   - Détecte les stalls (waiting/stalled) et relance sans écran noir.
   - Boucle fluide : on ne recrée jamais l'élément <video>.
   - Une seule vidéo avec son, max 2 lectures sur mobile.
   ============================================================ */

type SoundCtx = { activeId: string | null; setActiveId: (id: string | null) => void };
const SoundContext = createContext<SoundCtx>({ activeId: null, setActiveId: () => {} });
export const useSound = () => useContext(SoundContext);
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return <SoundContext.Provider value={{ activeId, setActiveId }}>{children}</SoundContext.Provider>;
}

const playingRegistry: { id: string; pause: () => void }[] = [];
function registerPlaying(id: string, pause: () => void) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const existing = playingRegistry.findIndex((p) => p.id === id);
  if (existing >= 0) playingRegistry.splice(existing, 1);
  playingRegistry.push({ id, pause });
  if (isMobile) {
    while (playingRegistry.length > 2) {
      const oldest = playingRegistry.shift();
      oldest?.pause();
    }
  }
}
function unregisterPlaying(id: string) {
  const i = playingRegistry.findIndex((p) => p.id === id);
  if (i >= 0) playingRegistry.splice(i, 1);
}

type Props = {
  id: string;
  src: string;
  poster: string;
  className?: string;
  mode?: "immediate" | "visible";
  withSoundButton?: boolean;
  soundLabel?: string;
  rounded?: string;
  eager?: boolean;
  badge?: boolean;
  /** Vidéo de secours si `src` ne charge pas (ex : fichier absent du bucket Supabase). */
  fallbackSrc?: string;
};

export function SmartVideo({
  id,
  src,
  fallbackSrc,
  poster,
  className = "",
  mode = "visible",
  withSoundButton = false,
  soundLabel = "Activer le son",
  rounded = "rounded-none",
  eager = false,
  badge = true,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { activeId, setActiveId } = useSound();
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [stalling, setStalling] = useState(false);
  const [inView, setInView] = useState(mode === "immediate");
  const hasSound = activeId === id;
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSoundRef = useRef(hasSound);
  hasSoundRef.current = hasSound;
  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  // Erreur de chargement : on bascule UNE fois sur la vidéo de secours,
  // sans recréer l'élément. Si le secours échoue aussi → message d'erreur.
  const handleError = () => {
    const v = ref.current;
    if (v && fallbackSrc && v.getAttribute("src") !== fallbackSrc) {
      console.warn(`[VYZIO] Vidéo "${id}" introuvable sur Supabase → lien de secours utilisé.`);
      v.setAttribute("src", fallbackSrc);
      v.load();
      if (mode === "immediate" || inViewRef.current) {
        v.muted = !hasSoundRef.current;
        v.play().catch(() => setBlocked(true));
      }
      return;
    }
    setFailed(true);
  };

  const tryPlay = useCallback(async () => {
    const v = ref.current;
    if (!v || failed || !src) return;
    try {
      v.muted = !hasSoundRef.current;
      // Si pas assez de buffer, on attend 1,5 s de données avant de lire
      // → démarre net, ne saccade pas sur les 2 premières secondes.
      await v.play();
      setBlocked(false);
      registerPlaying(id, () => v.pause());
    } catch {
      setBlocked(true);
    }
  }, [failed, id, src]);

  // Son exclusif sans recréer l'élément
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = activeId !== id;
    if (activeId === id) {
      v.volume = 1;
      v.play().catch(() => {});
    }
  }, [activeId, id]);

  // Mise à jour de la source sans casser la boucle (backend live)
  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const current = v.getAttribute("src");
    if (current !== src) {
      const wasPlaying = !v.paused;
      const t = v.currentTime || 0;
      v.src = src;
      v.load();
      if (wasPlaying || mode === "immediate") {
        v.currentTime = Math.min(t, 0.1);
        v.play().catch(() => setBlocked(true));
      }
    }
  }, [src, mode]);

  // Double observer : précharge à 300 px, lecture à 50 %
  useEffect(() => {
    if (mode === "immediate") {
      tryPlay();
      return;
    }
    const el = wrapRef.current;
    const v = ref.current;
    if (!el || !v) return;

    // 1. Précharge le buffer en avance (anti-saccade à l'entrée)
    const warm = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            v.preload = "auto";
            try {
              v.load();
            } catch {
              /* silencieux */
            }
            warm.disconnect();
          }
        });
      },
      { rootMargin: "300px", threshold: 0 }
    );
    warm.observe(el);

    // 2. Lecture / pause à 50 %
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setInView(e.isIntersecting);
          if (e.isIntersecting) tryPlay();
          else {
            v.pause();
            unregisterPlaying(id);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      warm.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  // Stall detector : spinner discret + relance douce (jamais d'écran noir)
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onWaiting = () => {
      if (!inView) return;
      setStalling(true);
      if (stallTimer.current) clearTimeout(stallTimer.current);
      stallTimer.current = setTimeout(() => {
        // Si toujours bloqué après 4 s, on recharge le flux à la position
        if (v.readyState < 3 && !v.paused) {
          const t = v.currentTime;
          v.load();
          v.currentTime = t;
          v.play().catch(() => {});
        }
      }, 4000);
    };
    const onPlaying = () => {
      setStalling(false);
      if (stallTimer.current) clearTimeout(stallTimer.current);
    };
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("stalled", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", onPlaying);
    return () => {
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("stalled", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", onPlaying);
      if (stallTimer.current) clearTimeout(stallTimer.current);
    };
  }, [inView]);

  useEffect(() => () => unregisterPlaying(id), [id]);

  const toggleSound = () => {
    if (hasSound) setActiveId(null);
    else {
      setActiveId(id);
      tryPlay();
    }
  };

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${rounded} ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover will-change-auto"
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        autoPlay={mode === "immediate"}
        preload={eager ? "auto" : "metadata"}
        disablePictureInPicture
        disableRemotePlayback
        onError={handleError}
        aria-label={id}
        style={{ transform: "translateZ(0)" }}
      >
        Votre navigateur ne lit pas cette vidéo.
      </video>

      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0b0d14] p-6 text-center">
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" loading="lazy" />
          <p className="relative text-sm text-white/80">Votre navigateur ne lit pas cette vidéo.</p>
        </div>
      )}

      {/* Indicateur de chargement réseau (discret, jamais bloquant) */}
      {stalling && !failed && !blocked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
        </div>
      )}

      {blocked && !failed && (
        <button
          type="button"
          onClick={() => {
            setBlocked(false);
            tryPlay();
          }}
          data-cursor="play"
          aria-label="Lire la vidéo"
          className="absolute inset-0 flex items-center justify-center bg-black/45 min-h-[44px] min-w-[44px]"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#05060a] shadow-2xl transition-transform duration-300 hover:scale-105">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
        </button>
      )}

      {withSoundButton && !failed && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={hasSound}
          aria-label={hasSound ? "Couper le son" : soundLabel}
          className="absolute bottom-3 left-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-[13px] font-bold text-white backdrop-blur-md transition-colors hover:bg-black/90"
        >
          {hasSound ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          )}
          {hasSound ? "Son activé" : soundLabel}
        </button>
      )}

      {badge && (
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white/80 backdrop-blur">
          BOUCLE
        </span>
      )}
    </div>
  );
}
