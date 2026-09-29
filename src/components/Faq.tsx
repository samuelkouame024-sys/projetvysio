import { useState } from "react";
import { waLink } from "../data";
import { useSiteContent } from "../lib/content";

/* FAQ France : accordéon, données live si Supabase */
export function Faq() {
  const [open, setOpen] = useState<number>(0);
  const { content } = useSiteContent();
  const faqs = content.faqs.length ? content.faqs : [];

  return (
    <section id="faq" className="relative bg-white py-20 text-[#05060a] sm:py-28" aria-label="Questions fréquentes">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <h2 className="font-display text-[13vw] font-extrabold leading-[0.92] sm:text-[7vw] lg:text-[3.8vw]">
              Les vraies questions.
            </h2>
            <p className="font-hand mt-4 rotate-[-2deg] text-[26px] text-[#3b6bff]">on répond franchement</p>
            <a
              href={waLink("Bonjour, j'ai une question : ")}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#05060a] px-7 text-[15px] font-extrabold text-white transition-transform hover:scale-[1.02]"
            >
              Poser la question sur WhatsApp
            </a>
          </div>

          <div className="lg:col-span-8" data-reveal>
            <div className="divide-y-[2px] divide-[#05060a]/12 border-y-[2px] border-[#05060a]/12">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="flex min-h-[64px] w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[12px] text-[#3b6bff]">0{i + 1}</span>
                        <span className="font-display text-[20px] font-extrabold leading-tight sm:text-[24px]">
                          {f.q}
                        </span>
                      </span>
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          isOpen ? "rotate-45 border-[#3b6bff] bg-[#3b6bff] text-white" : "border-[#05060a]/20"
                        }`}
                        aria-hidden="true"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <path d="M8 2v12M2 8h12" />
                        </svg>
                      </span>
                    </button>
                    <div className={`faq-panel ${isOpen ? "open" : ""}`}>
                      <div className="faq-inner">
                        <p className="max-w-2xl pb-6 pl-8 pr-2 text-[16px] leading-relaxed text-[#05060a]/75 sm:pl-10">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
