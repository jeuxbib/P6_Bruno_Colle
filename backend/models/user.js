const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // évite un utilisateur inscrit deux fois avec la même adresse mail


module.exports = mongoose.model('user', userSchema)
