# Activer la CI GitHub (30 secondes)

Le fichier `ci.yml` de ce dossier est le contrôle automatique du projet
(scan des secrets, audit de sécurité, typecheck, build, headers Vercel).

Il n'a pas pu être envoyé directement à sa place, parce que le token utilisé
n'avait pas la permission `workflow`. Pour l'activer, depuis le site GitHub :

1. Ouvrez `ci/ci.yml` dans votre dépôt GitHub.
2. Cliquez sur le crayon ✏️ (**Edit this file**).
3. En haut, dans le champ du nom de fichier, remplacez `ci/ci.yml` par :
   ```
   .github/workflows/ci.yml
   ```
   Astuce : placez le curseur au tout début du nom et effacez avec la touche
   Retour arrière pour remonter d'un dossier, puis tapez le nouveau chemin.
4. Cliquez sur **Commit changes…**, puis encore sur **Commit changes**.
5. Onglet **Actions** : le contrôle se lance. Attendez la coche verte ✔.

Vous pouvez ensuite supprimer ce fichier `ci/LISEZMOI.md`.
