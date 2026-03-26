# AI DEVELOPMENT RULES — ADUTI

## Stack Obligatoire

- Next.js
- Supabase
- Tailwind CSS
- shadcn/ui
- lucide-react

---

## UI

Avant de créer un composant :

1. Vérifier shadcn
2. Utiliser composant existant
3. Respecter UI_GUIDELINES.md

---

## Backend

- Utiliser Supabase uniquement
- Respecter DATABASE_SCHEMA.md
- Respecter BUSINESS_RULES.md

---

### Règles Prisma

- Toujours utiliser Prisma pour accéder aux données côté serveur
- Ne jamais écrire de requêtes SQL directes sauf cas validé
- Toujours utiliser les types générés par Prisma
- Toute modification du modèle doit passer par prisma migration


## Architecture

- Séparer logique UI / logique métier
- Ne jamais implémenter logique métier sans vérifier BUSINESS_RULES.md

---

✅ Consigne : Gestion de la base de données

Dans ce projet, nous utilisons Supabase et Prisma ensemble.

Supabase est utilisé pour :

L’authentification

Le stockage de fichiers

Le realtime

L’hébergement de la base PostgreSQL

Prisma est utilisé pour :

La communication avec la base de données

La gestion des modèles de données

L’écriture de requêtes côté serveur

La gestion des migrations

⚠️ Prisma doit être utilisé uniquement côté serveur pour des raisons de sécurité.

✅ Consigne : Gestionnaire de paquets

Dans ce projet, nous utilisons pnpm comme gestionnaire de dépendances.

Toutes les commandes d’installation doivent utiliser pnpm :

pnpm install
pnpm add <package>
pnpm remove <package>
pnpm dev


❌ Ne pas utiliser :

npm

yarn

## Génération Code

Toujours :

- Vérifier dépendances existantes
- Réutiliser composants existants
- Respecter structure projet

Avant chaque réponse :
- analyser règles projet
- vérifier architecture existante
- proposer solution cohérente
- expliquer choix technique