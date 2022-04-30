const bcrypt = require('bcrypt'); // crypte les mots de passe
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passwordValidator = require('../middleware/passwordValidator'); //vérifie le format du mot de passe 


exports.signup = (req, res, next) => {
  if (!passwordValidator.validate(req.body.password)) {
    return res.status(401).json({ error: 'format du mot de passe incorrect. il faut minimum :  8 caractères, une majuscule, une minuscule, 2chiffres' });
  } else {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }

};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {

      if (user == null) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.DB_TOKEN,
              { expiresIn: '24h' }
            )
          });

        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};