# ADUTI — Plateforme Officielle de l’Association des Informaticiens INPHB

## 📌 Présentation

ADUTI est la plateforme officielle de l’Association des DUT et DTS en Informatique de l’Institut National Polytechnique Félix Houphouët-Boigny (INP-HB) à Yamoussoukro.

Cette plateforme vise à centraliser :

- La présentation de l’association
- La gestion des membres
- La gestion des promotions
- La gestion des activités
- La communication entre membres

---

## 🎯 Objectifs du Projet

- Valoriser la communauté informatique INPHB
- Faciliter la gestion administrative des membres
- Mettre en avant les activités et événements
- Favoriser l’intégration socio-professionnelle
- Créer un espace numérique moderne et professionnel

---

## 👥 Public Cible

- Étudiants DUT Informatique
- Étudiants DTS Informatique
- Alumni
- Administration ADUTI
- Visiteurs publics

---

## 🧰 Stack Technique

### Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- lucide-react

### Backend
- Supabase
  - Base de données PostgreSQL
  - Authentification
  - Storage



# couleur de l'association 
13acfa
ffffff
c11e28![alt text](logo_association.jpeg.jpeg)


# reseaux de l'association 
Facebook : https://www.facebook.com/share/1ERtvdnwfR/

Instagram : https://www.instagram.com/aduticsi?igsh=enF6ejl5bzY3bm1n

LinkedIn : https://www.linkedin.com/company/association-des-dut-et-dts-en-informatique-de-l-inp-hb-aduti/

📧📞 Contactez nous :
E-mail : csiaduti@gmail.com

Tel : +225 0706548994 /+225 0788103388

chemin du logo : public\logo_association.jpeg
et des favicons

---

## 🤖 Règles Vibecoding & IA

Toutes les règles obligatoires sont définies dans :

👉 AI_RULES.md  
👉 BUSINESS_RULES.md  
👉 UI_GUIDELINES.md  
👉 DATABASE_SCHEMA.md  

Ces fichiers doivent être respectés strictement.

---

🔧 Connexion à la Base de Données

⚡ Note technique importante

La première étape du projet est de connecter le projet Next.js / React à la base de données Supabase déployée sur le VPS.

Toutes les fonctionnalités du site, notamment :

👥 la gestion des membres

🎯 la gestion des activités

🎓 la gestion des promotions

🔐 la gestion des rôles et permissions

dépendront directement de cette connexion.

Le frontend communique avec Supabase via son API fournie automatiquement par la plateforme.

🧱 Structure Backend et Accès Supabase

Même si Next.js est utilisé principalement pour le frontend, une structure doit être mise en place pour gérer proprement la communication avec Supabase.

Le projet doit contenir un fichier utilitaire centralisant la connexion à Supabase.

📁 Exemple de structure :

/lib
   supabase.ts


Ce fichier permet :

de centraliser la configuration Supabase

d’éviter la duplication du code

de garantir une connexion cohérente dans tout le projet

de faciliter la maintenance

🔐 Gestion des Variables Sensibles

Pour des raisons de sécurité, les informations de connexion à Supabase ne doivent jamais être écrites directement dans le code.

Les variables suivantes doivent être placées dans le fichier :

.env.local

Variables nécessaires :

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=


Ces variables permettent :

de sécuriser l’accès à la base de données

de faciliter la configuration selon l’environnement (local, production, VPS, etc.)

de respecter les bonnes pratiques professionnelles

✅ Vérification de la Connexion

Avant de commencer le développement des fonctionnalités, il est obligatoire de :

vérifier que le projet peut communiquer avec Supabase

tester la récupération des données depuis la base

valider la configuration des variables d’environnement

4️⃣ Bonnes pratiques à ce stade

✅ Toujours tester la connexion avant de coder les pages membres/activités

✅ Ne jamais mettre les clés dans le code public

✅ Préparer les fichiers utilitaires (lib/supabase.ts) avant tout composant


## 🚀 Installation Projet

⚠️ Ce projet utilise pnpm exclusivement.
Voir AI_RULES.md pour les règles complètes.
pnpm install
pnpm dev




📘 Explication détaillée de la vision du projet ADUTI
🎓 1. Présentation du projet

aduticsi est le site web officiel de l’association des étudiants informaticiens de la formation du cycle Technicien Supérieur de l’INPHB.

L'ADUTI, ou Association des DUT et DTS en Informatique de l'INP-HB, est une organisation étudiante active au sein de l'Institut National Polytechnique Félix Houphouët-Boigny à Yamoussoukro, en Côte d'Ivoire. Elle regroupe les étudiants des filières DUT (Diplôme Universitaire de Technologie) et DTS (Diplôme de Technicien Supérieur) en informatique. L'association organise régulièrement des événements pour promouvoir l'informatique et motiver les étudiants.

Objectifs Aduti
L'ADUTI vise à favoriser l'intégration socio-professionnelle des étudiants en informatique via des activités éducatives et événementielles. Elle met l'accent sur la motivation, la paix et les compétences techniques comme le big data ou les hackathons. Des vœux de rentrée et des messages festifs soulignent son rôle communautaire.

L’association regroupe :

• 👨‍🎓 les étudiants de deuxième année
• 👨‍🎓 les étudiants de troisième année
• 🧑‍💼 les alumnis

L’objectif du projet est de concevoir un site web moderne, original et professionnel permettant de centraliser :

• ℹ️ les informations sur l’association
• 👥 les membres
• 🎯 les activités
• 🌐 les contacts et réseaux

🏗️ 2. Structure globale du site

Le site est structuré autour de :

• 🏠 une page d’accueil
• 👥 une section membres
• 🎯 une section activités
• 🔐 des espaces réservés accessibles selon les rôles attribués

🌟 3. Page d’accueil

La page d’accueil est une landing page.

Elle permet :

• 🚪 d’entrer au cœur de l’association
• 🎨 de mettre en valeur l’identité visuelle
• 🏛️ de présenter l’association à travers son logo et son image

👥 4. Gestion des membres
📌 4.1 Principe général

Étant donné le nombre élevé de membres, le système met en place une gestion centralisée et structurée des membres.

Cette gestion repose sur :

• 📝 un système d’enregistrement des membres
• 🔎 des fonctions de recherche et de filtres
• 🛠️ une gestion administrative contrôlée

🔑 4.2 Enregistrement et connexion

Le site propose un système de connexion classique, similaire aux plateformes courantes.

• 🌍 La consultation du site est libre.
• 🚫 La connexion n’est pas obligatoire pour naviguer.
• ✅ En revanche, elle est indispensable pour :

o 👤 accéder à un espace personnel
o 🧾 gérer son profil
o 🔒 accéder aux fonctionnalités réservées aux membres

🖥️ 4.3 Interface de connexion

L’interface du formulaire de connexion comprend :

• 🧩 un formulaire de connexion standard
• 🔗 en dessous du formulaire, un lien :
« Pas encore inscrit ? S’enregistrer »

• ⚠️ une alerte informative indiquant :
« Accès uniquement réservé aux membres »

Cette mention permet de préciser que :

• 🔐 l’inscription est réservée aux membres de l’association
• 🛡️ l’accès aux fonctionnalités internes est sécurisé
• 🤝 Pas la peine de s’inquiéter de l’aspect sécuritaire on va accepter ça jusqu’à ce que le maximum de personnes s’enregistre puis après les admins pour le faires dans leur espace ce qui veux dire qu’il faut prévoir quelque choses

📂 4.4 Organisation et informations des membres

Chaque membre est organisé par promotion et possède les informations suivantes.

📄 Informations générales

• 📅 Année d’intégration du cycle
• 📅 Année de fin du cycle
• 🖼️ Photos (2 maximum)
• 🎓 Statut : étudiant ou alumni
• 🏷️ Poste (président, trésorier, etc. ou aucun)

• 🧩 Rôle :

o aucun (par défaut)
o admin
o super admin

• ⚙️ Fonction :

o gestion_activites (ou aucune)

👨‍🎓 Cas d’un étudiant

• 📝 Description
• 📞 Contact
• 💼 Portfolio
• ▶️ Chaîne YouTube
• 💼 LinkedIn

🧑‍💼 Cas d’un alumni

• 💼 Poste actuel
• 📝 Description du poste

🛠️ 4.5 Gestion administrative des membres

Les admins et le super admin disposent d’un espace de gestion leur permettant :

• ➕ d’enregistrer manuellement un membre
• ✏️ de modifier ou compléter les informations d’un membre
• ✅ d’assurer la cohérence et la fiabilité des données
• 🔎 d’utiliser la recherche et les filtres (par promo, statut, poste, etc.)

🎓 5. Gestion des promotions

Les promotions sont gérées via une table dédiée.

📌 Attribut principal

• is_current_promo : true ou false

📏 Règles

• ⚠️ une seule promotion peut être définie comme promotion active
• 🔐 seuls les admins et le super admin peuvent définir ou modifier la promotion active

🎯 6. Gestion des activités
🧩 6.1 Structure d’une activité

Une activité comprend :

• 🏷️ un titre
• 📝 une description
• 🖼️ des images ou affiches

📊 6.2 Organisation des activités

• 📚 Les activités sont organisées par promotion
• ⭐ Seule la promotion active peut publier de nouvelles activités
• 🖼️ Les activités sont généralement des affiches ou des photos accompagnées d’une description

🔐 7. Rôles, fonctions et accès (clarification)
🧠 7.1 Différence entre rôle et fonction

• 🎭 Rôle : donne accès à un espace du site
• ⚙️ Fonction : donne le droit d’effectuer une action précise

👉 Une fonction seule ne donne jamais accès à un espace sans le rôle approprié.

👑 7.2 Rôles existants

• 👤 Membre (aucun rôle de gestion)
• 🛠️ Admins (gestion limitée)
• 🧠 Super admin (gestion totale)

⚙️ 7.3 Fonction gestion_activites

La fonction gestion_activites permet :

• ➕ de publier
• ✏️ modifier
• ❌ supprimer des activités

Elle peut être attribuée :

• 👑 aux présidents
• 👥 à certains membres du bureau

⚠️ Cette fonction n’est utilisable que si l’utilisateur possède le rôle admin.

👑 8. Présidents et bureaux
🧑‍💼 8.1 Président

Le président :

• 👤 est un membre ayant le poste « président »
• ⚙️ reçoit par défaut la fonction gestion_activites
• 🔐 ne peut l’utiliser que s’il possède le rôle admin

👉 Le poste seul ne donne aucun accès technique.

👥 8.2 Bureau

Le bureau d’une promotion est composé :

• 👨‍🎓 des membres de la même promotion
• 🏷️ ayant un poste différent de « aucun »

Le président peut :

• ⚙️ attribuer la fonction gestion_activites à un membre de son bureau
• 📚 uniquement pour sa promotion

🛡️ 9. Espaces et permissions
🛠️ 9.1 Espace admins

Les admins peuvent :

• 👥 gérer les membres
• 🔎 utiliser la recherche et les filtres
• 🎯 gérer les publications de leur promotion
• ⭐ définir la promotion active
• 🧩 attribuer le rôle admin (selon les règles)

🔑 9.2 Attribution du rôle admin

• 👥 Les admins et le super admin peuvent attribuer le rôle admin
• 👑 Le rôle admin ne peut être attribué qu’à un président
• 🧾 Chaque attribution est liée à son auteur

Un admin :

• ❌ ne peut retirer le rôle admin qu’à la personne à qui il l’a attribué

🧠 9.3 Super admin

Le super admin :

• 🌍 possède tous les droits
• 🔄 peut attribuer ou retirer le rôle admin à n’importe quel président
• 📚 peut agir sur toutes les promotions et toutes les publications

🔒 10. Sécurité et cohérence

• 🏷️ Les postes sont déclaratifs
• 🔐 Les accès sont contrôlés uniquement par les rôles
• 🛡️ Aucun accès sensible n’est possible sans validation par les admins ou le super admin
• 🚫 Cela empêche toute auto-attribution de privilèges

👑 11. Présidents par promotion

Le site propose :

• 📚 une liste des présidents par promotion
• 👤 la sélection d’un président
• 👥 l’affichage des membres de son bureau

🔎 12. Navigation et recherche

Le site intègre :

• 📊 des filtres par promotion
• 🌐 une recherche globale des membres et contenus

npx prisma generate ; npx prisma db push --accept-data-loss

    <div className="text-center">
                  <div className="text-xs font-black text-slate-600 uppercase tracking-widest">ESI — STIC</div>
                  <div className="text-[10px] text-slate-400 font-medium">École Supérieure d&apos;Industrie · INP-HB</div>
                </div>