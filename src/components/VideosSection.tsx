import { POSTER_VERTICAL, waLink } from "../data";
import { useSiteContent } from "../lib/content";
import { SmartVideo } from "./SmartVideo";

/* Vidéos France : verticales, CDN, boucle, autoplay à 50 % */
export function VideosSection() {
  const { content } = useSiteContent();
  const videos = content.videos.length ? content.videos : [];
  const offsets = ["lg:translate-y-0", "lg:translate-y-14", "lg:translate-y-6", "lg:translate-y-20"];

  return (
    <section id="videos" className="relative overflow-hidden bg-[#3b6bff] py-20 text-white sm:py-28">
      <div className="px-5 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="font-display max-w-4xl text-[13vw] font-extrabold leading-[0.92] sm:text-[8vw] lg:text-[5vw]">
            Le pouce
            <br />
            s'arrête ici.
          </h2>
          <div data-reveal className="max-w-xs">
            <p className="text-[15px] font-bold leading-relaxed text-white/90">
              Des pubs courtes, pensées pour TikTok, Instagram et Facebook.
            </p>
            <p className="font-hand mt-2 rotate-[-2deg] text-[24px] text-white">le son est coupé — touchez pour écouter</p>
          </div>
        </div>
      </div>

      <div className="mt-10 px-5 sm:px-10 lg:px-16">
        <div className="snap-row flex gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-24">
          {videos.map((v, i) => (
            <figure
              key={v.id}
              data-reveal
              className={`w-[76vw] max-w-[300px] shrink-0 sm:w-[320px] lg:w-auto ${offsets[i % offsets.length]}`}
            >
              <div className="overflow-hidden rounded-[24px] border-[3px] border-white/90 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                <div data-cursor="play">
                  <SmartVideo
                    id={v.id}
                    src={v.src}
                    fallbackSrc={v.fallback}
                    poster={POSTER_VERTICAL}
                    mode="visible"
                    withSoundButton
                    className="aspect-[9/16] w-full"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-center justify-between px-1">
                <span>
                  <span className="block font-mono text-[11px] tracking-widest text-white/70">VIDÉO {v.num}</span>
                  <span className="font-display block text-[22px] font-extrabold leading-tight">« {v.caption} »</span>
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-white/60 font-mono text-[12px]" aria-hidden="true">
                  9:16
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-16" data-reveal>
        <div className="mx-auto max-w-3xl rounded-[18px] bg-white p-6 text-center text-[#05060a] sm:p-8">
          <p className="text-[16px] font-extrabold leading-snug sm:text-[19px]">
            Chaque formule à 11&nbsp;€ : 4 vidéos de 30 secondes ou 2 vidéos de 1 minute.
          </p>
          <a
            href={waLink("Bonjour, je veux la formule vidéo à 11 €. Je choisis : 4 vidéos de 30 secondes.")}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#05060a] px-8 text-[16px] font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            Commander mes vidéos
          </a>
        </div>
      </div>
    </section>
  );
}
