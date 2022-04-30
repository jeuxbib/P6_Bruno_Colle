const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
<<<<<<< HEAD
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
=======
});

userSchema.plugin(uniqueValidator); // évite un utilisateur inscrit deux fois avec la même adresse mail


module.exports = mongoose.model('user', userSchema)
>>>>>>> 74c627bee75864d75bf52f5b96a9e5f931ea5c1b
