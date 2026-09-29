# VYZIO — Kit de lancement Reddit & LinkedIn

Textes prêts à copier-coller. Remplacez **[LIEN DU SITE]** par votre adresse Vercel
(celle affichée dans Vercel → projet → **Domains**, et surtout pas `vyzio.vercel.app`, qui est le site de quelqu'un d'autre) une fois le site en ligne.

---

## ✅ Avant de poster (10 minutes, ça évite les mauvaises surprises)

- [ ] Le site est **en ligne** et vous l'avez testé sur téléphone (checklist du `GUIDE-DEPLOIEMENT.md`, section 6).
- [ ] Vous avez collé le lien du site dans une conversation WhatsApp : l'**aperçu** avec l'image VYZIO s'affiche.
- [ ] Vous êtes disponible **2 heures après la publication** pour répondre aux commentaires. Sur Reddit comme sur LinkedIn, c'est ce qui compte le plus.
- [ ] **Cohérence des noms** : le projet « Le Comptoir Doré » ouvre l'adresse `baobab-d-or.vercel.app`. Vérifiez que le nom affiché sur ce site correspond. Sinon, un visiteur attentif le remarquera. Renommez l'un ou l'autre.
- [ ] **Cohérence du lieu** : le site parle de Paris et de la France, mais votre WhatsApp est en +225. Les textes ci-dessous **ne disent pas « basé à Paris »** pour ne pas vous faire reprendre. Si on vous pose la question, une réponse honnête est prête (section Reddit, réponses aux commentaires).

### Les 3 règles qui protègent votre réputation
1. **Rien d'inventé** : pas de « clients satisfaits », pas de chiffres, pas de témoignages tant que vous n'en avez pas de vrais. Les textes ci-dessous n'en contiennent aucun.
2. **Transparence sur l'IA** : VYZIO fait des vidéos IA, c'est votre métier. Si on vous demande si le site a été fait avec l'IA, dites la vérité. Sur Reddit, les gens le détectent vite et sanctionnent le mensonge bien plus durement que l'IA elle-même.
3. **Demandez des retours, pas des clients.** « Qu'en pensez-vous ? » marche. « Contactez-moi » fait fuir.

---

# 1. LINKEDIN

**Rappels utiles**
- Seules les **2 à 3 premières lignes** sont visibles avant « …voir plus ». Tout se joue là.
- Beaucoup recommandent de mettre le lien **en premier commentaire** plutôt que dans le post : LinkedIn semble moins diffuser les posts qui envoient les gens hors de la plateforme.
- 3 à 5 hashtags maximum, à la fin.
- Créneau souvent conseillé : **mardi, mercredi ou jeudi, entre 8 h et 10 h** (heure de Paris).
- Ajoutez une **image ou une vidéo** : capture de l'écran d'ouverture, ou mieux, une courte vidéo d'écran du scroll (voir le script vidéo plus bas).

---

### 📌 Post 1 : l'annonce (jour J)

```
Beaucoup de commerces vendent bien.
Mais personne ne le voit.

Une photo floue sur WhatsApp.
Un statut que personne ne regarde jusqu'au bout.
Pendant ce temps, le concurrent d'à côté a un vrai site et une vidéo qui tourne sur TikTok.

Il n'est pas meilleur. Il est juste plus visible.

C'est pour ça que je lance VYZIO. 🎬

Un studio qui crée des sites web et des vidéos publicitaires IA (UGC, motion design) pour les commerçants, restaurants, boutiques et jeunes marques.

Ma façon de travailler :
▶ Vous voyez votre site AVANT de payer.
▶ Des prix affichés : une landing page dès 38 €, des vidéos dès 11 € (4 vidéos de 30 secondes ou 2 vidéos d'une minute).
▶ Tout se passe sur WhatsApp. Pas de réunion interminable, pas de jargon.

Pour le site de VYZIO, j'ai voulu montrer plutôt que dire : tout le site fonctionne comme un lecteur vidéo. Vous scrollez, le « film » avance, chapitre par chapitre, jusqu'au générique de fin.

Le lien est en commentaire 👇
Dites-moi franchement ce que vous en pensez, j'ai besoin de vos retours.

Et si vous connaissez un commerçant qui mérite d'être vu, identifiez-le. 🙏

#Entrepreneuriat #CreationSiteWeb #MarketingVideo #IA #Lancement
```

**Premier commentaire (à publier juste après)** :
```
Le site : [LIEN DU SITE]
Pour m'écrire directement : https://wa.me/2250502354176
```

---

### 📌 Post 2 : l'argument confiance (3 à 4 jours plus tard)

```
« Et si je paie, et que le site ne me plaît pas ? »

C'est la question que tout commerçant se pose avant de se lancer.
Alors chez VYZIO, j'ai inversé l'ordre.

1. Vous m'écrivez sur WhatsApp.
2. On parle de votre business, je vous envoie un devis clair.
3. Je crée votre site et je vous le montre.
4. S'il vous plaît, je vous envoie le lien de paiement.
5. Vos vidéos arrivent dès que c'est réglé.

Vous voyez le résultat avant de sortir un euro.

Pour démarrer sans risque : des vidéos dès 11 € (4 vidéos de 30 s ou 2 d'une minute), une landing page dès 38 €.

Vous avez un commerce, un restaurant, une boutique ou une jeune marque ?
Le lien est en commentaire 👇

#PetitesEntreprises #Commerce #SiteWeb #VideoMarketing
```

**Premier commentaire** :
```
Voir les offres : [LIEN DU SITE]
M'écrire : https://wa.me/2250502354176
```

---

### 📌 Post 3 : les coulisses techniques (pour votre réseau tech, 1 semaine après)

```
Mon site saccadait. Voici ce que j'ai appris en le réparant. 🎥

Pour VYZIO, j'ai conçu un site qui se comporte comme un lecteur vidéo : le scroll fait avancer la lecture, la navigation se fait par chapitres, et le pied de page est un générique de fin.

Problème : des vidéos partout = un site qui rame, surtout sur mobile en 4G.

Ce qui a tout changé :
→ Des vidéos servies par un CDN avec une adresse fixe, au lieu de liens signés qui expirent
→ Des MP4 encodés en « faststart » : la lecture démarre avant la fin du téléchargement
→ Une vidéo ne se lance que quand elle est visible à 50 %, et se met en pause dès qu'elle sort de l'écran
→ Jamais plus de 2 vidéos en lecture en même temps sur mobile, une seule avec le son
→ Le contenu est chargé une seule fois, en cache, sans bloquer la vidéo d'ouverture

Et côté sécurité, parce qu'un site vitrine aussi peut être détourné :
→ Personne ne peut afficher le site dans un autre site (anti-copie, anti-phishing)
→ La base de données est en lecture seule depuis le site
→ Un contrôle automatique bloque tout secret envoyé par erreur sur GitHub

Stack : React, Vite, Tailwind, GSAP, Lenis, Supabase, Vercel.

Le résultat est en commentaire. Les retours techniques sont les bienvenus 👇

#DeveloppementWeb #React #Performance #Supabase
```

---

### 🎥 Script vidéo (30 à 45 secondes) : LinkedIn, TikTok, Instagram

À filmer face caméra, avec des plans d'écran du site en défilement. Format vertical 9:16.

| Temps | Image | Voix |
|---|---|---|
| 0–3 s | Vous, face caméra, plan serré | « Votre business mérite d'être vu. » |
| 3–10 s | Plan d'un téléphone qui scrolle vite des statuts WhatsApp | « Vos produits sont bons. Mais une photo floue sur WhatsApp, personne ne la regarde jusqu'au bout. » |
| 10–18 s | Enregistrement d'écran : le compte à rebours 3-2-1, puis l'ouverture du site | « Moi c'est Samuel, et je lance VYZIO : des sites web et des vidéos publicitaires pour les commerçants et les marques. » |
| 18–26 s | Scroll sur les Réalisations (les téléphones) puis sur les Vidéos | « Des sites qui envoient vos clients directement sur WhatsApp. Des vidéos courtes qui arrêtent le pouce. » |
| 26–34 s | Scroll sur la carte des tarifs (le ticket) | « Et vous voyez votre site avant de payer. Des vidéos dès 11 euros, une landing page dès 38. » |
| 34–40 s | Retour face caméra | « Écrivez-moi sur WhatsApp. Le lien est juste là. » |
| 40–45 s | Écran de fin : logo VYZIO + « Créer. Développer. Faire grandir. » | *(musique seule)* |

💡 Ajoutez des **sous-titres** : la majorité des vidéos sont regardées sans le son. C'est d'ailleurs le principe de votre site.

---

# 2. REDDIT

**À lire absolument avant de poster**
- Reddit **déteste la publicité**. Un post qui ressemble à une annonce est supprimé ou descendu. Présentez votre projet comme un **retour d'expérience** et **demandez des avis**.
- **Lisez les règles de chaque subreddit** (colonne de droite, ou onglet « À propos »). Beaucoup interdisent l'autopromotion, ou la limitent à un fil dédié ou à un jour précis.
- Un compte tout neuf, sans historique, est souvent filtré automatiquement. Si votre compte est récent, commentez et participez quelques jours avant de poster.
- **Ne publiez pas le même texte dans 5 subreddits le même jour** : le filtre anti-spam peut vous bloquer. Espacez de 1 à 2 jours.
- Répondez à **chaque** commentaire, y compris les critiques, avec calme. Une critique bien gérée vaut de l'or.

**Où poster** (vérifiez les règles à jour avant)
| Subreddit | Langue | Conseil |
|---|---|---|
| r/SideProject | Anglais | Fait pour présenter ses projets. Le plus sûr pour commencer. |
| r/webdev | Anglais | Uniquement le **samedi**, avec le flair « Showoff Saturday ». |
| r/developpeurs | Français | Communauté de développeurs francophones. Angle 100 % technique, sinon suppression. |
| Subreddits francophones d'entrepreneuriat | Français | Cherchez-les et lisez bien leurs règles : ils sont souvent très stricts sur l'autopromo. |

⛔ **Évitez r/france** pour ce type de post : l'autopromotion n'y est pas bienvenue.

---

### 📌 Post Reddit en français (angle technique, pour r/developpeurs)

**Titre** :
```
J'ai fait le site de mon studio comme un lecteur vidéo (le scroll = la lecture). Vos retours techniques ?
```

**Texte** :
```
Salut à tous,

Je lance VYZIO, un petit studio qui fait des sites et des vidéos pub (UGC, motion design) pour des commerçants. Je poste ici pour avoir des avis sur le site, pas pour vendre (même si c'est le site de mon activité, je ne vais pas faire semblant).

**Le concept** : le site entier se comporte comme un lecteur vidéo.
- Le scroll fait avancer une barre de lecture en bas de l'écran
- Pas de menu classique : une navigation par chapitres (Ouverture, Présentation, Réalisations, Vidéos, Tarifs, Contact, Générique)
- Le curseur devient « Voir » sur les projets et un bouton play sur les vidéos (désactivé sur tactile)
- Le pied de page est un générique de fin qui défile

**Stack** : React 19, Vite, Tailwind 4, GSAP + ScrollTrigger, Lenis, Supabase (Postgres + Storage + une Edge Function), Vercel.

**Les problèmes que j'ai dû régler :**

1. **Autoplay mobile** : toutes les vidéos démarrent en muet (sinon Safari bloque), avec un IntersectionObserver à 50 % pour lancer ou mettre en pause. Maximum 2 vidéos en lecture en même temps sur mobile, une seule avec le son. Si l'autoplay est quand même bloqué, un gros bouton play apparaît.

2. **Les saccades** : au départ, les vidéos passaient par des URLs signées. Passer sur un bucket public (URL fixe, cache CDN) et encoder en `-movflags +faststart` a tout changé. J'ai aussi fait en sorte que la source d'une vidéo ne change jamais en cours de visite, sinon elle redémarre.

3. **La sécurité, même pour un site vitrine** : CSP stricte, `frame-ancestors 'none'` pour qu'on ne puisse pas l'embarquer ailleurs, RLS en lecture seule sur toutes les tables, et une Edge Function pour compter les clics « Commander » (origine autorisée, rate-limit, honeypot, aucune donnée perso).

**Ce que je sais déjà ne pas être parfait :**
- Le build est un seul fichier HTML d'environ 200 Ko en gzip (tout est inliné). Pratique à déployer, pas idéal pour le cache.
- Les 4 aperçus de réalisations sont de vraies iframes. Elles sont chargées en différé, mais ça reste lourd.

**Là où j'aimerais vos avis :**
- Le concept « lecteur vidéo » : immersif, ou pénible à la longue ?
- La perf sur vos téléphones (surtout Android d'entrée de gamme)
- L'accessibilité : j'ai géré `prefers-reduced-motion`, le focus clavier et des zones tactiles de 44 px, mais j'ai sûrement raté des choses

Le lien : [LIEN DU SITE]

Merci d'avance, je prends toutes les critiques 🙏
```

---

### 📌 Post Reddit en anglais (pour r/SideProject et r/webdev « Showoff Saturday »)

**Titre** :
```
I built my studio's website as a video player: scrolling plays the "film", chapters replace the menu, and the footer is end credits
```

**Texte** :
```
Hey everyone,

I just launched VYZIO, a small studio making websites and AI ad videos (UGC, motion design) for small businesses. Before sharing it more widely, I'd love honest feedback from people who build things.

**The concept**: the whole site behaves like a video player.
- Scrolling moves a playback bar at the bottom of the screen
- No classic menu, just chapter navigation (Opening, About, Work, Videos, Pricing, Contact, Credits)
- The cursor turns into "View" over projects and a play button over videos (disabled on touch devices)
- It opens with a 3-2-1 film countdown and ends with rolling credits

**Stack**: React 19, Vite, Tailwind 4, GSAP + ScrollTrigger, Lenis, Supabase (Postgres, Storage, one Edge Function), Vercel.

**Interesting problems I had to solve:**
- **Mobile autoplay**: every video starts muted and plays only when 50% visible (IntersectionObserver), then pauses when it leaves the screen. Max 2 playing at once on mobile, only one with sound. A big play button appears if autoplay is blocked anyway.
- **Stuttering video**: moving from signed URLs to a public CDN bucket, and encoding with `faststart`, fixed most of it. I also never swap a video's source mid-visit, otherwise it restarts.
- **Security on a "simple" landing page**: strict CSP, `frame-ancestors 'none'`, read-only RLS on every table, and a rate-limited Edge Function (origin allowlist + honeypot) that counts "Order" clicks with no personal data.

**Known weak spots:**
- Single-file build, around 200 KB gzipped (everything inlined)
- The 4 portfolio previews are real iframes (lazy-loaded, but still heavy)

**What I'd love feedback on:**
- Is the video-player concept immersive or annoying after a while?
- Performance on your phone
- Anything that breaks accessibility

The site is in French (my clients are French-speaking), but the concept should come through anyway: [LIEN DU SITE]

Thanks, all criticism welcome 🙏
```

---

### 💬 Réponses prêtes pour les commentaires

**« C'est fait avec l'IA ? »**
```
Oui, j'utilise des outils IA dans mon travail, pour les vidéos comme pour le code. C'est même au cœur de ce que je propose. Le concept du lecteur vidéo, la direction artistique, les textes et les choix techniques viennent de moi. L'IA m'aide à aller plus vite, et je relis et teste tout.
```
*(Adaptez selon ce qui est vrai pour vous. L'important est de ne jamais nier.)*

**« Pourquoi un numéro en +225 alors que le site parle de la France ? »** *(adaptez à votre situation réelle)*
```
Bonne remarque ! Je travaille à distance : mon WhatsApp est ivoirien, et mes offres sont en euros parce que je vise des clients en France et dans l'espace francophone. Tout se fait en ligne, donc la distance ne change rien au travail.
```

**« Détourner le scroll, c'est une mauvaise pratique. »**
```
Je comprends, c'est un vrai risque. J'ai essayé de rester léger : le scroll n'est jamais bloqué, Lenis se contente de le lisser, les animations ne gênent pas la lecture, et tout est réduit si « réduire les animations » est activé dans le système. Si ça vous a gêné à un endroit précis, dites-moi où, ça m'aide vraiment.
```

**« Tes prix sont trop bas, il y a un piège ? »**
```
Pas de piège : ce sont des offres d'entrée, pour que des petits commerces puissent tester. Et vous voyez votre site avant de payer : si ça ne plaît pas, vous ne payez pas. Les projets plus complets ont des prix plus élevés, tout est affiché sur la page Tarifs.
```

**« Le site est lourd / lent chez moi. »**
```
Merci pour le retour, c'est exactement ce que je cherche. Vous pouvez me dire votre téléphone et votre navigateur ? Je sais déjà que le build en fichier unique et les iframes des réalisations sont les points faibles, je vais travailler dessus.
```

**« Tu peux partager le code ? »**
```
Le dépôt est privé pour l'instant, mais je peux partager des extraits si un point précis vous intéresse (la gestion des vidéos, la CSP ou l'Edge Function, par exemple).
```

**Une critique dure ou moqueuse**
```
Merci d'avoir pris le temps de regarder. Qu'est-ce qui vous a le plus gêné concrètement ? Je prends note.
```
*(Ne vous justifiez jamais longuement, ne contre-attaquez jamais. Les autres lecteurs jugent votre réaction.)*

---

# 3. CALENDRIER CONSEILLÉ

| Jour | Action |
|---|---|
| **J0** (mardi ou mercredi matin) | LinkedIn Post 1 + premier commentaire avec le lien. Répondez pendant 2 heures. |
| **J+1** | Reddit r/SideProject (post en anglais) |
| **J+2** | Reddit r/developpeurs (post en français), après avoir relu les règles |
| **Samedi suivant** | Reddit r/webdev, flair « Showoff Saturday » |
| **J+4** | LinkedIn Post 2 (voir avant de payer) |
| **J+7** | LinkedIn Post 3 (coulisses techniques) ou la vidéo |
| **J+10** | Corrigez le site avec les retours reçus, puis un dernier post LinkedIn : « Vous m'avez fait des retours, voici ce que j'ai changé. » Ce genre de post fonctionne très bien. |

**Après chaque post**, notez ce qui marche : commentaires, messages WhatsApp reçus, et les offres les plus cliquées. Si vous avez déployé la fonction de statistiques, lancez cette requête dans le SQL Editor de Supabase :
```sql
select offer, kind, count(*) from public.order_intents
group by offer, kind order by count(*) desc;
```
