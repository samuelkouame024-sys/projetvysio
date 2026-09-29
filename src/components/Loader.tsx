import { useEffect, useState } from "react";
import { PlayMark } from "./Logo";

/* Écran de chargement : compte à rebours 3-2-1, moins de 2 s */
export function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // 3 → 2 → 1 : 420 ms chacun ≈ 1,26 s
    timers.push(setTimeout(() => setCount(2), 420));
    timers.push(setTimeout(() => setCount(1), 840));
    timers.push(
      setTimeout(() => {
        setLeaving(true);
      }, 1280)
    );
    timers.push(
      setTimeout(() => {
        onDone();
      }, 1720)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05060a] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        leaving ? "-translate-y-full" : "translate-y-0"
      }`}
      role="status"
      aria-label="Chargement du film VYZIO"
    >
      {/* marques pellicule */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-4 py-3 opacity-30">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-2.5 w-4 rounded-[2px] bg-white/60" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-4 py-3 opacity-30">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-2.5 w-4 rounded-[2px] bg-white/60" />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <PlayMark size={40} />
        <span className="font-display text-3xl font-extrabold tracking-tight text-white">VYZIO</span>
      </div>

      {/* Compte à rebours façon amorce */}
      <div className="relative mt-8 flex h-36 w-36 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#3b6bff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="289"
            strokeDashoffset={count === 3 ? 193 : count === 2 ? 96 : 0}
            style={{ transition: "stroke-dashoffset 400ms cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <span key={count} className="font-display text-7xl font-extrabold text-white">
          {count}
        </span>
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
        Chargement du film
      </p>
    </div>
  );
}
