# Vercel + variables : la méthode simple

## ⚠️ Étape 0 : mettre le code corrigé sur GitHub
Vercel construit le site **à partir de GitHub**. Les corrections d'aujourd'hui doivent y être, sinon Vercel utilise l'ancienne version.

1. Ouvrez https://github.com/samuelkouassi189-sudo/vyzio
2. Cliquez sur **Add file → Upload files**.
3. Depuis votre ordinateur, **glissez le dossier `src`** entier dans la page (GitHub garde les sous-dossiers et remplace les anciens fichiers). Ajoutez aussi les fichiers `.md` : `AIDE-VERCEL.md`, `GUIDE-DEPLOIEMENT.md`, `LANCEMENT-RESEAUX.md`, `FICHE-VYZIO-ET-PUB-REDDIT.md`.
4. Cliquez sur **Commit changes**.
5. Vercel redéploie tout seul (si le projet est déjà connecté).

> ❗ Glissez le **dossier `src`**, pas le dossier du projet entier. Sinon GitHub crée un sous-dossier (`vyzio/src/...`) et Vercel ne trouve plus rien.

---

## Étape 1 : les 2 valeurs à copier dans Supabase

| Valeur | Où la trouver dans Supabase | Elle ressemble à |
|---|---|---|
| **URL** | Project Settings (roue crantée) → **Data API** → « Project URL » | `https://abcdefghijk.supabase.co` |
| **Clé** | Project Settings → **API Keys** → « **Publishable** key » | `sb_publishable_xxxxxxxx` |

🚫 **Ne prenez PAS** :
- l'adresse de la barre du navigateur (`supabase.com/dashboard/project/...`) : ce n'est pas l'URL du projet ;
- la « **Secret** key » (`sb_secret_...`) : elle est dangereuse et le site la refuse.

---

## Étape 2 : les mettre dans Vercel

1. Vercel → votre projet **vyzio** → **Settings** → **Environment Variables**.
2. Ajoutez **2 lignes**, en copiant les noms **exactement** (majuscules, avec `VITE_` au début) :

| Key (nom) | Value (valeur) |
|---|---|
| `VITE_SUPABASE_URL` | votre URL `https://....supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | votre clé `sb_publishable_...` |

3. **Environments** : cochez **Production** ET **Preview** (et Development si proposé).
4. Cliquez sur **Save**.

> Ancien projet Supabase avec une clé « anon » qui commence par `eyJ...` ? Mettez-la dans une variable nommée `VITE_SUPABASE_ANON_KEY` à la place. Ça marche aussi.

---

## Étape 3 : REDÉPLOYER (l'oubli n°1)
Les variables ne s'appliquent **qu'au prochain déploiement**.

1. Onglet **Deployments**.
2. Sur la ligne du haut, cliquez sur les **3 points `…`** → **Redeploy** → **Redeploy**.
3. Attendez environ 1 minute que le statut passe à **Ready**.

---

## Étape 4 : trouver VOTRE adresse, puis vérifier

### 🚨 Attention : `vyzio.vercel.app` n'est PAS votre site
Cette adresse appartient à un **autre site** (espagnol, « Bymyzai »). Si vous l'avez ouverte, vous n'étiez pas sur votre site.
Vercel donne une adresse différente quand le nom est déjà pris.

### Trouver votre vraie adresse
1. Vercel → cliquez sur votre projet **vyzio**.
2. En haut de la page du projet, regardez **Domains** : c'est votre adresse (elle se termine par `.vercel.app`, par exemple `vyzio-abc123.vercel.app`).
3. Ou cliquez sur le bouton **Visit** : l'adresse s'affiche dans la barre du navigateur.

> Pas de bouton Visit ni de Domains ? Le premier déploiement n'est pas encore terminé (voir « Le déploiement est long » plus bas).

### Vérifier
Ajoutez `/?diagnostic` à la fin de **votre** adresse :

```
https://VOTRE-ADRESSE.vercel.app/?diagnostic
```

La page vous dit, en français, ce qui est bon ✅ et ce qui ne va pas ❌, avec **ce qu'il faut faire** pour chaque problème :
- les 2 variables sont-elles bien reçues ?
- la clé est-elle la bonne ?
- les tables existent-elles (le fichier `schema.sql` a-t-il été lancé) ?
- chacune des 5 vidéos est-elle bien dans Supabase ?

---

## Le déploiement est long ⏳

**Durée normale pour ce site : 30 secondes à 1 min 30.**
J'ai mesuré : l'installation prend environ 2 secondes, la construction 3 secondes, et l'outil officiel de Vercel termine en 6 secondes. Si vous attendez plus longtemps, ce n'est **pas le code** : c'est une file d'attente ou un souci chez Vercel.

### Regardez le mot écrit à côté du déploiement (onglet Deployments)

| Statut affiché | Ce que ça veut dire | Quoi faire |
|---|---|---|
| **Queued** (en attente) | Il attend son tour. Plan gratuit = **un seul déploiement à la fois** | Voir « File d'attente » ci-dessous |
| **Initializing** ou **Building** depuis plus de 5 min | Bloqué chez Vercel | Cliquez sur les **…** → **Cancel**, puis **Redeploy** |
| **Building** depuis moins de 2 min | Normal | Patientez |
| **Error** (rouge) | La construction a échoué | Cliquez dessus → **Build Logs** → envoyez-moi la **première** ligne rouge |
| **Ready** (vert) | Terminé ✅ | Ouvrez le site. Pas les derniers changements ? Rechargez en navigation privée |
| **Canceled** | Remplacé par un déploiement plus récent | Normal, rien à faire |
| Aucun nouveau déploiement n'apparaît | Vercel n'a pas vu votre envoi GitHub | Vercel → Settings → **Git** : vérifiez que le dépôt `vyzio` est bien connecté |

### File d'attente : pourquoi ça arrive
Chaque fois que vous cliquez sur **Commit changes** sur GitHub, Vercel lance un déploiement.
Si vous avez envoyé vos fichiers **en 4 fois**, il y a **4 déploiements** qui passent **l'un après l'autre**.

**Pour débloquer tout de suite :**
1. Onglet **Deployments**.
2. Annulez les anciens déploiements en attente : les **…** → **Cancel**. Seul le **plus récent** compte.
3. Sur le plus récent : les **…** → **Start Building Now** (s'il est proposé).

**Pour éviter ça la prochaine fois :**
- Envoyez **tous vos fichiers en une seule fois**, dans un seul « Commit changes ».
- Vous ajoutez les **variables** ? Mettez **les 2 variables d'abord**, puis faites **un seul** Redeploy à la fin.

### Toujours bloqué malgré tout ?
Vercel a parfois des pannes. Regardez **https://www.vercel-status.com** : si un problème « Builds » ou « Deployments » est affiché, attendez que ce soit réglé. Vous n'avez rien à changer de votre côté.

---

## Les problèmes les plus fréquents

| Ce que vous voyez | Cause | Solution |
|---|---|---|
| Diagnostic : « Variable … absente » | Nom mal écrit (sans `VITE_`, faute de frappe) ou pas de Redeploy | Corrigez le nom exactement comme dans le tableau de l'étape 2, puis **Redeploy** |
| Diagnostic : « Mauvaise adresse » | Vous avez collé l'adresse du Dashboard | Prenez « Project URL » dans Data API (étape 1) |
| Diagnostic : « clé SECRÈTE » | Vous avez collé `sb_secret_...` | Supprimez-la de Vercel, **révoquez-la** dans Supabase, mettez la Publishable key, Redeploy |
| Diagnostic : « Clé refusée » | URL et clé viennent de 2 projets différents | Recopiez les deux depuis le **même** projet |
| Diagnostic : « Les tables n'existent pas » | `schema.sql` pas lancé | Supabase → SQL Editor → collez `supabase/schema.sql` → Run |
| Diagnostic : « Vidéo introuvable » | Fichier pas envoyé ou mal nommé | Storage → bucket `videos` → envoyez `presentation.mp4`, `video-1.mp4` … `video-4.mp4` (minuscules exactes). **Le site marche quand même** : il utilise vos vidéos d'origine en attendant. |
| Vercel : « Build Failed » + « No package.json » ou « Could not find » | Le code est dans un sous-dossier sur GitHub | Vercel → Settings → Build and Deployment → **Root Directory** : mettez le nom du sous-dossier (ou remettez les fichiers à la racine du dépôt) |
| Vercel : « Build Failed » avec une erreur de Node | Version de Node trop ancienne | Vercel → Settings → Build and Deployment → **Node.js Version : 22.x**, puis Redeploy |
| Le site en ligne n'a pas les dernières modifications | Les fichiers corrigés ne sont pas sur GitHub | Refaites l'**étape 0** |

---

## Ce que j'ai corrigé dans le code

- **Avant** : dès que vous ajoutiez les variables, le site cherchait les vidéos dans votre Supabase. Si elles n'y étaient pas encore, les vidéos affichaient une erreur et le site semblait cassé.
- **Maintenant** : si une vidéo manque dans Supabase, le lecteur **bascule tout seul** sur la vidéo d'origine. Le visiteur ne voit rien.
- **Variables mal copiées acceptées** : guillemets autour, espaces, retour à la ligne, adresse avec `/rest/v1/` à la fin, ou « NOM=valeur » collé en entier.
- **Nouvelle page `/?diagnostic`** pour voir exactement ce qui ne va pas.

Tout a été testé dans un vrai navigateur : avec un Supabase vide, les 5 vidéos basculent sur les liens d'origine, sans aucune erreur.

---

## Toujours bloqué ?
Envoyez-moi **une capture** de :
1. la page `/?diagnostic` de votre site ;
2. ou le message d'erreur rouge de Vercel (onglet Deployments → cliquez sur le déploiement en échec → **Build Logs**).

⚠️ Sur vos captures, **masquez la clé secrète** si elle apparaît. La clé publishable et l'URL peuvent être montrées sans danger.
