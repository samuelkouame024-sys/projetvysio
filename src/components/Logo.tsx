export function PlayMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vyzio-g" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d4ff" />
          <stop offset="0.5" stopColor="#3b6bff" />
          <stop offset="1" stopColor="#b53cff" />
        </linearGradient>
      </defs>
      {/* contour play épais */}
      <path
        d="M14 8.5c2.8-1.6 6.2-1.6 9 0l24.6 14.2c2.8 1.6 4.5 4.6 4.5 7.8v3c0 3.2-1.7 6.2-4.5 7.8L23 55.5c-2.8 1.6-6.2 1.6-9 0-2.8-1.6-4.5-4.6-4.5-7.8V16.3c0-3.2 1.7-6.2 4.5-7.8Z"
        stroke="url(#vyzio-g)"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      {/* triangle plein */}
      <path d="M27.5 24.2v15.6c0 1.4 1.5 2.2 2.7 1.5l12.6-7.8c1.1-.7 1.1-2.3 0-3L30.2 22.7c-1.2-.7-2.7.1-2.7 1.5Z" fill="url(#vyzio-g)" />
    </svg>
  );
}

export function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none" aria-label="VYZIO">
      <PlayMark size={compact ? 28 : 34} />
      <span
        className={`font-display font-extrabold tracking-tight leading-none ${
          compact ? "text-[22px]" : "text-[26px]"
        } ${dark ? "text-[#05060a]" : "text-white"}`}
        style={{ letterSpacing: "-0.03em" }}
      >
        VYZIO
      </span>
    </span>
  );
}
