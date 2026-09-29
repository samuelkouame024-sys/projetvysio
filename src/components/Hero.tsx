import { useEffect, useRef } from "react";
import gsap from "gsap";
import { POSTER_PRESENTATION, WA_DEFAULT } from "../data";
import { useSiteContent } from "../lib/content";
import { SmartVideo } from "./SmartVideo";

const WORDS = ["Votre", "business", "mérite", "d'être", "vu."];

/* Ouverture France : plein écran, vidéo CDN en fond */
export function Hero({ ready }: { ready: boolean }) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const { content } = useSiteContent();

  useEffect(() => {
    if (!ready || !titleRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = titleRef.current.querySelectorAll(".reveal-line");
    if (reduced) {
      gsap.set(lines, { yPercent: 0, opacity: 1 });
      gsap.set(".hero-fade", { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      lines,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.09, delay: 0.1 }
    );
    gsap.fromTo(
      ".hero-fade",
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, delay: 0.55 }
    );
  }, [ready]);

  return (
    <header id="ouverture" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#05060a]">
      <div className="absolute inset-0" aria-hidden="true">
        <SmartVideo
          id="hero-bg"
          src={content.videoPresentation}
          fallbackSrc={content.videoPresentationFallback}
          poster={POSTER_PRESENTATION}
          mode="immediate"
          eager
          badge={false}
          className="h-full w-full"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/55 to-[#05060a]/35" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_55%,rgba(5,6,10,0.5)_100%)]" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-28 pt-24 sm:px-10 sm:pb-32 lg:px-16">
        <p className="hero-fade mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 opacity-0">
          <span className="inline-block h-px w-10 bg-white/50" aria-hidden="true" />
          Studio Vyzio — Paris · Sites & vidéos IA
        </p>

        <h1
          ref={titleRef}
          className="font-display max-w-6xl text-[15vw] font-extrabold leading-[0.95] text-white sm:text-[10vw] lg:text-[7.5vw]"
        >
          {WORDS.map((w, i) => (
            <span key={i} className="reveal-mask pb-[0.08em] pr-[0.18em]">
              <span className="reveal-line">{w}</span>
            </span>
          ))}
        </h1>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="hero-fade inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#3b6bff] px-8 text-[16px] font-extrabold text-white opacity-0 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Écrire sur WhatsApp
          </a>
          <a
            href="#realisations"
            data-nav="realisations"
            data-cursor="play"
            className="hero-fade inline-flex min-h-[52px] items-center justify-center rounded-full border-[1.5px] border-white/60 px-8 text-[16px] font-bold text-white opacity-0 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Voir les réalisations
          </a>
        </div>

        <div className="hero-fade mt-8 flex items-center gap-4 text-white/60 opacity-0">
          <span className="relative flex h-9 w-[22px] justify-center rounded-full border border-white/40">
            <span className="mt-1.5 h-2 w-1 animate-bounce rounded-full bg-white/80" aria-hidden="true" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em]">Scroll pour lire le film</p>
        </div>
      </div>
    </header>
  );
}
