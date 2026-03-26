L'ADUTI, ou Association des DUT et DTS en Informatique de l'INP-HB, est une organisation étudiante active au sein de l'Institut National Polytechnique Félix Houphouët-Boigny à Yamoussoukro. Elle regroupe les étudiants des filières DUT (Diplôme Universitaire de Technologie) et DTS (Diplôme de Technicien Supérieur) en informatique. L'association organise régulièrement des événements pour promouvoir l'informatique et motiver les étudiants.


Objectifs Principaux
L'ADUTI vise à favoriser l'intégration socio-professionnelle des étudiants en informatique via des activités éducatives et événementielles. Elle met l'accent sur la motivation, la paix et les compétences techniques comme le big data ou les hackathons. Des vœux de rentrée et des messages festifs soulignent son rôle communautaire.























1. Présentation générale du projet
ADUTI est le site web officiel de l’association des étudiants informaticiens de la formation du cycle Technicien Supérieur de l’INPHB.
L’association regroupe :
•	les étudiants de deuxième année,
•	les étudiants de troisième année,
•	les alumnis.
L’objectif du projet est de concevoir un site web moderne, original et professionnel permettant de centraliser :
•	les informations sur l’association,
•	les membres,
•	les activités,
•	les contacts et réseaux.
________________________________________
2. Structure globale du site
Le site est structuré autour de :
•	une page d’accueil,
•	une section membres,
•	une section activités,
•	des espaces réservés accessibles selon les rôles attribués.
________________________________________
3. Page d’accueil
La page d’accueil est une landing page.
Elle permet :
•	d’entrer au cœur de l’association,
•	de mettre en valeur l’identité visuelle,
•	de présenter l’association à travers son logo et son image.
________________________________________
4. Gestion des membres
4.1 Principe général
Étant donné le nombre élevé de membres, le système met en place une gestion centralisée et structurée des membres.
Cette gestion repose sur :
•	un système d’enregistrement des membres,
•	des fonctions de recherche et de filtres,
•	une gestion administrative contrôlée.
________________________________________
4.2 Enregistrement et connexion
Le site propose un système de connexion classique, similaire aux plateformes courantes.
•	La consultation du site est libre.
•	La connexion n’est pas obligatoire pour naviguer.
•	En revanche, elle est indispensable pour :
o	accéder à un espace personnel,
o	gérer son profil,
o	accéder aux fonctionnalités réservées aux membres.
________________________________________
4.3 Interface de connexion
L’interface du formulaire de connexion comprend :
•	un formulaire de connexion standard,
•	en dessous du formulaire, un lien :
« Pas encore inscrit ? S’enregistrer »
•	une alerte informative indiquant :
« Accès uniquement réservé aux membres »
Cette mention permet de préciser que :
•	l’inscription est réservée aux membres de l’association,
•	l’accès aux fonctionnalités internes est sécurisé.
•	Pa la pein de s’inquieter de l’aspect securitaire on va accepter ça jusqu’à ce que le maximum de personnes s’enregistre puis apres les adminspour le faires dans leur espace ce qui veux dire qu’il faut prevoir quelque choses
________________________________________
4.4 Organisation et informations des membres
Chaque membre est organisé par promotion et possède les informations suivantes.
Informations générales
•	Année d’intégration du cycle
•	Année de fin du cycle
•	Photos (2 maximum)
•	Statut : étudiant ou alumni
•	Poste (président, trésorier, etc. ou aucun)
•	Rôle :
o	aucun (par défaut),
o	admin,
o	super admin
•	Fonction :
o	gestion_activites (ou aucune)
________________________________________
Cas d’un étudiant
•	Description
•	Contact
•	Portfolio
•	Chaîne YouTube
•	LinkedIn
________________________________________
Cas d’un alumni
•	Poste actuel
•	Description du poste
________________________________________
4.5 Gestion administrative des membres
Les admins et le super admin disposent d’un espace de gestion leur permettant :
•	d’enregistrer manuellement un membre,
•	de modifier ou compléter les informations d’un membre,
•	d’assurer la cohérence et la fiabilité des données,
•	d’utiliser la recherche et les filtres (par promo, statut, poste, etc.).
________________________________________
5. Gestion des promotions
Les promotions sont gérées via une table dédiée.
Attribut principal :
•	is_current_promo : true ou false
Règles :
•	une seule promotion peut être définie comme promotion active,
•	seuls les admins et le super admin peuvent définir ou modifier la promotion active.
________________________________________
6. Gestion des activités
6.1 Structure d’une activité
Une activité comprend :
•	un titre,
•	une description,
•	des images ou affiches.
________________________________________
6.2 Organisation des activités
•	Les activités sont organisées par promotion.
•	Seule la promotion active peut publier de nouvelles activités.
•	Les activités sont généralement des affiches ou des photos accompagnées d’une description.
________________________________________
7. Rôles, fonctions et accès (clarification)
7.1 Différence entre rôle et fonction
•	Rôle : donne accès à un espace du site.
•	Fonction : donne le droit d’effectuer une action précise.
Une fonction seule ne donne jamais accès à un espace sans le rôle approprié.
________________________________________
7.2 Rôles existants
•	Membre (aucun rôle de gestion),
•	Admins (gestion limitée),
•	Super admin (gestion totale).
________________________________________
7.3 Fonction gestion_activites
La fonction gestion_activites permet :
•	de publier,
•	modifier,
•	supprimer des activités.
Elle peut être attribuée :
•	aux présidents,
•	à certains membres du bureau.
⚠️ Cette fonction n’est utilisable que si l’utilisateur possède le rôle admin.
________________________________________
8. Présidents et bureaux
8.1 Président
Le président :
•	est un membre ayant le poste « président »,
•	reçoit par défaut la fonction gestion_activites,
•	ne peut l’utiliser que s’il possède le rôle admin.
Le poste seul ne donne aucun accès technique.
________________________________________
8.2 Bureau
Le bureau d’une promotion est composé :
•	des membres de la même promotion,
•	ayant un poste différent de « aucun ».
Le président peut :
•	attribuer la fonction gestion_activites à un membre de son bureau,
•	uniquement pour sa promotion.
________________________________________
9. Espaces et permissions
9.1 Espace admins
Les admins peuvent :
•	gérer les membres,
•	utiliser la recherche et les filtres,
•	gérer les publications de leur promotion,
•	définir la promotion active,
•	attribuer le rôle admin (selon les règles).
________________________________________
9.2 Attribution du rôle admin
•	Les admins et le super admin peuvent attribuer le rôle admin.
•	Le rôle admin ne peut être attribué qu’à un président.
•	Chaque attribution est liée à son auteur.
Un admin :
•	ne peut retirer le rôle admin qu’à la personne à qui il l’a attribué.
________________________________________
9.3 Super admin
Le super admin :
•	possède tous les droits,
•	peut attribuer ou retirer le rôle admin à n’importe quel président,
•	peut agir sur toutes les promotions et toutes les publications.
________________________________________
10. Sécurité et cohérence
•	Les postes sont déclaratifs.
•	Les accès sont contrôlés uniquement par les rôles.
•	Aucun accès sensible n’est possible sans validation par les admins ou le super admin.
•	Cela empêche toute auto-attribution de privilèges.
________________________________________
11. Présidents par promotion
Le site propose :
•	une liste des présidents par promotion,
•	la sélection d’un président,
•	l’affichage des membres de son bureau.
________________________________________
12. Navigation et recherche
Le site intègre :
•	des filtres par promotion,
•	une recherche globale des membres et contenus.
________________________________________


13. Partie technique
Avant la réalisation des interfaces :
•	un schéma de base de données clair et cohérent doit être conçu.
Technologies prévues :
•	Base de données : Supabase
•	Frontend : React / Next.js
•	UI : shadcn/ui

