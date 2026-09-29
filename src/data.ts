/* ============================================================
   VYZIO — Données centrales (FRANCE — prix en euros uniquement)
   Ces données servent de fallback instantané.
   Si Supabase est configuré (.env), le contenu vient de la base
   avec cache 24 h (voir src/lib/content.ts).
   Emplacements médias commentés pour remplacement facile.
   ============================================================ */

// --- Contacts d'origine (inchangés) — site en format France (euros) ---
export const WA_NUMBER = "2250502354176";
export const WA_DISPLAY = "+225 05 02 35 41 76";
// Email construit côté code (anti-spam)
export const EMAIL_USER = "samuelkouassi189";
export const EMAIL_DOMAIN = "gmail.com";
export const getEmail = () => `${EMAIL_USER}@${EMAIL_DOMAIN}`;
export const getMailto = (subject = "Projet VYZIO", body = "Bonjour, je souhaite discuter d'un projet.") =>
  `mailto:${getEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const waLink = (message: string) => {
  // Sécurité : numéro validé + message borné (anti open-redirect / anti injection)
  if (!/^[0-9]{10,15}$/.test(WA_NUMBER)) throw new Error("WA_NUMBER invalide");
  const clean = message.slice(0, 500);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(clean)}`;
};

export const WA_DEFAULT = waLink("Bonjour, je veux un site pour mon business.");

// --- Vidéos (URLs transitoires — remplacées par le CDN public
// dès que les MP4 sont uploadés dans le bucket Supabase "videos") ---
// MEDIA: VIDEO_PRESENTATION — fond ouverture + lecteur présentation
export const VIDEO_PRESENTATION =
  "https://uehwgesdscewmizutgnc.supabase.co/storage/v1/object/sign/storage/WhatsApp%20Video%202026-09-27%20at%2012.40.0.mp4?token=eyJraWQiOiJlNTQ1M2E5Mi02NjI2LTRkYzYtYmYxMi0xYmQ4NDM1ZmY5ZDciLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJzdG9yYWdlL1doYXRzQXBwIFZpZGVvIDIwMjYtMDktMjcgYXQgMTIuNDAuMC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkwNjMyNjIwLCJleHAiOjE4ODUyNDA2MjB9.ivtLOBHAEryTTvWUfC7BWv8nz5o9d2s0IVqzBZLVlJMYLJHwcMmr46E0YGoiiEhj2wlsHmXMxF2gF7cetZRXTw";

// MEDIA: VIDEO_1 à VIDEO_4 — section Vidéos, format vertical
export const VIDEOS = [
  {
    id: "video-1",
    src: "https://uehwgesdscewmizutgnc.supabase.co/storage/v1/object/sign/storage/Untitled%20folder/WhatsApp%20Video%202026-09-28%20at%2021.50.0.mp4?token=eyJraWQiOiJlNTQ1M2E5Mi02NjI2LTRkYzYtYmYxMi0xYmQ4NDM1ZmY5ZDciLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJzdG9yYWdlL1VudGl0bGVkIGZvbGRlci9XaGF0c0FwcCBWaWRlbyAyMDI2LTA5LTI4IGF0IDIxLjUwLjAubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc5MDYzMjc1NywiZXhwIjoxODg1MjQwNzU3fQ.DI9eSRrwKia_sDcIm8b61p90u7J7GVG2jXkhDlUJalhSCau7TU2JZmkV7HDkgVwMy5NGSUwRhQQsodHcXyknhA",
    caption: "Le Déclic",
    num: "01",
  },
  {
    id: "video-2",
    src: "https://uehwgesdscewmizutgnc.supabase.co/storage/v1/object/sign/storage/Untitled%20folder/WhatsApp%20Video%202026-09-28%20at%2021.50.16.mp4?token=eyJraWQiOiJlNTQ1M2E5Mi02NjI2LTRkYzYtYmYxMi0xYmQ4NDM1ZmY5ZDciLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJzdG9yYWdlL1VudGl0bGVkIGZvbGRlci9XaGF0c0FwcCBWaWRlbyAyMDI2LTA5LTI4IGF0IDIxLjUwLjE2Lm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTA2MzI3ODQsImV4cCI6MTg4NTI0MDc4NH0.Pg11aIEL1rv3JUc8UixLQCCePRoLM-LuWwtvXSuZvwMwkIg2grQiVtF8uvgKQdHMdVq59DR6-eA0masRGt6IRQ",
    caption: "Vitrine en mouvement",
    num: "02",
  },
  {
    id: "video-3",
    src: "https://uehwgesdscewmizutgnc.supabase.co/storage/v1/object/sign/storage/Untitled%20folder/WhatsApp%20Video%202026-09-28%20at%2021.50.17.mp4?token=eyJraWQiOiJlNTQ1M2E5Mi02NjI2LTRkYzYtYmYxMi0xYmQ4NDM1ZmY5ZDciLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJzdG9yYWdlL1VudGl0bGVkIGZvbGRlci9XaGF0c0FwcCBWaWRlbyAyMDI2LTA5LTI4IGF0IDIxLjUwLjE3Lm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTA2MzI4MjYsImV4cCI6MTg4NTI0MDgyNn0.SCqEI9UBycT8nmt8_nY9laTHdK8iqMh4yJIaaPRJETyEEYOC2S9rlITndTCqUx-7vzMX7uzBzaitP2JaUab_HA",
    caption: "Le Pouce qui s'arrête",
    num: "03",
  },
  {
    id: "video-4",
    src: "https://uehwgesdscewmizutgnc.supabase.co/storage/v1/object/sign/storage/Untitled%20folder/Whatspp%20Video%202026-09-28%20at%2021.49.57.mp4?token=eyJraWQiOiJlNTQ1M2E5Mi02NjI2LTRkYzYtYmYxMi0xYmQ4NDM1ZmY5ZDciLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJzdG9yYWdlL1VudGl0bGVkIGZvbGRlci9XaGF0c3BwIFZpZGVvIDIwMjYtMDktMjggYXQgMjEuNDkuNTcubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc5MDYzMjg2NCwiZXhwIjoxODIyMTY4ODY0fQ.0ibZ9T-3G5Ju0mpS-k218ASVRWZ8up9sMCz51ckUIqTxRfbTr79lOZ_7vjvqjUx6sW_P-I0vOxOl597RV5uEGQ",
    caption: "Prêt à vendre",
    num: "04",
  },
];

// MEDIA: posters — à remplacer par vos captures (léger, local)
export const POSTER_PRESENTATION = "/posters/presentation.jpg";
export const POSTER_VERTICAL = "/posters/vertical.jpg";

// MEDIA: photos FRANCE (Paris, commerces) — remplacez par vos photos clients
export const PHOTOS = {
  // Rue commerçante parisienne — section présentation (le problème)
  marche:
    "https://images.pexels.com/photos/2574485/pexels-photo-2574485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  // Bistrot parisien — encart réalisations ou présentation
  restaurant:
    "https://images.pexels.com/photos/38856061/pexels-photo-38856061.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  // Boutique parisienne — présentation (pour qui)
  boutique:
    "https://images.pexels.com/photos/32412563/pexels-photo-32412563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  // Devant un café parisien — section vidéos / créatrice
  creatrice:
    "https://images.pexels.com/photos/32590362/pexels-photo-32590362.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

// --- Chapitres (navigation lecteur) ---
export const CHAPTERS = [
  { id: "ouverture", label: "Ouverture", num: "01" },
  { id: "presentation", label: "Présentation", num: "02" },
  { id: "realisations", label: "Réalisations", num: "03" },
  { id: "videos", label: "Vidéos", num: "04" },
  { id: "tarifs", label: "Tarifs", num: "05" },
  { id: "contact", label: "Contact", num: "06" },
  { id: "generique", label: "Générique", num: "07" },
] as const;

// Durée fictive du "film" en secondes (00:00 → 01:30)
export const FILM_DURATION = 90;

// --- Réalisations (France) ---
export type Project = {
  name: string;
  line: string;
  tag: string;
  url: string;
  note: string;
};
export const PROJECTS: Project[] = [
  {
    name: "Le Comptoir Doré",
    line: "La table qui se commande sur WhatsApp",
    tag: "Restaurant",
    url: "https://baobab-d-or.vercel.app/",
    note: "Menu, réservation, WhatsApp direct.",
  },
  {
    name: "Maison Lumière",
    line: "Les sneakers qui se vendent en quelques messages",
    tag: "Boutique",
    url: "https://nexu-mocha.vercel.app/",
    note: "Catalogue rapide, commande simple.",
  },
  {
    name: "AUREA",
    line: "L'architecture mise en scène",
    tag: "Résidences d'exception",
    url: "https://aurea-estates-nwyc.vercel.app/",
    note: "Visuel grand format, prise de contact.",
  },
  {
    name: "VELOCE",
    line: "Une expérience auto qui se vit au scroll",
    tag: "Automobile",
    url: "https://website-car-xi.vercel.app/",
    note: "Défilement immersif, essai sur message.",
  },
];

// --- Tarifs FRANCE : euros uniquement ---
export type SiteOffer = { name: string; tagline: string; price: string; star?: boolean };
export const SITE_OFFERS: SiteOffer[] = [
  { name: "Landing Page", tagline: "La vitrine express", price: "38 €" },
  { name: "Landing Page + Vidéo", tagline: "La vitrine qui bouge", price: "53 €" },
  { name: "Portfolio", tagline: "Ta carte de visite en ligne", price: "53 €" },
  { name: "Site HTML", tagline: "Le site qui tient la route", price: "76 €" },
  { name: "Site HTML + Vidéo", tagline: "Le lancement complet", price: "99 €", star: true },
  { name: "Site Business", tagline: "L'entreprise en grand", price: "229 €" },
];

export type VideoPack = { name: string; tagline: string; price: string; detail: string };
export const VIDEO_PACKS: VideoPack[] = [
  { name: "Formule Test", tagline: "Le test", price: "11 €", detail: "1 formule" },
  { name: "Pack 3 formules", tagline: "Le démarrage", price: "30 €", detail: "3 formules" },
  { name: "Pack 5 formules", tagline: "Le rythme", price: "46 €", detail: "5 formules" },
  { name: "Pack 10 formules", tagline: "La série", price: "76 €", detail: "10 formules" },
];

export const DOMAIN_PRICE = { price: "23 €" };

// Messages WhatsApp par offre
export const siteOrderMessage = (o: SiteOffer) =>
  `Bonjour, je veux l'offre ${o.name} (${o.price}).`;

export type VideoFormat = "4x30" | "2x60";
export const FORMAT_LABEL: Record<VideoFormat, string> = {
  "4x30": "4 vidéos de 30 secondes",
  "2x60": "2 vidéos de 1 minute",
};
export const videoOrderMessage = (p: VideoPack, format: VideoFormat) =>
  p.name === "Formule Test"
    ? `Bonjour, je veux la formule vidéo à ${p.price}. Je choisis : ${FORMAT_LABEL[format]}.`
    : `Bonjour, je veux le ${p.name} (${p.price}). Je choisis : ${FORMAT_LABEL[format]} par formule.`;

// --- Process ---
export const STEPS = [
  { title: "Écrivez-nous", text: "Un message WhatsApp suffit pour démarrer." },
  { title: "On parle du besoin", text: "On précise votre projet et on vous envoie un devis clair." },
  { title: "On crée et on vous montre", text: "On réalise votre site et on vous le présente d'abord, pour que vous voyiez le résultat avant de payer.", highlight: true },
  { title: "Vous payez", text: "Si le site vous plaît, on vous envoie un lien de paiement." },
  { title: "Vous recevez", text: "Dès que le paiement est confirmé, on vous envoie vos vidéos." },
];

// --- FAQ (France, euros) ---
export const FAQS = [
  {
    q: "Est-ce que je vois le travail avant de payer ?",
    a: "Oui. On vous montre d'abord votre site. Si vous êtes satisfait, on vous envoie un lien de paiement, puis vos vidéos dès que le paiement est confirmé.",
  },
  {
    q: "Puis-je avoir mon propre nom de domaine ?",
    a: "Oui. Une fois votre site livré, dites-nous si vous en voulez un. On s'en occupe pour 23 €.",
  },
  {
    q: "Que contient la formule vidéo à 11 € ?",
    a: "Vous choisissez : 4 vidéos de 30 secondes ou 2 vidéos de 1 minute.",
  },
  {
    q: "Quelles vidéos réalisez-vous ?",
    a: "Des vidéos publicitaires avec l'IA et du montage, en format UGC ou motion design selon votre besoin.",
  },
  {
    q: "Le site sera-t-il bien placé sur Google ?",
    a: "Le SEO de base est inclus. Les résultats prennent des semaines ou des mois, et aucune première place n'est garantie.",
  },
  {
    q: "Comment se passe une commande ?",
    a: "1. Vous écrivez sur WhatsApp. 2. On parle de votre besoin et on vous envoie un devis clair. 3. On crée votre site et on vous le montre d'abord. 4. S'il vous plaît, on vous envoie le lien de paiement. 5. Vos vidéos arrivent dès que c'est réglé. Le nom de domaine (23 €) reste facultatif, après la livraison.",
  },
];

export const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
