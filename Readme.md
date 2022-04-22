# OpenClassrooms P6 - API backend SoPekocko "Piquante"
6ème projet de la formation de [développeur web de OpenClassrooms](https://openclassrooms.com/fr/paths/185-developpeur-web)

## Scénario
Développement d'une application web nommée "Piquante" dans laquelle les utilisateurs pourront ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres utilisateurs.  
Le but est de créer le backend de l'application, le frontend étant déjà codé et fourni.

## Objectifs du projet et compétences évaluées
Développement Backend en Javascript
- Serveur **Node.js**
- Framework **Express**
- Base de données **MongoDB**
  - Hébergement sur MongoDB Atlas
  - Opérations relatives à la BDD réalisées avec mongoose
- **API REST**
- Sécurité **OWASP** et **RGPD**

## Mesures de sécurité mises en place
- Hashage du mot de passe utilisateur avec **bcrypt**
- Cryptage des emails utilisateurs dans la base de données avec **crypto-js**
- Manupulation sécurisée de la base de donnée avec **mongoose**
- Vérification que l'email utilisateur soit unique dans la base de données avec **mongoose-unique-validator**
- Utilisation de variables d'environnement pour les données sensibles avec **dotenv**
- Validation des données utilisateurs avec **@hapi/joi**
- Authentification de l'utilisateur par token avec **jsonwebtoken**
- Token d'authentification stocké dans un cookie coté client avec **express-session**
- Protection des headers avec **helmet**
- Log de chaque requête effectuée dans un fichier "assess.log" avec **morgan**

## Pour tester l'application

1. Cloner le [repo git](https://github.com/jeuxbib/P6_Bruno_Colle.git),

2. lancer le frontend :  
    - Dans un terminal, accéder au dossier du frontend
    - Installer les dépendances: **npm install**
    - Lancer: **ng serve**

3. Lancer le backend
    - Dans un autre terminal, accéder au dossier du backend
    - Installer les dépendances: **npm install**
    - Lancer **node server**

5. Le frontend est accessible à l'adresse http://localhost:4200

6. Pour des tests spécifiques (avec postman par exemple), le backend répond à l'adresse: http://localhost:3000 (attention: authentification requise pour toutes les routes /api/sauces/)