const Sauce = require('../models/Sauce');
const fs = require('fs');

/**AJOUT D'UNE SAUCE
 * parse des infos en json
 * supprime l'id crée par le frontend
 * crée un nouveau schema ... fait une copie de tout les elements
 * récupère l'image
 * sauvegarde dans la base de données
 */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

/**AFFICHE TOUTES LES SAUCES
 * find() pour trouver les elements dans api/sauces
 * affiche les sauces
 */
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/**AFFICHE UNE SAUCE
 * findOne() pour trouver la sauce séléctionner dans api/sauce/:id
 * affiche la sauce
 */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({ error }));
}

/**SUPPRIMER UNE SAUCE
 * findOne() pour retrouver la sauce séléctionner
 * s'il n'y a pas de sauce return err404
 * si je ne suis pas authorisé return err403 authentifié mais non authorisé
 * fs.unlink pour supprimer la photo du du system
 * supprime la sauce de grâce son ID api/sauce/:id
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: new Error('Sauce non trouvé !') });
            } if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({ error: new Error('Requête non autorisée !') });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

/**MODIFIER UNE SAUCE
 * S'il y a un nouveau  fichier, recherche la sauce
 * enregistre le nom de la sauce dans une const afin de la supprimer avec fs.unlink
 * 
 * sauceObject regarde s'il existe une image ou non 
 * si oui on traite la nouvelle image
 * sinon on traite l'objet entrant
 * ensuite on effectue la modification a partir de l'_id
 * avec les nouvelles modification
 */
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const ancienneImage = sauce.imageUrl.split(/images/)[1];
                fs.unlink(`./images/${ancienneImage}`, (err => {
                    if (err) console.log(err);
                    else {
                        console.log("Ancienne image effacé " + ancienneImage);
                    }
                }));
            })
    }
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch(error => res.status());
};

/**LIKE OR DISLIKE
 * recherche la sauce avec findOne()
 * switch du like
 * case = 1 update sauce avec $incremente like a 1 et $push de l'userId dans usersLiked
 * case = -1 update sauce avec $incremente dislike a 1 et $push de l'user dans usersDisliked
 * case = 0 si c'est usersLiked qui change on supprime le like
 *          si c'est usersDisliked qui change on supprime le dislike
 */
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 1:
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'Sauce like avec succès!' }))
                        .catch(error => res.status());
                    break;
                case -1:
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'Sauce dislike avec succès !' }))
                        .catch(error => res.status());
                    break;
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                            .then(() => res.status(201).json({ message: 'Like retirer !' }))
                            .catch(error => res.status());
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                            .then(() => res.status(201).json({ message: 'Dislike retirer !' }))
                            .catch(error => res.status());
                    }
                    break;
            }
        })
        .catch(error => res.status(404).json({ error }));
};