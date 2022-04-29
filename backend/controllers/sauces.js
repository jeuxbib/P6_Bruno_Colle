const Sauces = require("../models/sauces");
const fs = require("fs");

// get all sauces

exports.getSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error : "hello"}));
};

// get one sauce

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Create sauce

exports.createSauce = (req, res, next) => {
  // parse body
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // object body and add sauce in the database
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "created sauce",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
        message: "uncreated sauce",
      });
    });
};

exports.likeSauce = (req, res, next) => {
  // find sauce with this id
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // get number of body.like (-1 / 0 / 1)
      const like = req.body.like;
      // if same user already like remove the like
      if (sauce.usersLiked.includes(req.body.userId)) {
        sauce.likes--;
        const index = sauce.usersLiked.indexOf(req.body.userId);
        sauce.usersLiked.splice(index, 1);
      } 
      // if not check the number and add a like if = 1
      else if (like === 1) {
        sauce.likes++;
        sauce.usersLiked.push(req.body.userId);
      }
      // if same user already dislike remove the dislike
      if (sauce.usersDisliked.includes(req.body.userId)) {
        sauce.dislikes--;
        const index = sauce.usersDisliked.indexOf(req.body.userId);
        sauce.usersDisliked.splice(index, 1);
      } 
      
      // if not check the number and add a dislike if = -1
      else if (like === -1) {
        sauce.dislikes++;
        sauce.usersDisliked.push(req.body.userId);
      }
      sauce
        .save()
        .then(() => res.status(200).json({ message: "(dis)liked sauce" }))
        .catch((error) =>
          res
            .status(400)
            .json({ error: "impossible to (dis)liked sauce !" })
        );
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  // get body
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // update the sauce 
  Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "modified sauce" }))
    .catch((error) => res.status(403).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // fine sauce with right id
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // no such id
      if (!sauce) {
        res.status(404).json({
          error: new Error("No such Sauces!"),
        });
      }
      // id find but not the user created the sauce
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({
          error: new Error("Unauthorized request!"),
        });
      }
      // id find and right user
      Sauces.deleteOne({ _id: req.params.id });
      // delete img in the files
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // delete sauce in the data base
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "deleted sauce" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};