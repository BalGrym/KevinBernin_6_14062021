const passwordSchema = require('../models/passwords');

/* Ce module fournit une validation de base des mots de passe. */
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        return res.status(400).json({error: "Le mot de passe est trop faible ! " + passwordSchema.validate(req.body.password, {list:true})})
    }else{
        next();
    }
}