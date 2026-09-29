import { WA_DEFAULT, WA_DISPLAY, getMailto } from "../data";
import { useSiteContent } from "../lib/content";
import { Logo } from "./Logo";
import { WhatsappIcon } from "./PlayerChrome";

/* Générique de fin façon cinéma + pied de page France */
export function Generique({ onReplay }: { onReplay: () => void }) {
  const { content } = useSiteContent();
  return (
    <section id="generique" className="relative bg-black text-white">
      <div className="relative h-[62vh] min-h-[420px] overflow-hidden" aria-label="Générique de fin">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black to-transparent" aria-hidden="true" />
        <div className="credits-track absolute inset-x-0 top-0 px-6 text-center">
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.4em] text-white/40">Fin du film</p>
          <div className="mx-auto mt-10 max-w-md space-y-10 pb-[30vh]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">Réalisation</p>
              <p className="font-display mt-2 text-[44px] font-extrabold">VYZIO</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">Direction</p>
              <p className="font-display mt-2 text-[34px] font-extrabold">Samuel</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">Avec</p>
              <ul className="mt-3 space-y-2">
                {content.projects.map((p) => (
                  <li key={p.name} className="font-display text-[26px] font-bold text-white/90">
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-hand text-[34px] leading-tight text-white">
                Créer. Développer.
                <br />
                Faire grandir.
              </p>
            </div>
            <p className="font-display pt-6 text-[80px] font-extrabold tracking-tight">FIN</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-14 text-center sm:px-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="font-hand mt-4 rotate-[-1.5deg] text-[30px] text-white/85">Créer. Développer. Faire grandir.</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReplay}
            data-cursor="play"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[16px] font-extrabold text-[#05060a] transition-transform hover:scale-[1.02]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
            Revoir depuis le début
          </button>
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#3b6bff] px-8 text-[16px] font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            <WhatsappIcon size={20} />
            Écrire sur WhatsApp
          </a>
        </div>
      </div>

      <footer className="border-t border-white/10 px-5 pb-32 pt-8 sm:px-10 lg:px-16" aria-label="Pied de page">
        <div className="flex flex-col gap-5 text-[14px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[18px] font-bold text-white">Créer. Développer. Faire grandir.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={WA_DEFAULT} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center font-bold text-white hover:underline">
              WhatsApp {WA_DISPLAY}
            </a>
            <a href={getMailto()} className="inline-flex min-h-[44px] items-center hover:text-white hover:underline">
              Email
            </a>
            <span>France</span>
          </div>
        </div>
        <p className="mt-4 font-mono text-[11px] text-white/35">© 2026 VYZIO — Paris. Tous droits réservés.</p>
      </footer>
    </section>
  );
}

export function FloatingWA({ visible }: { visible: boolean }) {
  return (
    <a
      href={WA_DEFAULT}
      target="_blank"
      rel="noopener"
      aria-label="Écrire sur WhatsApp"
      className={`fixed bottom-24 right-4 z-[75] flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-[#05060a] shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105 sm:bottom-24 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsappIcon size={24} />
    </a>
  );
}
