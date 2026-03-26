# UI GUIDELINES — ADUTI

## UI Library

Le projet utilise exclusivement :

- shadcn/ui
- lucide-react
- Tailwind CSS

---

## Règles Obligatoires

- Toujours vérifier si un composant existe dans shadcn avant création.

https://ui.shadcn.com/docs/components

- Ne jamais recréer Button, Card, Input, Modal, etc.

- Toutes les icônes doivent provenir de lucide-react.

---

## Imports Standard

Utiliser :

@/components/ui/


---

## Styling

- Utiliser Tailwind uniquement
- Pas de CSS inline
- Pas de librairie UI supplémentaire


🧾 Gestion des formulaires

Tous les formulaires doivent :

utiliser Zod pour validation

afficher les erreurs utilisateur clairement

bloquer l’envoi si validation échoue

🔁 Gestion des erreurs

Les messages d’erreur doivent :

être lisibles

être liés au champ concerné

ne jamais exposer la logique backend