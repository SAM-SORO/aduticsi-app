# DATABASE SCHEMA — ADUTI

## Table members

- id
- name
- promo_id
- role
- function
- status
- description
- contacts
- photos

---

## Table promotions

- id
- name
- year_start
- year_end
- is_current_promo

---

## Table activities

- id
- title
- description
- promo_id
- images
- created_by

---

## Relations

members → promotions  
activities → promotions  
activities → members



🔗 Synchronisation Frontend / Supabase

Chaque table Supabase doit correspondre :

à un schéma Zod

à un type TypeScript dérivé de Zod

Exemple logique :

Supabase Table → Zod Schema → Type TypeScript → UI / API

⚠️ Règle importante

Toute modification de table Supabase doit entraîner :

Mise à jour du schéma Zod

Mise à jour des types TypeScript

Vérification des formulaires concernés



Ne pas générer de code lié à CI/CD ou aux workflows GitHub pour le moment.