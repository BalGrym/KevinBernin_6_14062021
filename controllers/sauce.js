const Sauce = require('../models/Sauce');
const fs = require('fs');
 
exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(req.file.filename);
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Objet supprimé ! '}))
          .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
  
}

exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then ( sauce => {
    switch (req.body.like) {
      case 1 :
        if(sauce.usersLiked.indexOf(req.body.userId) == -1) {
          sauce.updateOne({ $inc: {likes: +1}, $push: {usersLiked: req.body.userId}})
            .then(() => res.status(201).json({ message : "J'aime !"}))
            .catch( error => res.status(400).json({ error }));
        } 
        break;
  
      case -1 : 
        if(sauce.usersDisliked.indexOf(req.body.userId) == -1) {
          sauce.updateOne({ $inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}})
            .then(() => res.status(201).json({ message : "J'aime !"}))
            .catch( error => res.status(400).json({ error }));
        } 
        break;
  
      case 0 :
        if(sauce.usersLiked.indexOf(req.body.userId) > -1) {
          sauce.updateOne({ $inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
            .then(() => res.status(201).json({ message : "Change d'avis"}))
            .catch( error => res.status(400).json({ error }));
        } 
        else if (sauce.usersDisliked.indexOf(req.body.userId) > -1) {
          sauce.updateOne({ $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
            .then(() => res.status(201).json({ message : "Change d'avis"}))
            .catch( error => res.status(400).json({ error }));
        }
        break;
  
    };
  })
  .catch(error => res.status(500).json({ error }));
}