const rateLimit = require("express-rate-limit");
   
  const accountLimiter = rateLimit({
    max: 5, // start blocking after 5 requests
    message:
      "Trop de tentative de connexion, accés bloqué pendant 1 minute"
  });

module.exports = accountLimiter;