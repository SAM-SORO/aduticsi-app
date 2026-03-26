
---

## ✅ CONTENU COMPLET

```md
# PRODUCT SPECIFICATION — ADUTI

## 1. Présentation Générale

ADUTI est la plateforme officielle de l’association des étudiants informaticiens du cycle Technicien Supérieur de l’INPHB.

Elle permet de centraliser :

- Les informations sur l’association
- Les membres
- Les promotions
- Les activités
- Les espaces administratifs

---

## 2. Structure Globale du Site

Le site comprend :

- Une landing page
- Une section membres (page)
- Une section activités (pagee)
- Une section a propos
- Des espaces privés selon les rôles

---

## 3. Page d’Accueil

Objectifs :

- Présenter l’identité ADUTI
- Mettre en valeur le logo
- Introduire l’association

---

## 4. Gestion des Membres

### 4.1 Principe

Gestion centralisée avec :

- Enregistrement membres
- Recherche et filtres
- Gestion administrative

---

### 4.2 Connexion

- Consultation libre
- Connexion obligatoire pour fonctionnalités internes

---

### 4.3 Interface Connexion

Doit contenir :

- Formulaire login, inscription

---

### 4.4 Informations Membres

#### Informations Générales

- Année intégration
- Année fin cycle
- Photos (max 2)
- Statut : étudiant ou alumni
- Poste
- Rôle
- Fonction

---

#### Étudiant

- Description
- Contact
- Portfolio
- YouTube
- LinkedIn

---

#### Alumni

- Poste actuel
- Description poste

---

### 4.5 Gestion Administrative

Admins peuvent :

- Ajouter membres
- Modifier membres
- Rechercher
- Filtrer

---

## 5. Gestion Promotions

- Table dédiée
- Attribut is_current_promo
- Une seule promotion active

---

## 6. Gestion Activités

### Structure Activité

- Titre
- Description
- Images

### Organisation

- Liées aux promotions
- Seule promotion active publie

---

## 7. Rôles et Fonctions

### Rôles

- Membre
- Admin
- Super Admin

---

### Fonction gestion_activites

Permet :

- Créer activité
- Modifier activité
- Supprimer activité

Nécessite rôle admin.

---

## 8. Président et Bureau

Président :

- Poste déclaratif
- Fonction gestion_activites par défaut
- Nécessite rôle admin

---

## 9. Espaces Admin

Admins peuvent :

- Gérer membres
- Gérer activités
- Définir promotion active
- Attribuer rôle admin

---

## 10. Super Admin

Possède :

- Tous les droits
- Gestion globale

---

## 11. Présidents par Promotion

- Liste présidents
- Affichage bureau

---

## 12. Navigation

- Recherche globale
- Filtres promotion
