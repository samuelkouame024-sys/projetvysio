# VYZIO — Guide complet de mise en ligne

GitHub, Supabase, Vercel : de zéro à un site en ligne, sécurisé et fluide.
Suivez les étapes **dans l'ordre**. Comptez environ **1 heure** la première fois.

> 💡 Le site fonctionne **déjà sans Supabase** : il utilise alors les données
> de `src/data.ts`. Supabase apporte trois choses : des vidéos plus fluides
> (CDN), la modification des prix sans toucher au code, et les statistiques
> de clics « Commander ».

---

## Sommaire

0. [Ce qu'il vous faut](#0-ce-quil-vous-faut)
1. [Tester le site sur votre ordinateur](#1-tester-le-site-sur-votre-ordinateur)
2. [Mettre le code sur GitHub](#2-mettre-le-code-sur-github)
3. [Configurer le backend Supabase](#3-configurer-le-backend-supabase)
4. [Déployer la fonction de statistiques (facultatif)](#4-déployer-la-fonction-de-statistiques-facultatif)
5. [Mettre en ligne sur Vercel](#5-mettre-en-ligne-sur-vercel)
6. [Vérifications finales](#6-vérifications-finales)
7. [Modifier le site plus tard](#7-modifier-le-site-plus-tard)
8. [Sécurité : les règles d'or](#8-sécurité--les-règles-dor)
9. [Dépannage](#9-dépannage)
10. [Nom de domaine personnalisé (facultatif)](#10-nom-de-domaine-personnalisé-facultatif)

---

## 0. Ce qu'il vous faut

### Comptes (gratuits pour commencer)
| Service | Rôle | Lien |
|---|---|---|
| **GitHub** | Stocke votre code | https://github.com/signup |
| **Supabase** | Base de données + stockage vidéo | https://supabase.com |
| **Vercel** | Héberge le site | https://vercel.com (connectez-vous **avec GitHub**) |

### Logiciels sur votre ordinateur
- **Node.js 20 ou plus récent** : https://nodejs.org (prenez la version « LTS »)
- **Git** : https://git-scm.com/downloads
- Un éditeur de code, par exemple **VS Code** : https://code.visualstudio.com

Vérifiez l'installation dans un terminal (sur Windows : « Invite de commandes » ou « PowerShell ») :
```bash
node -v    # doit afficher v20.x ou plus
git --version
```

### Récupérer le projet
Téléchargez le projet depuis l'éditeur (bouton d'export/téléchargement), décompressez-le,
puis ouvrez le dossier dans VS Code. Le dossier doit contenir `package.json`, `src/`,
`supabase/`, `vercel.json`, etc.

> ⚠️ Si le dossier contient `node_modules/` ou `dist/`, ce n'est pas grave : ils ne
> seront jamais envoyés sur GitHub (le fichier `.gitignore` les bloque).

---

## 1. Tester le site sur votre ordinateur

Dans le terminal, placé dans le dossier du projet :

```bash
npm ci          # installe les dépendances (1 à 2 minutes)
npm run dev     # lance le site en local
```

Ouvrez l'adresse affichée (en général **http://localhost:5173**).

✅ **Vérification** : le compte à rebours 3-2-1 s'affiche, puis le site. Les boutons
WhatsApp ouvrent `wa.me/2250502354176`.

Arrêtez le serveur avec `Ctrl + C`.

---

## 2. Mettre le code sur GitHub

### 2.1 Créer le dépôt
1. Allez sur https://github.com/new
2. **Repository name** : `vyzio`
3. Cochez **Private**. C'est important : votre code reste privé.
4. **Ne cochez rien d'autre** (pas de README, pas de .gitignore : ils existent déjà).
5. Cliquez sur **Create repository**.

### 2.2 Envoyer le code
Dans le terminal, dans le dossier du projet (remplacez `VOTRE-PSEUDO`) :

```bash
git init
git add .
git commit -m "VYZIO : site + backend Supabase"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/vyzio.git
git push -u origin main
```

> Première fois avec Git ? Il vous demandera votre identité :
> ```bash
> git config --global user.name "Samuel"
> git config --global user.email "samuelkouassi189@gmail.com"
> ```
> Pour le mot de passe, GitHub n'accepte plus votre mot de passe normal. Utilisez un
> **token** (GitHub → Settings → Developer settings → Personal access tokens) ou
> installez **GitHub Desktop** (https://desktop.github.com), qui gère tout pour vous.

### 2.3 Vérifier la CI (contrôle automatique)
> ⚠️ Si le fichier de CI se trouve dans `ci/ci.yml`, il n'est pas encore actif.
> Suivez d'abord `ci/LISEZMOI.md` pour le déplacer dans `.github/workflows/ci.yml`.

1. Sur GitHub, ouvrez votre dépôt, onglet **Actions**.
2. Un contrôle « CI — build + sécurité » se lance à chaque envoi. Il vérifie :
   - qu'aucun fichier secret (`.env`, clé secrète) n'a été envoyé ;
   - qu'aucune dépendance n'a de faille grave (`npm audit`) ;
   - que le code TypeScript est correct ;
   - que le site se construit ;
   - que les protections de sécurité de `vercel.json` sont présentes.

✅ **Vérification** : une coche **verte** ✔. Si c'est une croix rouge, voir [Dépannage](#9-dépannage).

### 2.4 Protéger votre compte (fortement conseillé)
- GitHub → Settings → **Password and authentication** → activez la **double
  authentification (2FA)**. Faites pareil sur Vercel et Supabase.
  C'est la protection n°1 contre le vol de votre site.

---

## 3. Configurer le backend Supabase

### 3.1 Créer (ou réutiliser) le projet
**Option A : nouveau projet (recommandé)**
1. https://supabase.com/dashboard, puis **New project**.
2. **Name** : `vyzio`
3. **Database Password** : cliquez sur *Generate* et **gardez-le précieusement**
   (gestionnaire de mots de passe).
4. **Region** : **West EU (Paris)**, le plus proche de vos visiteurs en France.
5. **Create new project**, puis patientez environ 2 minutes.

**Option B : réutiliser votre projet existant**
Vos vidéos actuelles sont déjà sur un projet Supabase (celui dont l'adresse
commence par `uehwgesdscewmizutgnc`). Vous pouvez l'utiliser : suivez les mêmes
étapes à partir de 3.2.

### 3.2 Créer les tables (SQL)
1. Menu de gauche : **SQL Editor**, puis **New query**.
2. Ouvrez le fichier `supabase/schema.sql` du projet, **copiez tout**, collez.
3. Cliquez sur **Run** (ou `Ctrl + Entrée`).

✅ **Vérification** : « Success. No rows returned ». Lancez ensuite :
```sql
select count(*) from public.site_offers;  -- doit afficher 6
select count(*) from public.video_packs;  -- doit afficher 4
```

> Le script peut être relancé sans risque : il ne crée jamais de doublons.

Ce que le script a créé :
| Élément | Rôle | Qui peut écrire ? |
|---|---|---|
| `projects`, `site_offers`, `video_packs`, `faqs`, `videos`, `site_settings` | Contenu du site (prix en €) | **Vous seul**, via le Dashboard |
| `order_intents` | Statistiques des clics « Commander » (sans donnée perso) | Uniquement la fonction serveur |
| Bucket `videos` | Vos MP4, servis par le CDN | **Vous seul** (upload via le Dashboard) |

### 3.3 Préparer vos vidéos (important pour la fluidité)
Limite : **50 Mo par fichier** (plan gratuit). Plus la vidéo est légère, plus le
site est fluide, surtout sur téléphone en 4G.

**Méthode simple : HandBrake (gratuit)** https://handbrake.fr
1. Ouvrez la vidéo.
2. Preset : **Web → « Creator 720p60 »** ou **General → « Fast 720p30 »**.
3. Cochez **« Web Optimized »**. C'est indispensable : la vidéo démarre avant
   d'être entièrement téléchargée.
4. Format : **MP4**. Lancez l'encodage.

**Méthode avancée : ffmpeg**
```bash
ffmpeg -i entree.mp4 -c:v libx264 -preset slow -crf 24 \
  -vf "scale=-2:720" -movflags +faststart -c:a aac -b:a 96k sortie.mp4
```

🎯 Objectif : **moins de 8 Mo** par vidéo de 30 secondes.

### 3.4 Envoyer les 5 vidéos
1. Menu de gauche : **Storage**, puis le bucket **videos** (créé par le script).
2. **Upload files**, puis envoyez vos fichiers avec **exactement ces noms** :

| Nom du fichier | Contenu |
|---|---|
| `presentation.mp4` | Vidéo de présentation VYZIO (fond d'ouverture + lecteur) |
| `video-1.mp4` | « Le Déclic » |
| `video-2.mp4` | « Vitrine en mouvement » |
| `video-3.mp4` | « Le Pouce qui s'arrête » |
| `video-4.mp4` | « Prêt à vendre » |

> Les noms doivent être **tout en minuscules**, sans espace, avec `.mp4`.

✅ **Vérification** : ouvrez dans votre navigateur (remplacez `XXXX` par l'identifiant
de votre projet, visible dans l'adresse du Dashboard) :
```
https://XXXX.supabase.co/storage/v1/object/public/videos/video-1.mp4
```
La vidéo doit se lire. Si vous voyez une erreur, vérifiez le nom du fichier.

> ⚠️ **Faites cette étape AVANT de brancher Vercel à Supabase (étape 5).** Dès que
> les variables Supabase sont en place, le site va chercher les vidéos dans ce bucket.

### 3.5 Récupérer vos 2 valeurs de connexion
1. **Project Settings** (roue crantée), puis **API Keys**.
2. Copiez la **Publishable key** : elle commence par `sb_publishable_...`.
3. **Project Settings**, puis **Data API** : copiez la **Project URL**
   (`https://XXXX.supabase.co`).

> 🔐 Sur la même page, il existe une **Secret key** (`sb_secret_...`).
> **Ne la copiez nulle part** : ni dans le code, ni dans Vercel, ni sur GitHub.
> Le site la refuse de toute façon si elle est collée par erreur.
>
> Vous avez un ancien projet avec une clé « anon » (qui commence par `eyJ...`) ?
> Elle marche aussi : utilisez la variable `VITE_SUPABASE_ANON_KEY` à la place.

### 3.6 (Facultatif) Tester en local avec Supabase
```bash
cp .env.example .env     # sous Windows PowerShell : copy .env.example .env
```
Ouvrez `.env` et remplissez :
```
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```
Puis `npm run dev`. Les vidéos viennent maintenant de votre bucket.
Le fichier `.env` ne sera **jamais** envoyé sur GitHub (bloqué par `.gitignore` et par la CI).

---

## 4. Déployer la fonction de statistiques (facultatif)

Cette fonction enregistre chaque clic sur « Commander » (nom de l'offre + type).
Aucune donnée personnelle n'est collectée. Elle vous permet de savoir quelles offres
attirent le plus. Si vous sautez cette étape, le site marche normalement.

**Protections intégrées** : seul votre domaine peut l'appeler, avec votre clé
publishable. Elle limite à 5 requêtes par minute et par visiteur, piège les robots
(honeypot), vérifie strictement les données et refuse tout envoi de plus de 2 Ko.

### Option A : depuis le Dashboard (le plus simple)
1. Menu de gauche : **Edge Functions**, puis **Deploy a new function**, puis **Via Editor**.
2. **Nom** : `order-intent` (exactement).
3. Effacez le code d'exemple, collez **tout** le contenu de
   `supabase/functions/order-intent/index.ts`, puis cliquez sur **Deploy**.
4. Ouvrez la fonction, onglet **Details / Settings** : **désactivez la vérification JWT**
   (option « Verify JWT » / « Enforce JWT verification »).
   → Obligatoire avec les nouvelles clés `sb_publishable_`. La fonction fait
   elle-même la vérification de clé et d'origine, c'est prévu dans son code.

### Option B : en ligne de commande
```bash
npx supabase login
npx supabase link --project-ref XXXX
npx supabase functions deploy order-intent --no-verify-jwt
```

### Réglages de la fonction (secrets)
**Edge Functions**, puis **Secrets**, puis **Add new secret** :

| Nom | Valeur | Obligatoire |
|---|---|---|
| `ALLOWED_ORIGINS` | l'adresse exacte de votre site, ex : `https://vyzio-abc123.vercel.app` (celle affichée par la page `/?diagnostic` de votre site ; plusieurs adresses possibles, séparées par des virgules, sans `/` final) | ✅ Oui |
| `PREVIEW_PREFIX` | `vyzio-` pour autoriser vos previews Vercel (`https://vyzio-xxxx.vercel.app`) | Non |

> ❗ N'ajoutez **pas** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc. :
> Supabase les fournit **automatiquement** à la fonction et refuse les noms
> qui commencent par `SUPABASE_`.

> Vous ne connaissez pas encore l'adresse Vercel ? Faites d'abord l'étape 5, puis revenez ajouter ce secret.
> Sans ce secret, la fonction refuse tous les appels venant d'internet : c'est voulu, par sécurité.

✅ **Vérification** (après l'étape 5) : cliquez sur un bouton « Commander » du site en ligne,
puis dans le SQL Editor :
```sql
select * from public.order_intents order by created_at desc limit 5;
```

---

## 5. Mettre en ligne sur Vercel

> 🆘 **Bloqué avec les variables ?** Lisez `AIDE-VERCEL.md` (version courte, pas à pas), puis ouvrez
> `https://votre-site.vercel.app/?diagnostic` : la page vous dit exactement quoi corriger.

### 5.1 Importer le projet
1. https://vercel.com/new
2. **Import Git Repository**, puis choisissez `vyzio`. Autorisez Vercel à accéder à
   ce dépôt si c'est demandé.
3. Vercel détecte **Vite** tout seul. Ne changez rien :
   - Build Command : `npm run build`
   - Output Directory : `dist`

### 5.2 Ajouter les variables d'environnement
Avant de cliquer sur Deploy, dépliez **Environment Variables** et ajoutez :

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://XXXX.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |

Cochez **Production** et **Preview**.

> Pas encore de Supabase ? Laissez vide : le site marche avec les données locales.
> Vous pourrez les ajouter plus tard.

### 5.3 Déployer
Cliquez sur **Deploy**. Comptez 1 à 2 minutes.

✅ **Vérification** : Vercel affiche l'adresse de votre site, par exemple
`https://vyzio-abc123.vercel.app`. Vous la retrouvez à tout moment en haut de la page
du projet (**Domains**), ou avec le bouton **Visit**.

> 🚨 `https://vyzio.vercel.app` **n'est pas votre site** : ce nom est déjà pris par un autre
> site. N'utilisez cette adresse nulle part.

### 5.4 Renseigner votre adresse
Une fois votre vraie adresse connue, mettez-la à ces endroits :

| Fichier / réglage | Quoi faire |
|---|---|
| `index.html` | ligne `og:image` : remplacez `/og-vyzio.jpg` par `https://VOTRE-ADRESSE/og-vyzio.jpg` (sinon l'aperçu du lien dans WhatsApp et Facebook peut ne pas afficher l'image) |
| `public/robots.txt` | facultatif : décommentez la ligne `Sitemap:` avec votre adresse, et ajoutez un `sitemap.xml` |
| Supabase, secret `ALLOWED_ORIGINS` | votre adresse exacte, sans `/` à la fin |

> Le plus simple : envoyez votre adresse à votre développeur, il met tout à jour d'un coup.

Puis envoyez les modifications :
```bash
git add .
git commit -m "Adresse du site"
git push
```
Vercel redéploie **automatiquement** à chaque `git push`.

> ⚠️ Quand vous **modifiez une variable d'environnement** dans Vercel, il faut
> **redéployer** : Deployments, les 3 points `…` du dernier déploiement, puis **Redeploy**.
> Les variables `VITE_` sont intégrées au moment de la construction du site.

### 5.5 Plan Vercel : à savoir
Le plan gratuit **Hobby** de Vercel est prévu pour un usage **non commercial**.
Pour un site d'entreprise qui vend des services, Vercel demande le plan **Pro**.
Consultez https://vercel.com/pricing et choisissez en connaissance de cause.

---

## 6. Vérifications finales

Testez **sur votre téléphone** (c'est là que sont vos clients) :

- [ ] Le compte à rebours 3-2-1 dure moins de 2 secondes
- [ ] La vidéo d'ouverture tourne en boucle, sans saccade
- [ ] Les 4 vidéos de la section Vidéos démarrent quand elles apparaissent
- [ ] « Activer le son » marche, sur une seule vidéo à la fois
- [ ] Les boutons **Écrire sur WhatsApp** ouvrent WhatsApp vers **+225 05 02 35 41 76**
      avec un message pré-rempli
- [ ] Chaque « Commander » pré-remplit le bon nom d'offre et le prix en €
- [ ] Formule à 11 € : le choix « 4 × 30 s / 2 × 1 min » change bien le message
- [ ] **Écrire un email** ouvre un mail vers **samuelkouassi189@gmail.com**
- [ ] Les 4 téléphones des Réalisations affichent les sites
- [ ] Les tarifs sont en euros

**Contrôles techniques (sur ordinateur)** :
- [ ] Sécurité : https://securityheaders.com, entrez votre adresse → note **A** attendue
- [ ] Performance : Chrome, clic droit, **Inspecter**, onglet **Lighthouse**, **Mobile**, **Analyze**
- [ ] Aperçu de partage : collez votre lien dans WhatsApp → l'image VYZIO doit apparaître

---

## 7. Modifier le site plus tard

### Changer un prix, une FAQ, un projet (sans toucher au code)
*Nécessite Supabase configuré.*
1. Supabase, **Table Editor**, puis choisissez la table (`site_offers`, `video_packs`, `faqs`, `projects`).
2. Double-cliquez sur la cellule, modifiez, puis **Save**.
3. Les visiteurs voient le changement dès leur prochain chargement de page.

> Gardez le format des prix : `38 €` (nombre, espace, €).
> Les caractères `<` et `>` sont refusés par sécurité.

> ⚠️ Le **texte des messages WhatsApp** et les prix des **fonds de secours** sont aussi
> dans `src/data.ts`. Si vous changez un prix dans Supabase, changez-le aussi dans
> `src/data.ts` pour que tout reste cohérent, puis faites un `git push`.

### Remplacer une vidéo
Storage, `videos`, supprimez l'ancien fichier, puis envoyez le nouveau **avec le même nom**.
Les navigateurs peuvent garder l'ancienne version en cache environ 1 heure.

### Modifier le code
```bash
# modifiez vos fichiers, puis :
npm run build        # vérifie que tout compile
git add .
git commit -m "Description de la modification"
git push             # Vercel met en ligne automatiquement
```

**Astuce pro : tester avant de publier**
```bash
git checkout -b essai
# ... modifications ...
git push -u origin essai
```
Vercel crée une **preview** (adresse de test) sans toucher au site principal.
Si tout va bien : sur GitHub, **Pull request**, puis **Merge**.

---

## 8. Sécurité : les règles d'or

Ce qui est déjà en place :

| Protection | Effet |
|---|---|
| `X-Frame-Options: DENY` + CSP | Personne ne peut afficher votre site dans le sien (anti-copie, anti-phishing) |
| Content-Security-Policy stricte | Seuls vos domaines autorisés peuvent charger scripts, vidéos, images |
| HSTS | Connexion toujours en HTTPS |
| RLS Supabase | La clé publique ne peut **que lire** le contenu : aucune modification possible depuis le site |
| Bucket sans policy | Personne ne peut envoyer, supprimer ni lister vos vidéos |
| Garde-fou clé secrète | Le site refuse de démarrer la connexion si une clé `sb_secret_` y est collée |
| Validation des contenus | Liens et textes venant de la base contrôlés (anti-XSS, anti-redirection) |
| Email construit en code | Moins de spam des robots |
| CI GitHub | Bloque les secrets commités et les dépendances vulnérables |

Vos règles à vous :
1. **Jamais** la clé `sb_secret_...` ni le mot de passe de la base dans le code,
   dans Vercel, sur GitHub, ni envoyés par WhatsApp.
2. **Jamais** de fichier `.env` sur GitHub (déjà bloqué, ne forcez pas).
3. **2FA** activée sur GitHub, Vercel et Supabase.
4. Dépôt GitHub en **Private**. N'ajoutez des collaborateurs que si nécessaire.
5. Ne désactivez **jamais** le RLS d'une table dans Supabase.

### En cas de fuite d'une clé
1. Supabase, **Project Settings**, **API Keys** : révoquez la clé et créez-en une nouvelle.
2. Vercel, **Settings**, **Environment Variables** : collez la nouvelle clé publishable.
3. Vercel : **Redeploy**.
4. Supabase, **Logs** : vérifiez qu'il n'y a pas d'activité anormale.

---

## 9. Dépannage

| Problème | Cause probable | Solution |
|---|---|---|
| Les vidéos affichent « Votre navigateur ne lit pas cette vidéo » | Fichiers absents du bucket ou mal nommés | Étape 3.4 : noms exacts, en minuscules. Testez l'URL publique dans le navigateur |
| Les vidéos saccadent | Fichiers trop lourds ou sans « Web Optimized » | Étape 3.3 : réencodez en 720p avec faststart, moins de 8 Mo |
| Upload refusé dans Supabase | Fichier de plus de 50 Mo | Compressez (étape 3.3) |
| CI rouge : « npm audit » | Nouvelle faille découverte dans une dépendance | En local : `npm audit fix`, puis `git add . && git commit -m "maj deps" && git push` |
| CI rouge : « Fichier .env détecté » | Un `.env` a été envoyé | `git rm --cached .env`, commit, push, **puis changez vos clés** (section 8) |
| CI rouge : « Typecheck » | Erreur dans le code modifié | Lancez `npx tsc --noEmit` en local, corrigez la ligne indiquée |
| Vercel : build échoue | Version de Node trop ancienne | Vercel, Settings, Build and Deployment, **Node.js Version : 22.x** |
| Changement de variable Vercel sans effet | Pas de redéploiement | Deployments, `…`, **Redeploy** |
| Prix modifié dans Supabase pas visible | Cache du navigateur | Rechargez 2 fois, ou testez en navigation privée |
| Statistiques vides (`order_intents`) | Fonction absente, JWT activé, ou mauvaise origine | Étape 4 : vérifiez le nom `order-intent`, JWT **désactivé**, `ALLOWED_ORIGINS` = adresse exacte sans `/` final |
| Site cassé après plusieurs semaines sans visite | Projet Supabase gratuit **mis en pause** après une période d'inactivité | Supabase Dashboard, **Restore project**. Passez au plan payant pour éviter les pauses |
| Page blanche | Erreur JavaScript | Normalement impossible (écran de secours intégré). Sinon : F12, onglet Console, notez l'erreur |

**Quotas du plan gratuit Supabase** : la bande passante mensuelle est limitée.
Des vidéos légères (étape 3.3) permettent de servir beaucoup plus de visiteurs.
Surveillez **Project Settings → Usage**.

---

## 10. Nom de domaine personnalisé (facultatif)

1. Achetez un domaine (par exemple `vyzio.fr`) chez un registrar (OVH, Gandi, Namecheap…)
   ou directement dans Vercel, **Domains**.
2. Vercel, votre projet, **Settings**, **Domains**, **Add**, puis entrez votre domaine.
3. Suivez les instructions DNS affichées par Vercel. Le certificat HTTPS est automatique.
4. Mettez à jour les 4 endroits listés à l'**étape 5.4** avec votre nouveau domaine.
5. Supabase, secret `ALLOWED_ORIGINS` : ajoutez `https://vyzio.fr,https://www.vyzio.fr`.

---

## Récapitulatif des fichiers importants

| Fichier | Rôle |
|---|---|
| `src/data.ts` | Contacts (WhatsApp, email), prix de secours, messages WhatsApp |
| `src/lib/supabase.ts` | Connexion Supabase (lecture seule) |
| `src/lib/content.ts` | Chargement du contenu, cache, anti-saccade |
| `src/lib/security.ts` | Validation des liens et des textes |
| `src/lib/order.ts` | Envoi des statistiques de clics |
| `supabase/schema.sql` | Création de la base (à coller dans le SQL Editor) |
| `supabase/functions/order-intent/index.ts` | Fonction serveur des statistiques |
| `vercel.json` | Protections de sécurité + cache |
| `.github/workflows/ci.yml` | Contrôle automatique à chaque envoi |
| `.env.example` | Modèle des variables (sans valeur secrète) |

**Contacts du site** : WhatsApp `https://wa.me/2250502354176`, email `samuelkouassi189@gmail.com`.
