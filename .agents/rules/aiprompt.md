🤖 AI MASTER INSTRUCTIONS

Tu es un agent IA chargé de développer et maintenir le projet ADUTI, site web officiel des étudiants
informaticiens DUT/DTS de l’INP-HB.

Objectifs principaux :

Gestion des membres ADUTI

Gestion des promotions

Gestion des activités

Gestion des rôles et permissions

Présentation publique de l’association

Respect strict des règles métiers et techniques définies

📚 Références officielles à respecter

Les fichiers suivants ont priorité absolue sur toute suggestion de code :

AI_RULES.md

BUSINESS_RULES.md

UI_GUIDELINES.md

DATABASE_SCHEMA.md

ARCHITECTURE.md

PRODUCT_SPEC.md

⚠️ il ne faut jamais ignorer ces documents pour générer du code ou des composants.

🧠 Stack technique obligatoire

Next.js (App Router) + TypeScript

Supabase PostgreSQL

Prisma ORM (côté serveur uniquement)

Zod pour validation des données

ESLint + Prettier

GitHub Actions (CI/CD)

shadcn/ui pour UI

lucide-react pour icônes

Radix UI uniquement si nécessaire pour des composants bas niveau ou absents dans shadcn

🗄️ Gestion des données

Supabase : authentification, stockage fichiers, realtime, hébergement PostgreSQL

Prisma : communication avec la base, gestion des modèles, migrations, requêtes côté serveur

⚠️ Prisma exclusivement côté serveur

Accès direct à Supabase depuis UI : interdit

Toute donnée utilisateur doit être validée via Zod avant d’être envoyée

Flux obligatoire :

UI → Zod Validation → Service → Supabase / Prisma → Database

🧩 UI/UX et esthétique

Tous les composants et pages doivent être professionnels et esthétiques, modernes et harmonieux.

- La landing page doit être **impactante, captivante et moderne**, reflétant le site d'une vrai
  association de developpeur.
- Sections hero visuellement fortes avec illustration ou gradient et un CTA clair.
- Cartes, tableaux de features, icônes codées et illustrations légères pour un rendu tech-friendly.
- Animations subtiles et transitions fluides pour dynamiser l’expérience sans la surcharger.
- L’objectif est d’attirer immédiatement l’attention et de donner une **impression “wow”**, tout en
  restant harmonieux et professionnel.
- Tous les éléments visuels doivent être cohérents avec l’identité graphique et la charte ADUTI.
  Toujours respecter la hiérarchie visuelle et la cohérence globale.
- Ne jamais sacrifier lisibilité ou accessibilité pour l’esthétique.
- Vérifier le rendu sur mobile, tablette et desktop.
- Les composants doivent pouvoir être réutilisés sur d’autres pages sans perdre en qualité ou
  harmonie.

## Règles IA :

commencer par l’implémentation de la base de données (Supabase + Prisma) et le formulaire de
connexion moderne.

Vérifier toujours la doc officielle avant d’utiliser une librairie ou générer du code

Proposer le code le plus propre, typé et commenté possible

Respecter la hiérarchie visuelle et bonnes pratiques UX/UI

Priorité à la cohérence visuelle et fonctionnelle

❌ Ne pas toucher à GitHub Actions ou CI/CD pour l’instant.


tes reponse dans le chat doivent etre en français