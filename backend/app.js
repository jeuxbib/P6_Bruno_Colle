const express = require('express');
const helmet = require("helmet");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Déclaration des routes
const userRoute = require('./routes/user');
const sauceRoute = require('./routes/sauce');

// Autorise l'accés à l'api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Connexion a la database de mongoose
mongoose.connect(`mongodb+srv://jeuxbib:jeuxbib@bibcluster.sv8fd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); 

// Recupération des images depuis le dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoute);

// Exportation de APP pour pouvoir l'utiliser depuis les autres fichiers
module.exports = app;