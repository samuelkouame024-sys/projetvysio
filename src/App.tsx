import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CHAPTERS } from "./data";
import { warmSupabase } from "./lib/supabase";
import { getVideoUrls, prefetchVideos } from "./lib/content";
import { SoundProvider } from "./components/SmartVideo";
import { Loader } from "./components/Loader";
import { Cursor } from "./components/Cursor";
import { PlayerChrome } from "./components/PlayerChrome";
import { Hero } from "./components/Hero";
import { Presentation } from "./components/Presentation";
import { Realisations } from "./components/Realisations";
import { VideosSection } from "./components/VideosSection";
import { Tarifs } from "./components/Tarifs";
import { Process } from "./components/Process";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { FloatingWA, Generique } from "./components/Generique";
import { ErrorBoundary } from "./components/ErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("ouverture");
  const [showFloating, setShowFloating] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const goNext = useCallback(() => {
    const idx = CHAPTERS.findIndex((c) => c.id === active);
    const next = CHAPTERS[Math.min(CHAPTERS.length - 1, idx + 1)];
    if (next) goTo(next.id);
  }, [active, goTo]);

  const replay = useCallback(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* Lenis + progression du film + chapitre actif */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: !reduced,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (loading) lenis.stop();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        setProgress(p);
        setShowFloating(window.scrollY > window.innerHeight * 0.7);

        // Chapitre actif : dernière section dont le haut a passé 40% de l'écran
        let current: string = CHAPTERS[0].id;
        for (const c of CHAPTERS) {
          const el = document.getElementById(c.id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= window.innerHeight * 0.4) current = c.id;
        }
        setActive(current);
      });
    };
    lenis.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Intercepte les ancres internes pour passer par Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      goTo(id);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Débloque le scroll à la fin du loader */
  useEffect(() => {
    if (!loading) lenisRef.current?.start();
  }, [loading]);

  /* Anti-saccade : pré-chauffe Supabase + CDN vidéo après l'ouverture */
  useEffect(() => {
    if (loading) return;
    warmSupabase();
    prefetchVideos(getVideoUrls());
  }, [loading]);

  /* Révélations ordonnées : même ease, mêmes durées partout */
  useEffect(() => {
    if (loading) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reduced) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      els.forEach((el) => {
        const kind = el.getAttribute("data-reveal") || "up";
        const from: gsap.TweenVars =
          kind === "left"
            ? { opacity: 0, x: -56 }
            : kind === "right"
              ? { opacity: 0, x: 56 }
              : kind === "zoom"
                ? { opacity: 0, scale: 0.96, y: 24 }
                : { opacity: 0, y: 36 };
        gsap.fromTo(el, from, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [loading]);

  return (
    <ErrorBoundary>
      <SoundProvider>
        <div className="grain min-h-screen bg-[#05060a]">
          {loading && (
            <Loader
              onDone={() => {
                setLoading(false);
                setReady(true);
              }}
            />
          )}
          <Cursor />
          <PlayerChrome progress={progress} active={active} onGo={goTo} onNext={goNext} />

          <main>
          <Hero ready={ready} />
          <Presentation />
          <Realisations />
          <VideosSection />
          <Tarifs />
            <Process />
            <Faq />
            <Contact />
            <Generique onReplay={replay} />
          </main>

          <FloatingWA visible={showFloating} />
        </div>
      </SoundProvider>
    </ErrorBoundary>
  );
}
