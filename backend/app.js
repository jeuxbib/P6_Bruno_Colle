//importer express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
require('dotenv').config();


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


  //connexion mongoDB avec mongoose via dotenv pour plus de sécurité
  mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(()  => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  //mongoose.connect(`mongodb+srv://jeuxbib:jeuxbib@bibcluster.sv8fd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  //{ useNewUrlParser: true,
   // useUnifiedTopology: true })
  //.then(() => console.log('Connexion à MongoDB réussie !'))
  //.catch(() => console.log('Connexion à MongoDB échouée !'));

// Lancement de Express
const app = express();

//MIDDLEWARES

// Configuration cors
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', process.env.AUTHORIZED_ORIGIN);
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});
// Parse le body des requetes en json
app.use(bodyParser.json());
// Log toutes les requêtes passées au serveur (sécurité)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
// Sécurise les headers
app.use(helmet());
// Utilisation de la session pour stocker de manière persistante le JWT coté front
app.use(session({ secret: process.env.COOKIE_KEY, cookie: { maxAge: 900000 }})) // cookie stocké pendant 15 min

/**
* ROUTES
*/
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;