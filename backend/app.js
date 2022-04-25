//importer express
// pour créer des applis web avec Node :
const express     = require('express');
// pour faciliter les inéractions avec la bdd mongoDB:
const mongoose    = require('mongoose');
const path        = require('path');
// old replaceWith:
const sanitize = require("express-mongo-sanitize");
// pour sécuriser les en-tête http de l'application express:
const helmet = require("helmet");
const sauceRoutes = require('./routes/sauce');
const userRoutes  = require ('./routes/user');
const dotenv       = require("dotenv");
dotenv.config();


  //connexion mongoDB avec mongoose via dotenv pour plus de sécurité
  mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(()  => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  //mongoose.connect(`mongodb+srv://jeuxbib:jeuxbib@bibcluster.sv8fd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  //{ useNewUrlParser: true,
   //useUnifiedTopology: true })
  //.then(() => console.log('Connexion à MongoDB réussie !'))
  //.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // "*" permet d'accéder a l'API depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // autorisation d'utiliser certains headers sur l'objet requête
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // permet d'envoyer des requêtes avec ces méthodes
  next(); // passe l'exécution au middleware suivant
});


app.use(express.json());

// je protège l'appli de certaines vulnerabilités en protégeant les en-têtes

app.use(helmet());


// je nettoie les données user pour éviter des injections dans la BDD
app.use(sanitize());

// je configure les routes d'API
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
module.exports = app;