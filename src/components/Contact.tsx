import { useEffect, useRef, useState } from "react";
import { WA_DEFAULT, getMailto } from "../data";
import { logOrderIntent } from "../lib/order";
import { PlayMark } from "./Logo";
import { WhatsappIcon } from "./PlayerChrome";

const MESSAGE = "Bonjour, je veux un site pour mon business.";

/* Faux écran WhatsApp avec apparition message par message */
function FakeChat() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          // Séquence : msg1 → msg2 → msg3
          const t: ReturnType<typeof setTimeout>[] = [];
          t.push(setTimeout(() => setStep(1), 600));
          t.push(setTimeout(() => setStep(2), 1600));
          t.push(setTimeout(() => setStep(3), 2600));
          io.disconnect();
          return () => t.forEach(clearTimeout);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[400px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b141a] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
      role="img"
      aria-label="Aperçu d'une conversation WhatsApp avec VYZIO"
    >
      {/* En-tête */}
      <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
          <PlayMark size={26} />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-extrabold text-white">VYZIO</span>
          <span className="block text-[12px] text-[#25d366]">en ligne</span>
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aebac1" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.8.6a2 2 0 0 1 1.9 2Z" />
        </svg>
      </div>

      {/* Corps */}
      <div
        className="flex min-h-[300px] flex-col gap-2.5 p-4"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Msg 1 VYZIO */}
        <div className={`transition-all duration-500 ${step >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          {step >= 1 && (
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#1f2c34] px-3.5 py-2.5">
              <p className="text-[14px] leading-snug text-white">
                Salut 👋 Ici VYZIO. Un site, des vidéos, les deux ?
              </p>
              <p className="mt-1 text-right font-mono text-[10px] text-white/40">14:02</p>
            </div>
          )}
        </div>

        {/* Msg 2 client (pré-écrit) */}
        <div className={`flex justify-end transition-all duration-500 ${step >= 2 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          {step >= 2 && (
            <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#005c4b] px-3.5 py-2.5">
              <p className="text-[14px] leading-snug text-white">{MESSAGE}</p>
              <p className="mt-1 flex items-center justify-end gap-1 font-mono text-[10px] text-white/60">
                14:03
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true">
                  <path d="M11.5 1 5.5 7 3.5 5M15.5 1 9.5 7l-1-1" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
            </div>
          )}
        </div>

        {/* Msg 3 VYZIO */}
        <div className={`transition-all duration-500 ${step >= 3 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          {step >= 3 ? (
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#1f2c34] px-3.5 py-2.5">
              <p className="text-[14px] leading-snug text-white">
                Parfait. Touchez Envoyer, on s'occupe du reste.
              </p>
              <p className="mt-1 text-right font-mono text-[10px] text-white/40">14:03</p>
            </div>
          ) : step >= 2 ? (
            <div className="flex w-16 items-center gap-1 rounded-2xl bg-[#1f2c34] px-3 py-3" aria-hidden="true">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${d * 150}ms` }} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-1" />

        {/* Barre de saisie */}
        <div className="flex items-center gap-2">
          <div className="flex min-h-[48px] flex-1 items-center rounded-full bg-[#1f2c34] px-4">
            <p className="truncate text-[13px] text-white/70">{MESSAGE}</p>
          </div>
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener"
            aria-label="Envoyer sur WhatsApp"
            data-cursor="play"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-[#05060a] transition-transform hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.4 20.4 21.8 12 3.4 3.6l2.6 7.1 2.1 1.3 2.1 1.3-2.1 1.3-2.1 1.3-2.6 4.5Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/* 08 — Contact */
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#05060a] py-20 text-white sm:py-28">
      <div
        className="pointer-events-none absolute -right-24 top-10 hidden select-none font-display text-[22vw] font-extrabold leading-none text-white/[0.04] lg:block"
        aria-hidden="true"
      >
        GO
      </div>
      <div className="relative px-5 sm:px-10 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 data-reveal className="font-display text-[15vw] font-extrabold leading-[0.9] sm:text-[9vw] lg:text-[5.5vw]">
              À vous
              <br />
              de jouer.
            </h2>
            <p data-reveal className="mt-5 max-w-md text-[17px] leading-relaxed text-white/70">
              Un message suffit. On parle de votre business, on vous envoie un devis clair, et on crée.
            </p>
            <div data-reveal className="mt-8 flex flex-col gap-3 sm:max-w-md">
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener"
                data-cursor="play"
                onClick={() => logOrderIntent("Contact direct", "contact")}
                className="inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-[#3b6bff] px-8 text-[17px] font-extrabold text-white transition-transform hover:scale-[1.02]"
              >
                <WhatsappIcon size={22} />
                Écrire sur WhatsApp
              </a>
              <a
                href={getMailto()}
                data-cursor="play"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border-[1.5px] border-white/50 px-8 text-[17px] font-bold text-white transition-colors hover:bg-white/10"
              >
                Écrire un email
              </a>
            </div>
            <p data-reveal className="font-hand mt-5 rotate-[-2deg] text-[24px] text-white/70">
              réponse directe, sans jargon — promis
            </p>
          </div>
          <div data-reveal>
            <FakeChat />
          </div>
        </div>
      </div>
    </section>
  );
}
