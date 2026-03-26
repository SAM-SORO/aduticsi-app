# Règles de Débogage & Bonnes Pratiques pour Agents IA

## Principe Fondamental

Avant de modifier du code pour corriger un bug, **comprends d'abord la cause racine**. Ne fais
jamais de changements à l'aveugle.

---

## 1. Toujours vérifier les versions des dépendances

Avant de proposer une solution, **consulte `package.json`** pour identifier les versions exactes des
bibliothèques utilisées. Des versions majeures différentes (ex: Zod v3 vs Zod v4) ont des API et
comportements radicalement différents.

**Exemple critique** : `@hookform/resolvers` + Zod v4 nécessite un resolver qui comprend les deux
API. Ne pas vérifier les versions peut mener à des corrections qui ne fonctionneront jamais.

```
→ Avant toute correction, exécute : cat package.json | grep -E "zod|react-hook-form|resolvers|prisma"
```

---

## 2. Analyser le flux de données complet

Pour un bug de formulaire, trace le flux **de bout en bout** :

1. **Source des données** : D'où viennent les options ? (API, base, statique)
2. **Rendu HTML** : Quelles sont les `value` réelles des `<option>` ?
3. **Capture de l'événement** : Comment le framework (React Hook Form, etc.) intercepte le
   `onChange` ?
4. **Validation** : Quel schéma (Zod, Yup...) valide les données ? Avec quelles règles exactes ?
5. **Soumission** : Quelles données arrivent au serveur ?

---

## 3. Utiliser le debugging par observation, pas par supposition

Ajoute des `console.log` ciblés plutôt que de deviner :

```tsx
// Observer les valeurs du formulaire en temps réel
const watchedValues = watch();
console.log('[Debug] form values:', JSON.stringify(watchedValues));

// Observer les données chargées
console.log('[Debug] data loaded:', JSON.stringify(data));
```

**Supprime toujours les logs de debug après résolution.**

---

## 4. Respecter les patterns standard des bibliothèques

- **React Hook Form** : Utilise `register()` pour les champs natifs (`<input>`, `<select>`).
  N'utilise `setValue()` que quand `register()` ne peut pas s'appliquer (composants custom).
- **Ne jamais mettre de `key` dynamique** sur un élément qui utilise `register()` — cela casse la
  liaison `ref`.
- **`defaultValues`** : Toujours initialiser TOUS les champs, y compris les selects, avec des
  valeurs du bon type.

---

## 5. Vérifier la compatibilité entre bibliothèques

| Vérification                        | Pourquoi                             |
| ----------------------------------- | ------------------------------------ |
| Version de Zod vs zodResolver       | Zod v3 et v4 ont des API différentes |
| Version de React vs react-hook-form | RHF v7 nécessite React 16.8+         |
| Prisma Client vs Prisma CLI         | Doivent être synchronisés            |
| next vs @supabase/ssr               | Vérifier la compatibilité SSR        |

---

## 6. Processus de résolution systématique

```
1. REPRODUIRE → Confirmer le bug existe réellement
2. OBSERVER  → Ajouter des logs ciblés, lire les erreurs exactes
3. ANALYSER  → Identifier la couche responsable (UI, validation, API, DB)
4. VÉRIFIER  → Tester la correction isolément avant de l'intégrer
5. NETTOYER  → Retirer les logs de debug, supprimer les fichiers temporaires
```

---

## 7. Ne jamais ignorer les données réelles

Quand un `<select>` "ne fonctionne pas", vérifie **les valeurs réelles** des options :

```tsx
// Les options ont-elles des values non-vides ?
console.log(
  'options:',
  promotions.map((p) => ({ id: p.id, name: p.name })),
);
// Un id vide ("") passera visuellement mais échouera à la validation min(1)
```
