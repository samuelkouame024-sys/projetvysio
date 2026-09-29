-- ============================================================
-- VYZIO — Backend Supabase (site format France, prix en euros)
-- Où l'exécuter : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : vous pouvez le relancer autant de fois que vous voulez,
-- il ne crée JAMAIS de doublons (index uniques + ON CONFLICT).
-- ============================================================

-- ---------- 1. TABLES CONTENU ----------
create table if not exists public.projects (
  id bigint generated always as identity primary key,
  name text not null,
  line text not null,
  tag text not null,
  url text not null check (url like 'https://%'),
  note text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_offers (
  id bigint generated always as identity primary key,
  name text not null,
  tagline text not null,
  price_eur text not null,          -- ex : '38 €' (euros uniquement)
  is_star boolean not null default false,
  sort int not null default 0
);

create table if not exists public.video_packs (
  id bigint generated always as identity primary key,
  name text not null,
  tagline text not null,
  price_eur text not null,          -- ex : '11 €'
  detail text not null,             -- ex : '1 formule'
  sort int not null default 0
);

create table if not exists public.videos (
  id bigint generated always as identity primary key,
  slot text not null unique,        -- 'presentation' | 'video-1' … 'video-4'
  caption text not null default '',
  storage_path text not null,       -- nom du fichier dans le bucket 'videos'
  sort int not null default 0
);

create table if not exists public.faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  sort int not null default 0
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null
);

-- ---------- 2. INDEX (lecture rapide + anti-doublons) ----------
create unique index if not exists uq_projects_name on public.projects (name);
create unique index if not exists uq_site_offers_name on public.site_offers (name);
create unique index if not exists uq_video_packs_name on public.video_packs (name);
create unique index if not exists uq_faqs_question on public.faqs (question);

create index if not exists idx_projects_sort on public.projects (sort);
create index if not exists idx_site_offers_sort on public.site_offers (sort);
create index if not exists idx_video_packs_sort on public.video_packs (sort);
create index if not exists idx_videos_sort on public.videos (sort);
create index if not exists idx_faqs_sort on public.faqs (sort);

-- ---------- 3. SÉCURITÉ : lecture publique, AUCUNE écriture publique ----------
-- RLS activé : sans policy INSERT/UPDATE/DELETE, personne ne peut modifier
-- le contenu depuis le site. Vous seul modifiez via le Dashboard.
alter table public.projects enable row level security;
alter table public.site_offers enable row level security;
alter table public.video_packs enable row level security;
alter table public.videos enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;

do $$ begin
  create policy "Lecture publique" on public.projects for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Lecture publique" on public.site_offers for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Lecture publique" on public.video_packs for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Lecture publique" on public.videos for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Lecture publique" on public.faqs for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Lecture publique" on public.site_settings for select using (true);
exception when duplicate_object then null; end $$;

-- ---------- 4. STOCKAGE VIDÉO : bucket public (CDN) ----------
-- Public = les MP4 sont servis par le CDN Supabase via une URL fixe,
-- sans token qui expire → lecture fluide, pas de saccade.
-- Limite 50 Mo par fichier (limite du plan gratuit). Compressez vos MP4.
-- AUCUNE policy sur storage.objects : personne ne peut uploader, supprimer
-- ni LISTER le bucket depuis le site. Seul le lien direct d'un fichier marche.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 52428800, array['video/mp4','image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------- 5. DONNÉES (seed) ----------
insert into public.projects (name, line, tag, url, note, sort) values
  ('Le Comptoir Doré', 'La table qui se commande sur WhatsApp', 'Restaurant', 'https://baobab-d-or.vercel.app/', 'Menu, réservation, WhatsApp direct.', 1),
  ('Maison Lumière', 'Les sneakers qui se vendent en quelques messages', 'Boutique', 'https://nexu-mocha.vercel.app/', 'Catalogue rapide, commande simple.', 2),
  ('AUREA', 'L''architecture mise en scène', 'Résidences d''exception', 'https://aurea-estates-nwyc.vercel.app/', 'Visuel grand format, prise de contact.', 3),
  ('VELOCE', 'Une expérience auto qui se vit au scroll', 'Automobile', 'https://website-car-xi.vercel.app/', 'Défilement immersif, essai sur message.', 4)
on conflict (name) do nothing;

insert into public.site_offers (name, tagline, price_eur, is_star, sort) values
  ('Landing Page', 'La vitrine express', '38 €', false, 1),
  ('Landing Page + Vidéo', 'La vitrine qui bouge', '53 €', false, 2),
  ('Portfolio', 'Ta carte de visite en ligne', '53 €', false, 3),
  ('Site HTML', 'Le site qui tient la route', '76 €', false, 4),
  ('Site HTML + Vidéo', 'Le lancement complet', '99 €', true, 5),
  ('Site Business', 'L''entreprise en grand', '229 €', false, 6)
on conflict (name) do nothing;

insert into public.video_packs (name, tagline, price_eur, detail, sort) values
  ('Formule Test', 'Le test', '11 €', '1 formule', 1),
  ('Pack 3 formules', 'Le démarrage', '30 €', '3 formules', 2),
  ('Pack 5 formules', 'Le rythme', '46 €', '5 formules', 3),
  ('Pack 10 formules', 'La série', '76 €', '10 formules', 4)
on conflict (name) do nothing;

insert into public.faqs (question, answer, sort) values
  ('Est-ce que je vois le travail avant de payer ?',
   'Oui. On vous montre d''abord votre site. Si vous êtes satisfait, on vous envoie un lien de paiement, puis vos vidéos dès que le paiement est confirmé.', 1),
  ('Puis-je avoir mon propre nom de domaine ?',
   'Oui. Une fois votre site livré, dites-nous si vous en voulez un. On s''en occupe pour 23 €.', 2),
  ('Que contient la formule vidéo à 11 € ?',
   'Vous choisissez : 4 vidéos de 30 secondes ou 2 vidéos de 1 minute.', 3),
  ('Quelles vidéos réalisez-vous ?',
   'Des vidéos publicitaires avec l''IA et du montage, en format UGC ou motion design selon votre besoin.', 4),
  ('Le site sera-t-il bien placé sur Google ?',
   'Le SEO de base est inclus. Les résultats prennent des semaines ou des mois, et aucune première place n''est garantie.', 5),
  ('Comment se passe une commande ?',
   '1. Vous écrivez sur WhatsApp. 2. On parle de votre besoin et on vous envoie un devis clair. 3. On crée votre site et on vous le montre d''abord. 4. S''il vous plaît, on vous envoie le lien de paiement. 5. Vos vidéos arrivent dès que c''est réglé. Le nom de domaine (23 €) reste facultatif, après la livraison.', 6)
on conflict (question) do nothing;

insert into public.site_settings (key, value) values
  ('video_presentation_path', 'presentation.mp4'),
  ('contact_whatsapp', '2250502354176'),
  ('contact_email', 'samuelkouassi189@gmail.com'),
  ('contact_city', 'Paris, France')
on conflict (key) do nothing;

-- Noms de fichiers attendus dans le bucket 'videos'
insert into public.videos (slot, caption, storage_path, sort) values
  ('presentation', 'Présentation VYZIO', 'presentation.mp4', 0),
  ('video-1', 'Le Déclic', 'video-1.mp4', 1),
  ('video-2', 'Vitrine en mouvement', 'video-2.mp4', 2),
  ('video-3', 'Le Pouce qui s''arrête', 'video-3.mp4', 3),
  ('video-4', 'Prêt à vendre', 'video-4.mp4', 4)
on conflict (slot) do nothing;

-- ---------- 6. CLICS "COMMANDER" (statistiques, SANS donnée perso) ----------
-- Écriture UNIQUEMENT par l'Edge Function `order-intent` (clé serveur).
-- AUCUNE policy + droits retirés : le site ne peut ni lire ni écrire ici.
create table if not exists public.order_intents (
  id bigint generated always as identity primary key,
  offer text not null check (char_length(offer) between 2 and 80),
  kind text not null check (kind in ('site','video','contact','question')),
  page text not null default '/' check (char_length(page) <= 80),
  created_at timestamptz not null default now()
);
alter table public.order_intents enable row level security;
revoke all on public.order_intents from anon, authenticated;
create index if not exists idx_order_intents_created on public.order_intents (created_at desc);
create index if not exists idx_order_intents_kind on public.order_intents (kind);

-- ---------- 7. VÉRIFICATIONS (à lancer après) ----------
-- select count(*) from public.site_offers;   -- doit donner 6
-- select count(*) from public.video_packs;   -- doit donner 4
-- select slot, storage_path from public.videos order by sort;
-- select offer, kind, count(*) from public.order_intents
--   group by offer, kind order by count(*) desc;   -- vos offres les plus cliquées
