/**Package de cryptage */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**SIGN-UP
 * hash avec bcrypt du mail et password rentrer dans le formulaire
 * sauvegarde dans la base de données
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Nouvel utilisateur Créé !' }))
                .catch(error => res.status(400).json({ message: 'Cet email est déjà utilisée !' }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**LOG-IN
 * recherche si le mail entré dans le formulaire existe
 * s'il n'existe pas retourne err404 ressource inexistante
 * 
 * bcrypt compare permet de savoir le mail et le mot de passe sont correct
 * s'il ne sont pas valide return err401 mot de passe incorrect
 * sinon génere un token grace a jsonwebtoken de l'userId 
 */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur inexistant !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};