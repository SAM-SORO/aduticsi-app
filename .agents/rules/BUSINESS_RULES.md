🧠 RÈGLES ANTI-HALLUCINATION IA

👉 Très utilisé en entreprise maintenant.

🔍 Vérification obligatoire

Avant de générer du code,  il faut :

Vérifier si la fonctionnalité existe déjà

Vérifier si un composant shadcn existe

Vérifier si un schéma Zod existe

Vérifier la cohérence avec Supabase

Vérifier BUSINESS_RULES.md

📦 Réutilisation obligatoire

 il faut :

privilégier la modification d’un fichier existant

éviter la duplication

utiliser les services existants

🧱 Règle composants UI

Avant de créer un composant :

vérifier shadcn

vérifier components/custom

vérifier design guidelines

🗄️ Règle base de données

Avant toute requête DB :

vérifier Prisma schema

vérifier Supabase tables

vérifier relations existantes

⚠️ Règle sécurité

 il faut refuser :

exposition de clés API

accès direct DB depuis UI

suppression de validation

contournement auth

🧪 Règle cohérence typage

Aucun any

Types dérivés Zod uniquement

Types Prisma synchronisés

🧩 Règle logique métier

Toute règle métier doit venir de :

👉 BUSINESS_RULES.md uniquement