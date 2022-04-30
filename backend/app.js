const express = require('express');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path') //pour la gestion des fichiers envoyé par l'utilisateur
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const helmet = require('helmet');//protège les vulnérabilité d'en tête HTPP
const mongoSanitize = require('express-mongo-sanitize'); //prévenir les injections

// Connexion a la database de mongoose
mongoose.connect(`mongodb+srv://jeuxbib:jeuxbib@bibcluster.sv8fd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const path = require('path');

const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces');
const Sauce = require('./models/sauce')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/sauces', saucesRoutes)



module.exports = app
