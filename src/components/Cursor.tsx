import { useEffect, useRef, useState } from "react";

type Mode = "default" | "voir" | "play" | "link";

/* Curseur signature : cercle → "Voir" sur projets, play sur vidéos/boutons. Tactile désactivé. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [enabled, setEnabled] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = (e.target as HTMLElement).closest?.("[data-cursor], a, button");
      if (!el) return setMode("default");
      const kind = (el as HTMLElement).getAttribute("data-cursor");
      if (kind === "voir") return setMode("voir");
      if (kind === "play") return setMode("play");
      if (el.tagName === "A" || el.tagName === "BUTTON") return setMode("link");
      setMode("default");
    };
    window.addEventListener("mousemove", move, { passive: true });

    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  const size = mode === "default" ? 22 : mode === "link" ? 44 : 84;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ width: size, height: size }}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: size,
          height: size,
          background:
            mode === "voir" ? "#3b6bff" : mode === "play" ? "#ffffff" : mode === "link" ? "rgba(255,255,255,0.16)" : "transparent",
          border: mode === "default" ? "1.5px solid rgba(255,255,255,0.9)" : mode === "link" ? "1.5px solid rgba(255,255,255,0.9)" : "none",
          mixBlendMode: mode === "default" || mode === "link" ? "difference" : "normal",
          boxShadow: mode === "voir" || mode === "play" ? "0 12px 40px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {mode === "voir" && (
          <span className="font-display text-[15px] font-bold uppercase tracking-wide text-white">Voir</span>
        )}
        {mode === "play" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#05060a" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        )}
        {mode === "default" && <span className="h-1 w-1 rounded-full bg-white" />}
      </div>
    </div>
  );
}
