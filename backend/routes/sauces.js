const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer--config')
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth')

router.get('/:id', auth, saucesCtrl.getOne)
router.get('/', auth, saucesCtrl.getAll)
router.post('/', auth, multer, saucesCtrl.createSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.post('/:id/like', auth, saucesCtrl.likeSauce)

module.exports = router;