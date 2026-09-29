import { CHAPTERS, WA_DEFAULT, getMailto } from "../data";
import { Logo } from "./Logo";

type Props = {
  progress: number; // 0..1
  active: string;
  onGo: (id: string) => void;
  onNext: () => void;
};

export function WhatsappIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.5-.6c.1-.2.1-.4 0-.5L9.4 8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.7-.2.5-.9 2.2-.9 2.2s-.1.2 0 .5c.3.6 2 3.3 4.9 4.5.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2 0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

export function MailIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/* Barre lecteur : logo discret en haut, navigation en bas.
   Le bandeau vidéo du haut (timecode + chapitre + REC) est masqué
   sur demande — on garde juste le logo. */
export function PlayerChrome({ progress, active, onGo, onNext }: Props) {
  return (
    <>
      {/* Haut : logo seul, discret */}
      <div className="pointer-events-none fixed left-0 top-0 z-[80] p-3 sm:p-5">
        <button
          type="button"
          onClick={() => onGo("ouverture")}
          className="pointer-events-auto flex min-h-[44px] items-center rounded-full bg-black/75 py-1.5 pl-2 pr-4 backdrop-blur-md"
          aria-label="VYZIO — retour à l'ouverture"
          data-cursor="play"
        >
          <Logo compact />
        </button>
      </div>

      {/* Bas : lecteur vidéo */}
      <div className="fixed inset-x-0 bottom-0 z-[80]">
        {/* progression fine */}
        <div className="relative h-[3px] w-full bg-white/15" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 bg-[#3b6bff]"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
            style={{ left: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
        <nav
          aria-label="Chapitres du site"
          className="flex items-center gap-1 border-t border-white/10 bg-black/90 px-2 py-1.5 backdrop-blur-xl sm:gap-2 sm:px-4"
          style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
        >
          {/* bouton lecture = chapitre suivant */}
          <button
            type="button"
            onClick={onNext}
            aria-label="Chapitre suivant"
            data-cursor="play"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </button>

          {/* chapitres défilants */}
          <div className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
            {CHAPTERS.map((c, i) => {
              const isActive = c.id === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onGo(c.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-colors sm:text-[13px] ${
                    isActive ? "bg-white/15 text-white" : "text-white/45 hover:text-white"
                  }`}
                >
                  <span className={`font-mono text-[10px] ${isActive ? "text-[#7ea0ff]" : "text-white/30"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.label}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#3b6bff]" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* accès directs toujours visibles */}
          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener"
              aria-label="Écrire sur WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366] text-[#05060a] transition-transform hover:scale-105 active:scale-95"
            >
              <WhatsappIcon />
            </a>
            <a
              href={getMailto()}
              aria-label="Écrire un email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
            >
              <MailIcon />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
