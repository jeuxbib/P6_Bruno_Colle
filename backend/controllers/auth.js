const User = require('../models/user')
const bcrypt = require('bcrypt')
const token = require('jsonwebtoken')


exports.login = (req, res, next) => {
    if (!req.body.email ||
        !req.body.password) {
        return res.status(400).send(new Error('Bad request!'));
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !!" })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe erroné !!" })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: token.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '2h' }
                        )
                    })
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({ error })
                })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error })
        });
}

exports.signup = (req, res, next) => {
    console.log("sign up")
    if (!req.body.email ||
        !req.body.password) {
        return res.status(400).send(new Error('Requête incomplète'));
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Compte créé !!' }))
                .catch(error => {
                    console.log(error)
                    res.status(400).json({ message: "Adresse email déjà utilisée !" })
                });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error })
        });
};