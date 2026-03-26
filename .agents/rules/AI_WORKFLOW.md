🎯 Objectif

Ce fichier définit la méthode que l’IA doit suivre avant de coder quoi que ce soit.
L’objectif est :

Éviter les hallucinations

Respecter la documentation officielle

Maintenir la cohérence avec l’architecture du projet

Utiliser correctement Supabase, Prisma, shadcn/ui, Radix, lucide-react

1️⃣ Analyse initiale du projet

Avant toute action, l’IA doit :

Lire le README.md

Lire les règles AI_RULES.md

Identifier le stack utilisé :

Frontend : Next.js / React

Backend : Supabase + Prisma

UI : shadcn/ui + lucide-react (Radix UI si besoin)

Vérifier les dépendances installées dans package.json

Vérifier la version des librairies


2️⃣ Vérification de la documentation (Documentation First)

Pour chaque librairie ou framework :

Vérifier la documentation officielle (URL ou docs locales)

Identifier la version exacte utilisée dans le projet

Vérifier si la fonctionnalité / composant existe réellement

Ne jamais inventer une API ou un composant

Si incertitude, demander confirmation ou proposer plusieurs options

💡 Exemples :

shadcn/ui → vérifier si le composant existe avant de le créer

Prisma → vérifier le modèle ou la migration côté serveur

Supabase → vérifier les méthodes auth / storage / realtime


3️⃣ Priorité aux solutions natives

L’IA doit :

Utiliser les composants et API officiels

Ne jamais recréer un composant existant dans shadcn/ui ou Radix UI

Créer un composant custom uniquement si aucune solution native n’existe

⚠️ Ne jamais mélanger plusieurs librairies pour un même composant si une seule suffit

4️⃣ Gestion des modèles de données

Pour chaque modèle de données :

Vérifier le schema Prisma (prisma/schema.prisma)

Vérifier la base Supabase (PostgreSQL sur le VPS)

Ne coder que des requêtes côté serveur via Prisma

Tout accès à la DB côté client doit passer par Supabase Auth sécurisée

Vérifier que les migrations sont à jour


5️⃣ Validation des composants UI

Pour chaque composant :

Vérifier si le composant existe déjà dans shadcn/ui

Sinon, vérifier Radix UI

Sinon, créer un composant custom avec justification

Utiliser lucide-react uniquement pour les icônes

Respecter l’accessibilité et la cohérence visuelle (taille, couleurs, spacing)


6️⃣ Gestion des fonctionnalités

Pour chaque fonctionnalité à coder :

Vérifier les règles business dans BUSINESS_RULES.md

Vérifier les contraintes UI/UX dans UI_GUIDELINES.md

Vérifier les types avec Zod (validation côté serveur et client)

Vérifier la cohérence avec le modèle de données

Vérifier si la fonctionnalité nécessite auth/admin/super admin

Implémenter côté frontend ou backend selon les règles

7️⃣ Gestion des variables sensibles

.env.local → toutes les variables sensibles : SUPABASE_URL, SUPABASE_ANON_KEY

L’IA ne doit jamais exposer de clés côté client

Utiliser dotenv pour charger les variables

8️⃣ Workflow CI/CD

Vérifier si le projet est configuré pour GitHub Actions

Avant chaque push :

ESLint + Prettier pour le linting

Tests unitaires (si existants)

Après push → Coolify / pipeline déclenche automatiquement le déploiement

9️⃣ Mode anti-hallucination

L’IA doit toujours citer la source (docs, site officiel)

Ne jamais inventer une API

Si elle n’est pas sûre → STOP et demande confirmation

Vérifier la cohérence avant chaque commit

🔟 Règles UI spécifiques (shadcn / Radix / lucide)

shadcn/ui → composant obligatoire si existant

Radix → utiliser uniquement si shadcn n’a pas le composant

lucide-react → uniquement pour icônes

Ne jamais créer de doublon

Toujours respecter l’accessibilité

❌ Étapes CI/CD et GitHub Actions : hors scope pour l’instant