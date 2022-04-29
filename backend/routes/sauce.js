const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config'); //accepte les fichiers entrants

//post une sauce
router.post('/', auth, multer, stuffCtrl.createSauce)
//modifier une sauce
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
//supprimer la route
router.delete('/:id', auth, stuffCtrl.deleteSauce);
//route pour un sauce en fonction d'orderId
router.get('/:id', auth, stuffCtrl.getOneSauce)
// route pour toutes les sauces
router.get('/', auth, stuffCtrl.getAllSauce);
//gesstion des likes
router.post('/:id/like', auth, stuffCtrl.likeSauce);

module.exports = router;
