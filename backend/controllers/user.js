const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');//jsonwebtoken ce package permet de créer des token et de les verifier
const User = require('../models/Users');
const dotenv = require("dotenv");
dotenv.config();


//signup
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)//hash = la fonction pour "hashé" un mot de passe pour le crypter
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json ({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
//login
exports.login = (req, res, next) => {
    // on vérifie si l'email utilisateur existe dans la BDD
    User.findOne({ email: req.body.email })
      .then((user) => {
        console.log("user", user);
        if (!user) {
          // s'il n'existe pas
          return res.status(401).json({ error: "Erreur ! Utilisateur non trouvé !" });
        }
        bcrypt
          // on compare les entrées et les données
          .compare(req.body.password, user.password)
          .then((valid) => {
            console.log("validation", valid);
            if (!valid) {
              // si c'est différent
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              // si c'est bon, on envoie l'objet suivant
              userId: user._id,
              token: jwt.sign(
                //contient les données qu'on veut encoder dans ce token
                { userId: user._id },
                "RANDOM_TOKEN_SECRET", // avec une clé secrète
                { expiresIn: "24h" } // qui est valide 24h
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };