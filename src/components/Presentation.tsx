import { PHOTOS, POSTER_PRESENTATION, waLink } from "../data";
import { useSiteContent } from "../lib/content";
import { SmartVideo, useSound } from "./SmartVideo";
import { PlayMark } from "./Logo";

const RECEIVE = [
  {
    n: "01",
    title: "Un site qui vend pour vous",
    text: "Rapide sur téléphone, offres claires, clients envoyés directement sur WhatsApp.",
  },
  {
    n: "02",
    title: "Des vidéos qui arrêtent le pouce",
    text: "Pubs courtes pour TikTok, Instagram et Facebook, en UGC ou motion design.",
  },
  {
    n: "03",
    title: "Un référencement de base déjà en place",
    text: "Site construit proprement pour Google. Les résultats demandent du temps, et on le dit franchement.",
  },
  {
    n: "04",
    title: "Un nom de domaine à vous, si vous le souhaitez",
    text: "Une fois votre site livré, vous nous dites si vous en voulez un, et on s'en occupe pour 23 €.",
  },
];

const DOUBTS = [
  {
    q: "C'est trop cher pour moi ?",
    a: "Une landing page commence à 38 € et vos vidéos à 11 € : 4 vidéos de 30 secondes ou 2 vidéos de 1 minute.",
  },
  { q: "Je ne sais pas ce que je veux ?", a: "On part de votre besoin et on vous propose." },
  { q: "Je n'y connais rien en technique ?", a: "Vous n'avez rien à installer, on s'occupe de tout." },
];

function PresentationReader({ src, fallbackSrc }: { src: string; fallbackSrc?: string }) {
  const { activeId, setActiveId } = useSound();
  const sounding = activeId === "presentation-reader";
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[22px] border-[3px] border-[#05060a] bg-black shadow-[8px_8px_0_#05060a]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#101322] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-2 truncate font-mono text-[11px] text-white/60">VYZIO_presentation.mp4 — boucle</span>
        </div>
        <SmartVideo
          id="presentation-reader"
          src={src}
          fallbackSrc={fallbackSrc}
          poster={POSTER_PRESENTATION}
          mode="visible"
          withSoundButton
          className="aspect-video w-full"
        />
        {!sounding && (
          <button
            type="button"
            onClick={() => setActiveId("presentation-reader")}
            data-cursor="play"
            aria-label="Lire la présentation avec le son"
            className="group absolute inset-0 flex items-center justify-center"
          >
            <span className="absolute h-24 w-24 animate-ping rounded-full bg-white/20" aria-hidden="true" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <PlayMark size={52} />
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#05060a]/50">
        La présentation tourne en boucle — touchez le logo pour le son
      </p>
    </div>
  );
}

/* Présentation France : page de vente, fond clair */
export function Presentation() {
  const { content } = useSiteContent();
  return (
    <section id="presentation" className="relative bg-[#f4f6fb] text-[#05060a]">
      <div className="px-5 pb-4 pt-20 sm:px-10 sm:pt-28 lg:px-16">
        <h2 data-reveal className="font-display max-w-5xl text-[13vw] font-extrabold leading-[0.92] sm:text-[8vw] lg:text-[5.6vw]">
          Vous vendez bien.
          <br />
          <span className="ml-[8vw] inline-block">Mais personne</span>
          <br />
          ne le voit.
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal="left">
            <p className="max-w-md text-[17px] leading-relaxed text-[#05060a]/85">
              Vos produits sont bons. Votre service est sérieux. Pourtant, votre vitrine, c'est une photo
              floue sur WhatsApp et un statut que personne ne regarde jusqu'au bout. Pendant ce temps, le
              concurrent d'à côté a un vrai site et une vidéo qui tourne sur TikTok.{" "}
              <strong className="text-[#05060a]">
                Il n'est pas meilleur que vous : il est simplement plus visible.
              </strong>
            </p>
            <p className="font-hand mt-4 rotate-[-3deg] text-[26px] text-[#3b6bff]">
              ça vous parle, non ?
            </p>
          </div>

          <figure className="relative lg:col-span-4" data-reveal="right">
            <div className="rotate-[1.5deg] overflow-hidden rounded-[18px] border-[3px] border-[#05060a] bg-white p-2 shadow-[6px_6px_0_#05060a]">
              <img
                src={PHOTOS.marche}
                alt="Rue commerçante à Paris, la concurrence est visible partout"
                className="aspect-[4/3] w-full rounded-[12px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="flex items-center justify-between px-2 py-2">
                <span className="font-mono text-[11px] text-[#05060a]/60">paris — la concurrence</span>
                <span className="font-hand text-[20px] leading-none text-[#05060a]">eux, on les voit…</span>
              </figcaption>
            </div>
            <span className="sticker font-display absolute -right-2 -top-4 rotate-[8deg] rounded-full bg-[#3b6bff] px-4 py-2 text-[13px] font-extrabold uppercase tracking-wide text-white">
              100 % France
            </span>
          </figure>

          <div className="flex flex-col justify-end lg:col-span-3" data-reveal>
            <p className="font-display text-[88px] font-extrabold leading-none text-[#05060a]/10">02</p>
            <p className="mt-2 max-w-[220px] text-[15px] font-bold leading-snug">
              Un seul problème à régler : <span className="hand-underline">être vu avant les autres.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 overflow-hidden bg-[#3b6bff] py-10 text-white sm:py-14">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap pr-8" aria-hidden="true">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="font-display text-[26px] font-extrabold uppercase sm:text-[34px]">
              Sites web — Vidéos IA — UGC — Motion design — WhatsApp direct — Sites web — Vidéos IA — UGC — Motion design —
            </span>
          ))}
        </div>
        <p data-reveal className="mx-auto mt-8 max-w-4xl px-5 text-center text-[20px] font-bold leading-snug sm:text-[28px]">
          VYZIO, c'est le studio qui règle ça. On crée votre site web et vos vidéos publicitaires avec l'IA
          et un vrai montage, pour que votre business ait enfin l'image qu'il mérite.
        </p>
      </div>

      <div className="grid gap-12 px-5 py-14 sm:px-10 lg:grid-cols-2 lg:gap-10 lg:px-16 lg:py-20">
        <div data-reveal>
          <PresentationReader src={content.videoPresentation} fallbackSrc={content.videoPresentationFallback} />
          <figure className="mt-8 hidden items-center gap-4 lg:flex">
            <img
              src={PHOTOS.boutique}
              alt="Boutique parisienne au coucher du soleil"
              className="h-24 w-24 rounded-2xl border-2 border-[#05060a] object-cover"
              loading="lazy"
              decoding="async"
            />
            <p className="font-hand rotate-[-2deg] text-[24px] leading-tight text-[#05060a]/80">
              vos clients commandent
              <br />
              depuis leur téléphone
            </p>
          </figure>
        </div>

        <div>
          <h3 data-reveal className="font-display text-[34px] font-extrabold sm:text-[44px]">
            Ce que vous recevez
          </h3>
          <ul className="mt-6 divide-y-[2px] divide-[#05060a]/12 border-y-[2px] border-[#05060a]/12">
            {RECEIVE.map((r) => (
              <li key={r.n} data-reveal className="grid grid-cols-[52px_1fr] gap-3 py-5 sm:grid-cols-[72px_1fr]">
                <span className="font-display text-[26px] font-extrabold text-[#3b6bff] sm:text-[32px]">{r.n}</span>
                <span>
                  <strong className="block text-[17px] font-extrabold leading-snug sm:text-[19px]">{r.title} :</strong>
                  <span className="mt-1 block text-[15px] leading-relaxed text-[#05060a]/75">{r.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t-[3px] border-[#05060a] px-5 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal>
            <h3 className="font-display text-[30px] font-extrabold sm:text-[38px]">Comment ça se passe</h3>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#05060a]/85">
              Vous écrivez sur WhatsApp. On parle de votre business. On vous envoie un devis clair. On crée
              votre site et on vous le montre d'abord. S'il vous plaît, on vous envoie le lien de paiement,
              puis vos vidéos dès que c'est réglé. <strong>Pas de réunion interminable, pas de jargon.</strong>
            </p>
            <h3 className="font-display mt-10 text-[30px] font-extrabold sm:text-[38px]">Pour qui</h3>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#05060a]/85">
              Restaurants, boutiques, agences immobilières, coiffeurs, créateurs, prestataires, jeunes
              marques : tous ceux qui veulent qu'on les remarque à Paris et partout en France.
            </p>
          </div>
          <div className="lg:col-span-5" data-reveal>
            <div className="rounded-[20px] bg-[#05060a] p-7 text-white sm:p-9">
              <p className="font-display text-[30px] font-extrabold leading-tight">Pourquoi nous</p>
              <p className="mt-4 text-[16px] leading-relaxed text-white/85">
                On travaille comme vous parlez : directement. Des prix affichés dès{" "}
                <strong className="text-white">11 €</strong>, des offres d'entrée accessibles
                pour démarrer sans risque, et des projets plus ambitieux quand vous êtes prêt à grandir.
              </p>
              <p className="font-display mt-6 text-[52px] font-extrabold leading-none">11&nbsp;€</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/50">pour démarrer — vidéos</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3" data-reveal>
          {DOUBTS.map((d) => (
            <div key={d.q} className="rounded-[16px] border-2 border-[#05060a]/15 bg-white p-5">
              <p className="font-display text-[19px] font-extrabold">{d.q}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#05060a]/75">{d.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center" data-reveal>
          <p className="font-display mx-auto max-w-2xl text-[26px] font-extrabold leading-tight sm:text-[32px]">
            Un projet ? On en parle directement.
          </p>
          <a
            href={waLink("Bonjour, je veux parler de mon projet.")}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#3b6bff] px-8 text-[16px] font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            Parler de mon projet
          </a>
        </div>
      </div>

      <div className="overflow-hidden bg-[#05060a] py-14 sm:py-20">
        <p data-reveal className="font-display px-5 text-center text-[11vw] font-extrabold leading-[0.95] text-white sm:text-[7vw]">
          Assez parlé.
          <br />
          <span className="text-white/90">Regardez ce qu'on a fait.</span>
        </p>
      </div>
    </section>
  );
}
