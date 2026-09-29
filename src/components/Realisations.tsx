import { useEffect, useRef, useState } from "react";
import { waLink, type Project } from "../data";
import { useSiteContent } from "../lib/content";

function PhoneSite({ project, index }: { project: Project; index: string }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="phone-notch relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[42px] border-[6px] border-[#232838] bg-[#0b0d14] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      <div className="relative h-[520px] w-full overflow-hidden bg-white sm:h-[560px]">
        {!loaded ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#101322] p-6 text-center">
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/20 border-t-white" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">Chargement du site…</p>
          </div>
        ) : (
          <iframe
            src={project.url}
            title={`${project.name} — aperçu du site`}
            loading="lazy"
            className="h-full w-full border-0 bg-white"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-center bg-[#05060a] py-2.5" aria-hidden="true">
        <span className="h-1 w-24 rounded-full bg-white/25" />
      </div>
      <span className="font-display pointer-events-none absolute bottom-8 left-4 text-[44px] font-extrabold text-white drop-shadow-lg">
        {index}
      </span>
    </div>
  );
}

/* Réalisations France : projets live depuis Supabase si configuré */
export function Realisations() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const floatRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const { content } = useSiteContent();
  const projects = content.projects.length ? content.projects : [];

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const section = sectionRef.current;
    const float = floatRef.current;
    if (!section || !float) return;
    let raf = 0;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      float.style.transform = `translate3d(${pos.x + 24}px, ${pos.y - 60}px, 0) rotate(3deg)`;
      raf = requestAnimationFrame(loop);
    };
    section.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      section.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="realisations" className="relative overflow-hidden bg-[#05060a] py-20 text-white sm:py-28">
      <div
        ref={floatRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-30 hidden transition-opacity duration-300 lg:block ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-64 rounded-2xl bg-white p-4 text-[#05060a] shadow-2xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#05060a]/50">Aperçu — cliquez pour ouvrir</p>
          <p className="font-display mt-1 text-[22px] font-extrabold leading-tight">{hovered?.name}</p>
          <p className="mt-1 text-[13px] font-bold text-[#3b6bff]">{hovered?.line}</p>
          <p className="mt-2 truncate font-mono text-[11px] text-[#05060a]/60">{hovered?.url.replace("https://", "")}</p>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="font-display max-w-3xl text-[12vw] font-extrabold leading-[0.92] sm:text-[7vw] lg:text-[4.6vw]">
            Des sites qui donnent envie d'écrire.
          </h2>
          <p data-reveal className="max-w-xs text-[15px] leading-relaxed text-white/60">
            Quatre vitrines en ligne. Faites défiler à l'intérieur des téléphones, puis ouvrez le vrai site.
          </p>
        </div>

        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:gap-8">
          {projects.map((p, i) => (
            <article
              key={p.name}
              data-reveal={i % 2 === 1 ? "right" : "left"}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-[28px] border border-white/10 bg-[#0b0d14] p-6 sm:p-8 ${
                i % 2 === 1 ? "lg:translate-y-16" : ""
              }`}
            >
              {i === 0 && (
                <span className="sticker font-hand absolute -top-4 right-6 z-20 rotate-[6deg] rounded-lg bg-white px-3 py-1 text-[20px] text-[#05060a]">
                  touchez, ça défile vraiment
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/70">
                  {p.tag}
                </span>
                <span className="font-mono text-[11px] text-white/40">0{i + 1} / 04</span>
              </div>

              <div className="mt-6" data-cursor="voir">
                <PhoneSite project={p} index={`0${i + 1}`} />
              </div>

              <h3 className="font-display mt-7 text-[30px] font-extrabold leading-tight sm:text-[34px]">{p.name}</h3>
              <p className="mt-1 text-[16px] font-bold text-white/85">{p.line}</p>
              <p className="mt-1 text-[14px] text-white/55">{p.note}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  data-cursor="voir"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-[15px] font-extrabold text-[#05060a] transition-transform hover:scale-[1.02]"
                >
                  Ouvrir le site
                </a>
                <a
                  href={waLink(`Bonjour, j'ai vu ${p.name} et je veux un site comme ça pour mon business.`)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border-[1.5px] border-white/40 px-6 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  Je veux le même
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center lg:mt-28" data-reveal>
          <p className="font-display text-[26px] font-extrabold sm:text-[34px]">Votre business, dans cette liste ?</p>
          <a
            href={waLink("Bonjour, je veux un site comme vos réalisations. On en parle ?")}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#3b6bff] px-8 text-[16px] font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            Demander le mien sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
