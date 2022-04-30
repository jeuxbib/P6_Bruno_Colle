const express = require('express');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path') //pour la gestion des fichiers envoyé par l'utilisateur
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const helmet = require('helmet');//protège les vulnérabilité d'en tête HTPP
const mongoSanitize = require('express-mongo-sanitize'); //prévenir les injections

//connexion à la bdd
mongoose.connect('mongodb+srv://' + process.env.DB_LOGIN + ':' + process.env.DB_PASS + '@cluster0.76ulj.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

<<<<<<< HEAD
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

=======
const app = express();

app.use(helmet());
app.use(mongoSanitize({
    replaceWith: '_'
}))

// gérer les erreurs CROS, ajout de middleware qui s'appliquera à toute les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //accéder à notre api depuis n'importe quelle origine '*'
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // ajout des headers mentionnés aux requetes envoyées vers notre api'
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoyer les requêtes avec les méthodes get post ...
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//affiche les images sans le path
>>>>>>> 74c627bee75864d75bf52f5b96a9e5f931ea5c1b
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

<<<<<<< HEAD
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/sauces', saucesRoutes)



module.exports = app
=======

app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes);

module.exports = app;



//motDePassPourLeP6 => userRead
//mdpPourLeP6 => simon 

>>>>>>> 74c627bee75864d75bf52f5b96a9e5f931ea5c1b
