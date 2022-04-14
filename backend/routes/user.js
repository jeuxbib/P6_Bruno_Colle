const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const pwd = require('../middleware/password-validator');

router.post('/signup', pwd.passwordSchema, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;