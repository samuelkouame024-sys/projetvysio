# VYZIO — Studio créatif (format France)

Site vitrine « lecteur vidéo » du studio VYZIO : sites web et vidéos publicitaires IA.
Objectif unique : amener le visiteur à écrire sur WhatsApp.

**Stack** : React 19 · Vite 7 · Tailwind 4 · GSAP + Lenis · Supabase (Postgres, Storage CDN, Edge Functions) · Vercel

> 📘 **Mise en ligne pas à pas : [GUIDE-DEPLOIEMENT.md](./GUIDE-DEPLOIEMENT.md)**
> (GitHub, Supabase, Vercel, vérifications, dépannage).

---

## Démarrage rapide

```bash
npm ci
cp .env.example .env   # facultatif : sans .env, le site utilise src/data.ts
npm run dev            # http://localhost:5173
npm run build          # construit dist/
```

Node **20+** requis (voir `.nvmrc`).

## Variables d'environnement

| Variable | Exemple | Note |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Publique |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Publique, lecture seule grâce au RLS |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Alternative pour les anciens projets |

⛔ Jamais de clé `sb_secret_...` côté front : le client la refuse.

## Architecture

```
src/
├── components/         Sections : Loader, Hero, Presentation, Realisations, VideosSection,
│                       Tarifs, Process, Faq, Contact, Generique + SmartVideo, Cursor,
│                       PlayerChrome, ErrorBoundary
├── lib/
│   ├── supabase.ts     Client lecture seule, validation config, refus des clés secrètes
│   ├── content.ts      Store partagé : 1 requête, cache localStorage, URLs vidéo stables
│   ├── security.ts     Allowlist d'URLs, échappement, validation
│   └── order.ts        Statistiques de clics → Edge Function (fire-and-forget)
├── data.ts             Contacts, prix de secours (€), messages WhatsApp
└── App.tsx             Lenis + GSAP ScrollTrigger + ErrorBoundary

supabase/
├── schema.sql                        Tables, index, RLS, bucket CDN, seed (idempotent)
└── functions/order-intent/index.ts   CORS allowlist, vérif clé, rate-limit, honeypot

vercel.json                           CSP, HSTS, X-Frame-Options, cache
.github/workflows/ci.yml              Scan secrets, audit, typecheck, build, headers
```

## Stratégie anti-saccade

- Vidéos servies par un **bucket public** (CDN, URL fixe, Range requests), pas par des liens signés.
- Le 1er affichage n'attend aucun réseau : URLs vidéo calculées localement, contenu en cache.
- **Une seule** requête de contenu pour tout le site, lancée en idle après le démarrage de la vidéo d'ouverture.
- Les URLs vidéo ne changent jamais en cours de visite (pas de redémarrage).
- Préchargement du buffer 300 px avant l'écran, lecture à 50 % visible, reprise auto en cas de coupure.
- Maximum 2 vidéos en lecture sur mobile, une seule avec le son.

## Sécurité

Voir [SECURITY.md](./SECURITY.md).

## Contacts

- WhatsApp : https://wa.me/2250502354176 (+225 05 02 35 41 76)
- Email : samuelkouassi189@gmail.com

© 2026 VYZIO. Tous droits réservés. Code privé.
