const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique:true }, //"unique" pour dire qu'on peut ajouter qu'une seule fois l'adresse mail
    password: { type: String, required: true }
});

// ...vérifié par cette dépendance
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);