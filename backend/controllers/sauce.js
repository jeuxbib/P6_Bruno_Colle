const Sauce = require('../models/Sauce');
const { resolveSoa } = require('dns');
const fs = require('fs'); //acces au fichier pour delete


//ajout d'une sauce

exports.createSauce =  (req, res, next) => {
    console.log('Je suis dans CreateSauce');
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id; // l'id est fournis automatiquement du coup on ne récupère pas celui du front 
    const sauce = new Sauce({
        ...sauceObject, //détail les info du body du front posté
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    });

 // .save() permet d'enregistrer la sauce dans la base de donnée et renvoyer une promise
    sauce.save().then(
        () => res.status(201).json({
            message: 'objet enregistré !'

        })) //tjrs envoyer une res  

        .catch(
            error => res.status(400).json({
                error
            }));
};
// modifier une sauce
exports.modifySauce = (req, res, next) => {
    console.log('Je suis dans modifySauce');
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    console.log('Je suis dans deleteSauce');
    //on va chercher l'url a supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(
                        error => res.status(400).json({
                            error
                        }))
            });
        })
        .catch(error => resolveSoa.status(500).json({ error }))
}
//une sauce par rapport à l'orderId
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => res.status(200).json(sauce))
        .catch(
            error => res.status(404).json({
                error
            }));
}
//toutes les sauces
exports.getAllSauce = (req, res, next) => {
    console.log('Je suis dans getAllsauce');
    Sauce.find().then(
        (Sauces) => res.status(200).json(Sauces)
    )
        .catch(
            error => res.status(400).json({
                error
            }))
}
//like une sauce
exports.likeSauce = (req, res, next) => {

    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id, })
            .then(
                () => res.status(201).json({
                    message: "L'utilisateur aime la sauce"
                })
            )
            .catch(
                error => res.status(400).json({
                    error
                }));
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id, })
            .then(
                () => res.status(201).json({
                    message: "L'utilisateur n'aime pas la sauce"
                })
            )
            .catch(
                error => res.status(400).json({
                    error
                }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id, })
                        .then(
                            () => res.status(201).json({
                                message: "L'utilisateur a enlevé son like"
                            })
                        )
                        .catch(
                            error => res.status(400).json({
                                error
                            }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id, })
                        .then(
                            () => res.status(201).json({
                                message: "L'utilisateur a enlevé son dislike"
                            })
                        )
                        .catch(
                            error => res.status(400).json({
                                error
                            }));
                }
            })

    }
}