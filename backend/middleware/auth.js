const jwt = require('jsonwebtoken');

/**AUTHENTIFICATION
 * récupere le token dans le headers.authorization apres bearer grace a l'espace
 * decode le token grace jwt.verif 
 * enregistre le userId du token dans une const
 * si un userId est dans la requete et qu'il est différent du userId
 * renvoi l'erreur 
 * sinon tout est bon alors on passe la requete au prochain middleware
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        console.log('echec');
        res.status(401).json({ error: error | "Requête non authentifiée !" });
    }
};