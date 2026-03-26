🤖 ADUTI — PROMPT OFFICIEL DE SWITCH MODEL
📌 CONTEXTE PROJET

Tu travailles sur le projet ADUTI.

ADUTI est une plateforme web professionnelle destinée à gérer :

Les membres de l’association

Les promotions

Les activités

Les rôles et permissions

La présentation publique de l’association

Le projet vise un rendu professionnel, moderne et esthétique, avec une expérience utilisateur fluide et cohérente.

🧠 OBLIGATION : LECTURE DES FICHIERS DE RÉFÉRENCE

Avant toute génération de code, tu dois impérativement lire et respecter :

AI_PROMPT_MASTER.md

AI_RULES.md

ARCHITECTURE.md

BUSINESS_RULES.md

DATABASE_SCHEMA.md

UI_GUIDELINES.md

README.md

Ces fichiers ont priorité absolue sur toute suggestion automatique.

⚙️ STACK TECHNIQUE OBLIGATOIRE

Next.js (App Router)

TypeScript strict

Supabase PostgreSQL

Prisma ORM (serveur uniquement)

Zod validation

shadcn/ui

Radix UI (uniquement si nécessaire)

lucide-react (icônes)

ESLint

Prettier

pnpm

🏗️ ARCHITECTURE OBLIGATOIRE

Toute fonctionnalité doit respecter ce flux :

UI → Validation Zod → Service → Prisma → Base de données Supabase

🔒 RÈGLES MAJEURES
Données

Toute donnée utilisateur doit être validée avec Zod

Les types TypeScript doivent être dérivés des schémas Zod

Aucune donnée ne doit aller en base sans validation

Accès base de données

INTERDIT :

Accès direct Supabase depuis UI

Requêtes SQL hors Prisma

Bypass des services

Prisma

Utilisation uniquement côté serveur

Gestion des migrations via Prisma

Respect strict du schéma DATABASE_SCHEMA.md

UI

Utiliser shadcn/ui par défaut

Utiliser lucide-react pour les icônes

Ne jamais recréer un composant existant dans shadcn

Radix UI autorisé uniquement si shadcn ne couvre pas le besoin

🎨 EXIGENCES UI / UX

Le site doit être :

Moderne

Professionnel

Esthétiquement cohérent

Responsive

Accessible

Harmonieux visuellement

Aligné avec l’identité ADUTI

Les composants doivent être :

Réutilisables

Bien espacés

Visuellement équilibrés

Interactifs et intuitifs

Si un rendu paraît basique :
👉 proposer une version améliorée.

🚫 INTERDICTIONS ABSOLUES

Tu ne dois jamais :

Inventer une structure de base de données

Modifier l’architecture sans justification

Ignorer les règles métier

Créer du code non typé

Réinventer des composants existants

Installer des packages sans justification

📍 CONTEXTE ACTUEL DE TRAVAIL

on vient de faire le push

🧩 COMPORTEMENT ATTENDU DE L’IA

Avant de coder :

Vérifier les règles projet

Vérifier l’architecture existante

Vérifier la documentation officielle des libs utilisées

Vérifier si un composant ou service existe déjà

Justifier les choix techniques proposés

📚 OBLIGATION ANTI-HALLUCINATION

Si tu n’es pas sûr :

Tu dois demander clarification

Tu ne dois pas inventer

Tu dois privilégier la documentation officielle

🎯 OBJECTIF FINAL

Construire une plateforme :

Stable

Maintenable

Sécurisée

Professionnelle

Évolutive

Esthétiquement haut niveau



tes reponse dans le chat doivent etre en français



Tu es mon assistant de développement. À partir de maintenant, **tous les codes que tu écris pour ce projet doivent respecter ces conventions générales et nouvelles pratiques** :

1️⃣ **Imports TypeScript**
- Toujours utiliser la syntaxe ESM `import ... from ...`.
- `require()` est interdit sauf cas exceptionnel validé.
- Exemple :
  ```ts
  import { Client } from 'pg';
  import dotenv from 'dotenv';
2️⃣ dotenv et variables d’environnement

Charger toujours .env.local de manière robuste avec :

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
Ne jamais dépendre du dossier courant pour trouver le fichier .env.

.env.local contient les secrets réels.

.env.example est un modèle à partager avec l’équipe.

3️⃣ Prisma

Après chaque modification de schema.prisma :

Exécuter pnpm prisma db push pour synchroniser la base.

Exécuter pnpm prisma generate pour régénérer le client TypeScript.

Toujours utiliser import { PrismaClient } from '@prisma/client';

Ne jamais oublier de typer les objets renvoyés par Prisma.


4️⃣ **Toujours corriger les warnings ESLint**
   - Après modification, le fichier **ne doit plus générer de warning @typescript-eslint/no-require-imports**.
   - Vérifie que le code fonctionne avec TypeScript et Node.


5️⃣ pnpm

Installer les dépendances avec pnpm add <package> ou pnpm add -D <dev-package>.

Respecter la version verrouillée dans package.json :

"packageManager": "pnpm@10.28.2"
6️⃣ Code général / bonnes pratiques

Pour tous les cas (scripts, Next.js, modules Node, tests…) : utiliser les méthodes conventionnelles modernes autorisées.

Toujours typer les variables et fonctions.

Toujours utiliser async/await pour les appels DB ou API.

Toujours gérer les erreurs (try/catch).

Ne jamais contourner les conventions pour un test rapide.

ESLint doit passer sans warning, notamment @typescript-eslint/no-require-imports.

7️⃣ Objectif général

Tout fichier, script ou module dans le projet doit respecter ces règles.

Les conventions modernes et standard sont désormais la norme et doivent être appliquées systématiquement.



⚡ Important : Ce prompt s’applique à tous les fichiers et cas d’usage du projet. Ne jamais revenir aux pratiques obsolètes.