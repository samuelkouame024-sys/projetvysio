import { DOMAIN_PRICE, STEPS, waLink } from "../data";

/* 06 — Comment ça marche : vraie séquence numérotée */
export function Process() {
  return (
    <section id="process" className="relative bg-[#05060a] py-20 text-white sm:py-28" aria-label="Comment ça marche">
      <div className="px-5 sm:px-10 lg:px-16">
        <h2 data-reveal className="font-display max-w-4xl text-[12vw] font-extrabold leading-[0.92] sm:text-[7.5vw] lg:text-[4.8vw]">
          Comment ça se passe, vraiment.
        </h2>

        <ol className="mt-12">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              className={
                s.highlight
                  ? "relative -mx-5 bg-[#3b6bff] px-5 py-8 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16"
                  : "border-t border-white/15 py-7"
              }
            >
              <div className="flex items-start gap-5 sm:gap-8">
                <span
                  className={`font-display text-[40px] font-extrabold leading-none tabular-nums sm:text-[64px] ${
                    s.highlight ? "text-white" : "text-white/25"
                  }`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="max-w-2xl">
                  <h3 className="font-display text-[26px] font-extrabold leading-tight sm:text-[34px]">
                    {s.title}
                    {s.highlight && (
                      <span className="ml-3 inline-block -translate-y-1 rotate-[3deg] rounded-full bg-white px-3 py-1 align-middle font-mono text-[10px] font-bold uppercase tracking-widest text-[#3b6bff]">
                        Ça rassure
                      </span>
                    )}
                  </h3>
                  <p className={`mt-2 text-[16px] leading-relaxed sm:text-[18px] ${s.highlight ? "font-bold text-white" : "text-white/70"}`}>
                    {s.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {/* Étape facultative */}
          <li data-reveal className="mt-4 rounded-[20px] border-2 border-dashed border-white/30 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/70">
                Facultatif
              </span>
              <h3 className="font-display text-[24px] font-extrabold sm:text-[30px]">Nom de domaine</h3>
            </div>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/70">
              Une fois tout livré, dites-nous ce que vous souhaitez. On s'occupe du nom de domaine pour{" "}
              {DOMAIN_PRICE.price}.
            </p>
          </li>
        </ol>

        <div className="mt-10" data-reveal>
          <a
            href={waLink("Bonjour, je veux démarrer. Voici mon besoin : ")}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-8 text-[16px] font-extrabold text-[#05060a] transition-transform hover:scale-[1.02]"
          >
            Démarrer à l'étape 1
          </a>
        </div>
      </div>
    </section>
  );
}
