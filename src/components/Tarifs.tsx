import { useState } from "react";
import {
  DOMAIN_PRICE,
  FORMAT_LABEL,
  siteOrderMessage,
  videoOrderMessage,
  waLink,
  type SiteOffer,
  type VideoFormat,
  type VideoPack,
} from "../data";
import { useSiteContent } from "../lib/content";
import { logOrderIntent } from "../lib/order";

function SiteRow({ offer }: { offer: SiteOffer }) {
  return (
    <li className="relative flex items-start gap-3 py-4">
      {offer.star && (
        <span className="sticker font-display absolute -top-2 right-0 rotate-[4deg] rounded-full bg-[#3b6bff] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
          Le plus choisi
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[16px] font-extrabold leading-tight sm:text-[17px]">
          {offer.name} <span className="font-normal text-[#05060a]/55">— « {offer.tagline} »</span>
        </p>
        <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums">{offer.price}</p>
      </div>
      <span className="dot-leader mt-4" aria-hidden="true" />
      <a
        href={waLink(siteOrderMessage(offer))}
        target="_blank"
        rel="noopener"
        aria-label={`Commander ${offer.name}`}
        onClick={() => logOrderIntent(offer.name, "site")}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#05060a] px-5 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.03]"
      >
        Commander
      </a>
    </li>
  );
}

function VideoRow({
  pack,
  format,
  setFormat,
}: {
  pack: VideoPack;
  format: VideoFormat;
  setFormat: (f: VideoFormat) => void;
}) {
  const isTest = pack.name === "Formule Test";
  return (
    <li className="py-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0">
          <p className="text-[16px] font-extrabold leading-tight sm:text-[17px]">
            {pack.name} <span className="font-normal text-[#05060a]/55">— « {pack.tagline} »</span>
          </p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-[#05060a]/50">{pack.detail}</p>
          <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums">{pack.price}</p>
        </div>
        <span className="dot-leader mt-4" aria-hidden="true" />
        <a
          href={waLink(videoOrderMessage(pack, format))}
          target="_blank"
          rel="noopener"
          aria-label={`Commander ${pack.name}`}
          onClick={() => logOrderIntent(pack.name, "video")}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#3b6bff] px-5 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.03]"
        >
          Commander
        </a>
      </div>
      {isTest ? (
        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Choisir le format de la formule Test">
          {(["4x30", "2x60"] as VideoFormat[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              aria-pressed={format === f}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 px-3 text-[13px] font-extrabold transition-colors ${
                format === f
                  ? "border-[#3b6bff] bg-[#3b6bff]/10 text-[#05060a]"
                  : "border-[#05060a]/15 text-[#05060a]/60 hover:border-[#05060a]/30"
              }`}
            >
              {FORMAT_LABEL[f]}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 font-mono text-[11px] text-[#05060a]/50">
          Format : {FORMAT_LABEL[format]} <span className="text-[#05060a]/35">(modifiable sur WhatsApp)</span>
        </p>
      )}
    </li>
  );
}

/* Tarifs France : ticket de caisse, prix en euros.
   Données live depuis Supabase si configuré, sinon locales. */
export function Tarifs() {
  const [format, setFormat] = useState<VideoFormat>("4x30");
  const { content } = useSiteContent();
  const sites = content.siteOffers.length ? content.siteOffers : [];
  const packs = content.videoPacks.length ? content.videoPacks : [];

  return (
    <section id="tarifs" className="relative bg-[#f4f6fb] py-20 text-[#05060a] sm:py-28">
      <div className="px-5 sm:px-10 lg:px-16">
        <h2 data-reveal className="font-display text-[16vw] font-extrabold leading-[0.9] sm:text-[10vw] lg:text-[6vw]">
          La carte.
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-4" data-reveal>
          <p className="text-[16px] font-bold text-[#05060a]/70">Prix affichés. Pas de surprise.</p>
          <span className="font-hand rotate-[-3deg] text-[24px] text-[#3b6bff]">on vous montre d'abord, vous payez après</span>
        </div>

        <div data-reveal="zoom" className="mx-auto mt-10 max-w-4xl">
          <div className="zigzag-bottom rounded-t-[20px] border-[3px] border-b-0 border-[#05060a] bg-white px-5 pb-12 pt-7 sm:px-10">
            <div className="border-b-[2px] border-dashed border-[#05060a]/20 pb-5 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#05060a]/50">Vyzio — Paris</p>
              <p className="font-display mt-1 text-[26px] font-extrabold">Ticket n°001</p>
              <p className="mt-1 font-mono text-[11px] text-[#05060a]/50">Sites & vidéos — prix en euros</p>
            </div>

            <h3 className="font-display mt-7 text-[26px] font-extrabold">Sites</h3>
            <ul className="divide-y divide-dashed divide-[#05060a]/15">
              {sites.map((o) => (
                <SiteRow key={o.name} offer={o} />
              ))}
            </ul>

            <h3 className="font-display mt-8 text-[26px] font-extrabold">Vidéos</h3>
            <p className="mt-1 text-[14px] font-bold text-[#05060a]/65">
              Chaque formule = 4 vidéos de 30 secondes OU 2 vidéos de 1 minute, au choix.
            </p>
            <ul className="divide-y divide-dashed divide-[#05060a]/15">
              {packs.map((p) => (
                <VideoRow key={p.name} pack={p} format={format} setFormat={setFormat} />
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-[#05060a]/25 bg-[#f4f6fb] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[15px] font-extrabold">
                  Option — Nom de domaine .COM <span className="font-mono text-[14px]">{DOMAIN_PRICE.price}</span>
                </p>
                <span className="rounded-full bg-[#05060a] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                  Après livraison
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[#05060a]/65">
                Une fois votre site livré, vous nous dites si vous en voulez un. Ce n'est pas ajouté à la
                commande de départ.
              </p>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-[#05060a]/60">
              Prix en euros. Vous voyez votre site avant de payer. Le lien de paiement vous est envoyé
              ensuite, et vos vidéos arrivent dès que c'est réglé.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center" data-reveal>
          <a
            href={waLink("Bonjour, j'ai une question sur une offre.")}
            target="_blank"
            rel="noopener"
            data-cursor="play"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#3b6bff] px-8 text-[16px] font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            Une question sur une offre ? Écrivez-nous
          </a>
        </div>
      </div>
    </section>
  );
}
