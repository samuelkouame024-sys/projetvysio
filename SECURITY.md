# Politique de sécurité — VYZIO

## Protections en place

| Menace | Protection |
|---|---|
| Site embarqué ailleurs (copie, phishing) | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| Chargement de scripts/médias étrangers | CSP stricte (`vercel.json`) : seuls les domaines listés sont autorisés |
| Interception réseau | HSTS preload + `upgrade-insecure-requests` |
| Fuite de secrets | `.env` ignoré par Git ; CI qui bloque les `.env` et les clés `sb_secret_` ; le client refuse une clé secrète |
| Modification du contenu depuis le site | RLS sur toutes les tables : la clé publishable ne peut que **lire** |
| Upload/suppression/listing des vidéos | Bucket public **sans aucune policy** sur `storage.objects` |
| Lecture des statistiques | `order_intents` : RLS sans policy + `revoke all` pour `anon`/`authenticated` |
| XSS via le contenu de la base | Textes bornés, `<` `>` refusés, URLs validées par allowlist, aucun `innerHTML` |
| Redirection malveillante | Liens `wa.me` reconstruits depuis un numéro validé |
| Abus de la fonction de statistiques | Origine autorisée (`ALLOWED_ORIGINS`), clé publishable vérifiée, 5 requêtes/min/IP, honeypot, 2 Ko max |
| Spam email | Adresse assemblée en JavaScript |
| Dépendances vulnérables | `npm audit --audit-level=high` à chaque push |

## Règles pour toute modification

1. Ne jamais commiter : `.env`, clé `sb_secret_...` / `service_role`, mot de passe de la base.
2. Ne jamais désactiver le RLS ni ajouter de policy d'écriture publique.
3. Toute nouvelle écriture en base passe par une Edge Function qui valide les données.
4. Toute URL externe passe par `src/lib/security.ts` et est ajoutée à la CSP de `vercel.json`.
5. Pas de `eval`, pas de `innerHTML`, pas de `target="_blank"` sans `rel="noopener"`.

## En cas de fuite d'une clé

1. Supabase, Project Settings, API Keys : révoquer la clé, en créer une nouvelle.
2. Vercel, Settings, Environment Variables : mettre à jour.
3. Vercel : Redeploy.
4. Supabase, Logs : vérifier l'activité.

## Signaler une faille

Email : **samuelkouassi189@gmail.com**, objet `[SECURITÉ VYZIO]`.
Merci de ne pas publier la faille avant correction.
