# Guide : Configuration de la connexion Supabase pour Prisma

## 📋 Étapes à suivre

### 1. Créer l'utilisateur Prisma dans Supabase

1. **Ouvrez votre projet Supabase** : https://supabase.com/dashboard/project/nqofzuoozxnwyylxidne

2. **Allez dans le SQL Editor** :
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Ou accédez directement à : https://supabase.com/dashboard/project/nqofzuoozxnwyylxidne/sql

3. **Créez une nouvelle requête** :
   - Cliquez sur "+ New query"

4. **Copiez et exécutez le script SQL** :
   - Ouvrez le fichier
     [create-prisma-user.sql](file:///c:/Users/SAM/Documents/dev_app/aduti-app/prisma/create-prisma-user.sql)
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL de Supabase
   - Cliquez sur "Run" ou appuyez sur `Ctrl+Enter`

5. **Vérifiez la création** :
   - Vous devriez voir un message de succès
   - L'utilisateur `prisma` est maintenant créé avec tous les privilèges nécessaires

### 2. Tester la connexion Prisma

Une fois l'utilisateur créé, exécutez dans votre terminal :

```bash
pnpm prisma db push
```

Cette commande devrait maintenant fonctionner et créer toutes les tables dans votre base de données
Supabase.

### 3. Générer le client Prisma

Après la création des tables, générez le client Prisma :

```bash
pnpm prisma generate
```

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. **Dans Supabase Dashboard** :
   - Allez dans "Table Editor"
   - Vous devriez voir les tables : `Member`, `Promotion`, `Activity`, `AdminAssignment`

2. **Dans votre code** :
   - Le client Prisma sera généré dans `node_modules/@prisma/client`
   - Vous pourrez l'utiliser via `import { prisma } from '@/lib/prisma'`

## 🔐 Sécurité

- ✅ L'utilisateur `prisma` utilise le même mot de passe que votre base de données
- ✅ Les permissions sont limitées au schéma `public`
- ✅ Le mot de passe est encodé en URL dans `.env.local` (`@` → `%40`)

## 📝 Configuration finale

Votre fichier `.env.local` est maintenant configuré avec :

```bash
# Connexion directe avec utilisateur prisma (pour migrations)
DATABASE_URL="postgresql://prisma:Clover@@MyPg@db15@db.nqofzuoozxnwyylxidne.supabase.co:5432/postgres"

# Connexion poolée pour production (optionnel)
POOLED_DATABASE_URL="postgres://postgres.nqofzuoozxnwyylxidne:Clover@@MyPg@db15@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

## ⚠️ En cas de problème

Si la commande `pnpm prisma db push` échoue toujours :

1. Vérifiez que le script SQL s'est bien exécuté sans erreur
2. Vérifiez que le mot de passe dans `.env.local` est correct
3. Essayez de vous connecter manuellement avec un client PostgreSQL pour tester

## 🚀 Prochaines étapes

Une fois la connexion établie :

1. ✅ Les tables seront créées dans Supabase
2. ✅ Le client Prisma sera généré
3. ✅ Vous pourrez implémenter l'authentification Supabase
4. ✅ Vous pourrez commencer à développer les fonctionnalités
