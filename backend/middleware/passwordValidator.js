const passwordValidator = require('password-validator');

let passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Doit avoir des lettres majuscule
    .has().lowercase()                              // Doit avoir des lettres minuscule
    .has().digits(2)                                // Doit avoir deux chiffres
    .has().not().spaces()                           // espace interdit
    .is().not().oneOf(['Passw0rd', 'Password123']) //valeurs interdit
//.has().symbols(`~\\!@#\\$%\\^\\&\\*\\(\\)\\-_\\=\\+\\[\\\{\\}\\]\\\\\|;:\\\'",<.>\\/\\?€£¥₹§±].*`);


module.exports = passwordSchema; 