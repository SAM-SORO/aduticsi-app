# Migration Supabase Cloud → self-hosted

Bascule de l'application ADUTI depuis l'instance Supabase Cloud
(`nqofzuoozxnwyylxidne.supabase.co`) vers l'instance self-hosted
`https://supabase.aduticsi.com`.

---

## 1. Ce qui a changé dans le code

| Fichier | Changement |
|---|---|
| `next.config.ts` | Le hostname des images n'est plus écrit en dur : il est **dérivé de `NEXT_PUBLIC_SUPABASE_URL`** au build. L'ancien domaine reste whitelisté **temporairement**, le temps que le script SQL soit exécuté. |
| `scripts/migrate-storage-urls.sql` | **Nouveau.** Réécrit les URLs Storage absolues stockées en base. |
| `.env.example` | Complété (variables manquantes documentées) et pointé sur le self-hosted. |
| `.gitignore` | Ajout de `.env.cloud.backup`. |
| `.agents/rules/SUPABASE_SETUP.md` | Bandeau d'obsolescence + **retrait des mots de passe en clair**. |
| `.agents/workflows/supabase-prisma-config.md` | Bandeau d'obsolescence + retrait des identifiants. |

**Aucun changement n'a été nécessaire** dans `lib/supabase/{client,server,admin,middleware}.ts` :
l'initialisation est entièrement pilotée par les variables d'environnement.

---

## 2. Variables d'environnement

### 2.1 En local — `.env.local`

| Variable | Action |
|---|---|
| `DATABASE_URL` | 🔄 **remplacer** — Postgres self-hosted |
| `DIRECT_URL` | 🔄 **remplacer** — Postgres self-hosted |
| `NEXT_PUBLIC_SUPABASE_URL` | 🔄 `https://supabase.aduticsi.com` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🔄 **nouvelle clé** (nouveau JWT secret) |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔄 **nouvelle clé** (nouveau JWT secret) |
| `NEXT_PUBLIC_BASE_URL` | ✅ inchangé |
| `SMTP_*` | ✅ inchangé (Resend, indépendant de Supabase) |
| `*_TURNSTILE_*` | ✅ inchangé |

> ⚠️ Les clés `anon` et `service_role` doivent **impérativement** provenir du même
> JWT secret que celui configuré sur l'instance self-hosted. Une clé issue de
> l'ancien secret produira des `401 Invalid JWT` sur toutes les requêtes.

Sauvegarde des anciennes valeurs : `.env.cloud.backup` (gitignoré).

### 2.2 En production — Coolify

Les mêmes 5 variables sont à modifier dans **Coolify → l'application → Environment Variables**.

> 🚨 **Point critique Coolify** : les variables préfixées `NEXT_PUBLIC_` sont inlinées
> dans le bundle JavaScript **au moment du build**. Elles doivent donc être marquées
> comme **disponibles au build** (case « Build Variable » / « Available at build time »),
> pas seulement au runtime. Sinon `next build` compile des valeurs vides et le client
> échouera avec `supabaseUrl is required` dans le navigateur.

Variables concernées par le build (cf. les `ARG` du `Dockerfile`) :
`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

`SUPABASE_SERVICE_ROLE_KEY` est **runtime uniquement** (jamais exposé au client).

---

## 3. Prérequis côté serveur Supabase self-hosted

À vérifier **avant** la bascule :

- [ ] **Auth / Redirect URLs** — dans le `.env` de la stack Supabase :
      - `SITE_URL=https://aduticsi.com`
      - `ADDITIONAL_REDIRECT_URLS=https://aduticsi.com/auth/callback,http://localhost:3000/auth/callback`

      Sans cela, l'email de confirmation d'inscription et le lien de réinitialisation
      de mot de passe redirigeront vers la mauvaise origine.
- [ ] **Templates d'email** — l'application supporte **deux flux** :
      `exchangeCodeForSession` (PKCE, `?code=`) dans `app/auth/callback/route.ts`,
      et `verifyOtp` (`token_hash`) dans `app/auth/actions.ts:244`.
      Le template GoTrue doit produire l'un des deux formats.
- [ ] **Buckets publics** — `membres_images`, `activity_images`,
      `publications_images`, `partenaires_logo` (+ le 5e) doivent être marqués
      **public**, sinon `getPublicUrl()` renverra des URLs en 400.
- [ ] **SSL Postgres** — `lib/prisma.ts:16` utilise `ssl: { rejectUnauthorized: false }`.
      Si le Postgres self-hosted n'expose **pas** SSL du tout, passer à `ssl: false`.

---

## 4. Ordre d'exécution

1. Vérifier les prérequis de la section 3.
2. `pg_dump "<DATABASE_URL>" > backup-avant-migration.sql`
3. Mettre à jour `.env.local`, lancer `pnpm dev`, dérouler le plan de test (section 5).
4. Exécuter `psql "<DATABASE_URL>" -f scripts/migrate-storage-urls.sql`
   (vérifier que `restant_cloud` vaut **0** partout avant le `COMMIT`).
5. Mettre à jour les variables dans Coolify, redéployer.
6. Rejouer le plan de test en production.
7. **Nettoyage final** : retirer le bloc `nqofzuoozxnwyylxidne.supabase.co` de
   `next.config.ts`, puis supprimer `.env.cloud.backup`.

---

## 5. Plan de test manuel

### 5.1 Authentification
- [ ] **Login d'un membre existant** — `/auth/login` avec un des 35 comptes migrés.
      Attendu : redirection vers `/dashboard`, nom affiché dans la navbar.

      ⚠️ *Toutes les sessions en cours sont invalidées par la bascule (les cookies
      `sb-<ref>-auth-token` changent de nom). Une reconnexion est normale.*
- [ ] **Membre absent de la table `Member`** — doit être refusé avec
      « Accès refusé. Seuls les membres de l'association peuvent se connecter. »
- [ ] **Logout** puis retour sur `/dashboard` : redirection vers `/auth/login`
      (test du middleware `proxy.ts`).

### 5.2 Inscription + email de confirmation
- [ ] Générer un lien d'invitation (`/dashboard/super-admin/invitations`).
- [ ] S'inscrire via ce lien avec une adresse réelle.
- [ ] **Réception de l'email de confirmation** depuis le SMTP self-hosted.
- [ ] Cliquer le lien : atterrissage sur `/auth/callback` **sans** `auth-code-error`.
- [ ] Vérifier que le membre est bien créé dans la table `Member` (avec son `slug`).
- [ ] Vérifier l'animation de bienvenue (`?welcome=true`).

### 5.3 Réinitialisation de mot de passe
- [ ] `/auth/forgot-password` : email reçu.
- [ ] Lien vers `/auth/reset-password`, changer le mot de passe.
- [ ] Se reconnecter avec le nouveau mot de passe.

### 5.4 Storage — affichage des images
- [ ] `/members` et `/members/[slug]` : **photos de profil** visibles.
- [ ] `/activities` et `/activities/[id]` : **images d'activités et de publications**
      visibles dans la galerie (ouvrir le lightbox, naviguer entre les images).
- [ ] Page d'accueil : **logos partenaires** visibles.
- [ ] 🔍 Ouvrir l'onglet réseau : vérifier **aucune erreur 400 sur `/_next/image`**
      (symptôme d'un hostname non whitelisté).
- [ ] **Après** exécution du SQL : vérifier que les `src` pointent bien sur
      `supabase.aduticsi.com` et non plus sur l'ancien domaine.

### 5.5 Storage — upload
- [ ] `/profile` : changer sa photo de profil (recadrage + upload).
      L'image s'affiche immédiatement, la nouvelle URL contient `supabase.aduticsi.com`.
- [ ] Super-admin : créer une **activité avec image**.
- [ ] Super-admin : créer une **publication avec plusieurs images** (vérifier l'ordre).
- [ ] Super-admin : ajouter un **partenaire avec logo**.
- [ ] Super-admin : **supprimer** une de ces entités et vérifier dans Supabase Studio
      que le fichier a bien disparu du bucket (teste la clé `service_role`).

### 5.6 Formulaire de contact (`ContactMessage`)
- [ ] `/contact` : envoyer un message (valider le captcha Turnstile).
- [ ] Vérifier la création de la ligne dans la table `ContactMessage`.
- [ ] Vérifier la **réception de l'email de notification**.
- [ ] `/dashboard/messages` : le message apparaît dans l'inbox.
- [ ] **Répondre** au message depuis l'inbox : email de réponse reçu.
- [ ] Tester la limite anti-spam (plusieurs envois consécutifs).

### 5.7 Administration (service_role)
- [ ] Super-admin : **supprimer un membre de test**.
      Vérifier qu'il disparaît de la table `Member` **et** de `auth.users`
      (`supabaseAdmin.auth.admin.deleteUser`, `members/actions.ts:165`).
      C'est le test le plus révélateur d'une `SUPABASE_SERVICE_ROLE_KEY` invalide.
