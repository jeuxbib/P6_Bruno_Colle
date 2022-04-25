const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const helmet = require("helmet");


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({extended:true}));
app.use(helmet());
// Removes the X-Powered-By header if it was set.
app.disable('x-powered-by')
app.use(helmet.hidePoweredBy()); 

const path = require('path');

// paths routes
const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");

//connexion mongoDB avec mongoose via dotenv pour plus de sécurité
  mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(()  => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 
  app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // Header for same source helmet images
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();

});

// base route

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); 



module.exports = app;
