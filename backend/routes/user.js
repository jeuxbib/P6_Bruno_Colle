const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require("express-rate-limit");
const accountLimiter = require ('../middleware/accountLimiter')

router.post('/signup', userCtrl.signup);
router.post('/login', accountLimiter, userCtrl.login);

module.exports = router; 