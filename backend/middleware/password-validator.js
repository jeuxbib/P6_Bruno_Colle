let passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
/**Requis
 * minimum 8 caractères
 * maximum 35
 * a 1 majuscule
 * a des minuscules
 * a 1 numéro
 * a 1 symbole
 * n'a pas d'espace
 * liste de mot de passe trop facile à eviter
 */
passwordSchema
    .is().min(8)
    .is().max(35)
    .has().uppercase(1)
    .has().lowercase()
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

/**Si le mot de passe ne respecte pas les exigeances de sécurité
 * retourne une erreur 400
 * sinon il passe à la suite 
*/
exports.passwordSchema = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ message: 'Le mot de passe ne respect pas les criteres \nEntre 8 et 35 caractères \n Une majuscule minimum \n Une minuscule minimum \n Un caractère spécial' })
    }
    next();
};